import { describe, it, expect } from 'vitest'
import { WebMercatorViewport } from '@deck.gl/core'
import {
  createChoroplethLayer,
  createLogColorScale,
  LUT_OR_RD,
  type MapGeoConfig,
} from './map-shared'

// Geo levels share one choropleth layer id. Deck keeps that layer instance,
// so a county-to-state switch replaces props without a viewport change.
// Tileset2D then reused the county zoom-8 index against the state tile URL.
// A layer constructed with maxZoom 7 from the start already clamps; this
// drives the reused instance, which is the path that used to 404.

const LAYER_ID = 'grants-mvt-test'
const COLOR_SCALE = createLogColorScale([1, 100])

interface ChangeFlags {
  dataChanged: boolean
  propsChanged: boolean | string
  propsOrDataChanged: boolean
  somethingChanged: boolean
  viewportChanged: boolean
  updateTriggersChanged: false
  stateChanged: boolean
  extensionsChanged: boolean
}

interface SelectedTile {
  index: { z: number; x: number; y: number }
  content: unknown
  isLoading: boolean
  data: Promise<unknown> | unknown
}

interface DrivenLayer {
  props: { maxZoom: number | null }
  state?: {
    tileset?: { selectedTiles: SelectedTile[] | null } | null
  }
  context: { viewport: WebMercatorViewport }
  initializeState(): void
  updateState(params: {
    props: DrivenLayer['props']
    oldProps: DrivenLayer['props']
    context: { viewport: WebMercatorViewport }
    changeFlags: ChangeFlags
  }): void
  renderLayers(): unknown
  clone(props: { fetch: TileFetch; onTileError: () => void }): DrivenLayer
}

type TileFetch = (url: string) => Promise<unknown>

const INITIAL_FLAGS: ChangeFlags = {
  dataChanged: true,
  propsChanged: true,
  propsOrDataChanged: true,
  somethingChanged: true,
  viewportChanged: true,
  updateTriggersChanged: false,
  stateChanged: false,
  extensionsChanged: false,
}

const SWITCH_FLAGS: ChangeFlags = {
  dataChanged: true,
  propsChanged: 'data',
  propsOrDataChanged: true,
  somethingChanged: true,
  viewportChanged: false,
  updateTriggersChanged: false,
  stateChanged: false,
  extensionsChanged: false,
}

function viewportAt(zoom: number, longitude = -76.6413, latitude = 39.0458) {
  return new WebMercatorViewport({
    width: 1072,
    height: 1842,
    longitude,
    latitude,
    zoom,
    pitch: 0,
    bearing: 0,
  })
}

function geoConfig(level: string, maxZoom: number): MapGeoConfig {
  return {
    tileUrl: `https://example.com/tiles/${level}/{z}/{x}/{y}.pbf`,
    maxZoom,
    uniqueIdProperty: 'FIPS',
    label: level,
    domain: [1, 100],
  }
}

function tileZoom(url: string): number {
  const match = /\/(\d+)\/\d+\/\d+\.pbf(?:\?|$)/.exec(url)
  if (!match?.[1]) throw new Error(`tile URL has no zoom: ${url}`)
  return Number(match[1])
}

function flattenLayers(value: unknown): { constructor: { layerName?: string; name: string } }[] {
  if (Array.isArray(value)) return value.flatMap((entry) => flattenLayers(entry))
  if (value && typeof value === 'object') {
    return [value as { constructor: { layerName?: string; name: string } }]
  }
  return []
}

function selectedTiles(layer: DrivenLayer): SelectedTile[] {
  return layer.state?.tileset?.selectedTiles ?? []
}

async function settleTiles(layer: DrivenLayer) {
  const tiles = selectedTiles(layer)
  await Promise.all(
    tiles.map(async (tile) => {
      if (tile.isLoading) await tile.data
    }),
  )
}

function drive(layer: DrivenLayer, viewport: WebMercatorViewport, changeFlags: ChangeFlags) {
  const oldProps = layer.props
  layer.context = { viewport }
  if (!layer.state) layer.initializeState()
  layer.updateState({
    props: layer.props,
    oldProps,
    context: layer.context,
    changeFlags,
  })
  return layer
}

function choropleth(level: string, maxZoom: number, fetch: TileFetch) {
  const layer = createChoroplethLayer(
    geoConfig(level, maxZoom),
    COLOR_SCALE,
    'loss',
    LUT_OR_RD,
    LAYER_ID,
  )
  return (layer as unknown as DrivenLayer).clone({
    fetch,
    onTileError: () => undefined,
  })
}

describe('createChoroplethLayer tile zoom', () => {
  it('requests only the last available zoom when the map is zoomed past maxZoom', async () => {
    const requested: string[] = []
    const fetch: TileFetch = (url) => {
      requested.push(url)
      return Promise.resolve(featureCollection())
    }
    const layer = choropleth('states', 7, fetch)

    drive(layer, viewportAt(8), INITIAL_FLAGS)
    await settleTiles(layer)

    const zooms = selectedTiles(layer).map((tile) => tile.index.z)
    expect(zooms.length).toBeGreaterThan(0)
    expect(Math.max(...zooms)).toBeLessThanOrEqual(7)
    expect(requested.length).toBeGreaterThan(0)
    expect(Math.max(...requested.map(tileZoom))).toBeLessThanOrEqual(7)
    expect(renderedNames(layer)).toContain('GeoJsonLayer')

    requested.length = 0
    drive(layer, viewportAt(10), {
      ...INITIAL_FLAGS,
      dataChanged: false,
      propsChanged: false,
      propsOrDataChanged: false,
    })
    await settleTiles(layer)

    const farther = selectedTiles(layer).map((tile) => tile.index.z)
    expect(farther.length).toBeGreaterThan(0)
    expect(Math.max(...farther)).toBeLessThanOrEqual(7)
    expect(requested.every((url) => tileZoom(url) <= 7)).toBe(true)
    expect(renderedNames(layer)).toContain('GeoJsonLayer')
  })

  it('overzooms state tiles after a county layer switches geo level without a viewport change', async () => {
    const requested: string[] = []
    const fetch: TileFetch = (url) => {
      requested.push(url)
      return Promise.resolve(featureCollection())
    }
    const viewport = viewportAt(8)
    const counties = choropleth('counties', 9, fetch)

    drive(counties, viewport, INITIAL_FLAGS)
    await settleTiles(counties)

    const countyZooms = selectedTiles(counties).map((tile) => tile.index.z)
    expect(countyZooms).toContain(8)
    expect(Math.max(...countyZooms)).toBeLessThanOrEqual(9)

    requested.length = 0
    const states = choropleth('states', 7, fetch)
    const oldProps = counties.props
    counties.props = states.props
    counties.updateState({
      props: counties.props,
      oldProps,
      context: counties.context,
      changeFlags: SWITCH_FLAGS,
    })
    await settleTiles(counties)

    const stateZooms = selectedTiles(counties).map((tile) => tile.index.z)
    expect(stateZooms.length).toBeGreaterThan(0)
    expect(Math.max(...stateZooms)).toBeLessThanOrEqual(7)
    expect(requested.length).toBeGreaterThan(0)
    expect(requested.every((url) => url.includes('/tiles/states/'))).toBe(true)
    expect(requested.every((url) => tileZoom(url) <= 7)).toBe(true)
    expect(renderedNames(counties)).toContain('GeoJsonLayer')
  })

  it('keeps overzoomed state tiles at a Guam viewport', async () => {
    const requested: string[] = []
    const fetch: TileFetch = (url) => {
      requested.push(url)
      return Promise.resolve(featureCollection())
    }
    const layer = choropleth('states', 7, fetch)
    drive(layer, viewportAt(8, 144.7937, 13.4443), INITIAL_FLAGS)
    await settleTiles(layer)

    const zooms = selectedTiles(layer).map((tile) => tile.index.z)
    expect(zooms.length).toBeGreaterThan(0)
    expect(Math.max(...zooms)).toBeLessThanOrEqual(7)
    expect(requested.every((url) => tileZoom(url) <= 7)).toBe(true)
    expect(renderedNames(layer)).toContain('GeoJsonLayer')
  })
})

function renderedNames(layer: DrivenLayer): string[] {
  return flattenLayers(layer.renderLayers()).map(
    (sublayer) => sublayer.constructor.layerName ?? sublayer.constructor.name,
  )
}

function featureCollection() {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { loss: 1200 },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [0, 0],
              [1, 0],
              [1, 1],
              [0, 0],
            ],
          ],
        },
      },
    ],
  }
}
