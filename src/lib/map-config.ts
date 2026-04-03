import { scaleLinear, type ScaleLinear } from 'd3-scale'
import { MVTLayer } from '@deck.gl/geo-layers'
import { LUT_OR_RD, LUT_SIZE, FILL_ALPHA } from './color-lut'
import type { GeoLevel } from './constants'

// --- Types ---

export type TileProperties = Record<string, number>

export interface SelectedFeature {
  id: string
  properties: TileProperties
}

export interface GeoConfig {
  tileUrl: string
  maxZoom: number
  uniqueIdProperty: string
  label: string
  totalDomain: [number, number]
  perCapitaDomain: [number, number]
}

// --- Tile configuration ---

const DOMAIN = 'https://data.scienceimpacts.org'
const TILE_VERSION = 'baseline-v1'
export const INITIAL_VIEW_STATE = {
  longitude: -98.5795,
  latitude: 39.8283,
  zoom: 3.5,
}

export const GEO_LEVELS: Record<GeoLevel, GeoConfig> = {
  states: {
    tileUrl: `${DOMAIN}/tiles_states_baseline_${TILE_VERSION}/{z}/{x}/{y}.pbf`,
    maxZoom: 7,
    uniqueIdProperty: 'state',
    label: 'States',
    totalDomain: [50_000_000, 15_000_000_000],
    perCapitaDomain: [50, 5_000],
  },
  counties: {
    tileUrl: `${DOMAIN}/tiles_counties_baseline_${TILE_VERSION}/{z}/{x}/{y}.pbf`,
    maxZoom: 9,
    uniqueIdProperty: 'FIPS',
    label: 'Counties',
    totalDomain: [1, 4_000_000_000],
    perCapitaDomain: [0.01, 50_000],
  },
  districts: {
    tileUrl: `${DOMAIN}/tiles_districts_baseline_${TILE_VERSION}/{z}/{x}/{y}.pbf`,
    maxZoom: 9,
    uniqueIdProperty: 'GEOID',
    label: 'Districts',
    totalDomain: [10_000_000, 3_000_000_000],
    perCapitaDomain: [10, 5_000],
  },
  cities: {
    tileUrl: `${DOMAIN}/tiles_cities_baseline_${TILE_VERSION}/{z}/{x}/{y}.pbf`,
    maxZoom: 9,
    uniqueIdProperty: 'CBSA_FIPS',
    label: 'Cities',
    totalDomain: [10_000, 10_000_000_000],
    perCapitaDomain: [1, 10_000],
  },
}

// --- Layer factory ---

export function createBaselineLayer(
  config: GeoConfig,
  perCapita: boolean,
  colorScale: ScaleLinear<number, number>,
) {
  return new MVTLayer({
    id: 'baseline-mvt',
    data: [config.tileUrl],
    binary: true,
    pickable: true,
    autoHighlight: true,
    highlightColor: [0, 0, 0, 50],
    uniqueIdProperty: config.uniqueIdProperty,
    maxZoom: config.maxZoom,
    getLineColor: [255, 255, 255, FILL_ALPHA / 3],
    getLineWidth: 1,
    lineWidthMinPixels: 1,
    lineWidthUnits: 'pixels' as const,
    updateTriggers: { getFillColor: [colorScale, perCapita] },
    getFillColor: (f: { properties: TileProperties }) => {
      let v = f.properties.NIH_tot_econ_impact ?? 0
      if (perCapita) {
        const pop = f.properties.pop_2024 ?? 0
        v = pop > 0 ? v / pop : 0
      }
      const idx = Math.round(colorScale(v > 0 ? Math.log(v) : 0) * (LUT_SIZE - 1)) * 4
      return [LUT_OR_RD[idx], LUT_OR_RD[idx + 1], LUT_OR_RD[idx + 2], LUT_OR_RD[idx + 3]]
    },
  })
}

export function createColorScale(config: GeoConfig, perCapita: boolean) {
  const domain = perCapita ? config.perCapitaDomain : config.totalDomain
  const lower = domain[0] > 0 ? Math.log(domain[0]) : 0
  const upper = Math.log(domain[1])
  return scaleLinear().domain([lower, upper]).range([0, 1]).clamp(true)
}
