import { useMemo } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Events, track, type MapType } from '@/lib/analytics'
import { Map } from 'react-map-gl/maplibre'
import DeckGL from '@deck.gl/react'
import 'maplibre-gl/dist/maplibre-gl.css'
import { getPage } from '@/lib/content'
import {
  createLogColorScale,
  createChoroplethLayer,
  createStateOutlineLayer,
  LUT_OR_RD,
  LUT_MAGMA_INV,
} from '@/lib/map-shared'
import type { MapGeoConfig } from '@/lib/map-shared'
import { GEO_LEVELS as BASELINE_GEO_LEVELS, createColorScale, createBaselineLayer } from '@/lib/map-config'
import { GRANTS_GEO_LEVELS, GRANTS_COLOR_PROPERTY } from '@/lib/grants-map-config'
import { FY27_GEO_LEVELS, FY27_COLOR_PROPERTY } from '@/lib/fy27-map-config'
import { IDC_GEO_LEVELS, IDC_COLOR_PROPERTY } from '@/lib/idc-map-config'
import IconClusterLayer from '@/layers/icon-cluster-layer'
import { GRANT_LOSSES, type GrantTermination } from '@/data/grant-losses'
import type { Position } from '@deck.gl/core'

export const Route = createFileRoute('/maps')({
  component: MapsRoute,
})

const INDEX = getPage('maps-index')

const PREVIEW_VIEW_STATE = {
  longitude: -98.5795,
  latitude: 39.8283,
  zoom: 2.2,
  bearing: 0,
  pitch: 0,
  padding: { top: 0, bottom: 0, left: 0, right: 0 },
}

const BASE_MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json'

function ChoroplethPreview({
  config,
  colorProperty,
  lut,
  layerId,
}: {
  config: MapGeoConfig
  colorProperty: string
  lut: Uint8Array
  layerId: string
}) {
  const colorScale = useMemo(() => createLogColorScale(config.domain), [config])
  const mapLayer = useMemo(
    () => createChoroplethLayer(config, colorScale, colorProperty, lut, layerId),
    [config, colorScale, colorProperty, lut, layerId],
  )
  const outlineLayer = useMemo(
    () => createStateOutlineLayer(),
    [],
  )

  return (
    <div className="pointer-events-none absolute inset-0">
      <DeckGL
        viewState={PREVIEW_VIEW_STATE}
        controller={false}
        layers={[mapLayer, outlineLayer]}
        useDevicePixels={false}
        getCursor={() => 'pointer'}
      >
        <Map mapStyle={BASE_MAP_STYLE} attributionControl={false} />
      </DeckGL>
    </div>
  )
}

const getGrantPosition = (d: GrantTermination): Position => [d.lon, d.lat, 0]

function GrantsPreview() {
  const config = GRANTS_GEO_LEVELS.counties
  const colorScale = useMemo(() => createLogColorScale(config.domain), [config])
  const mapLayer = useMemo(
    () => createChoroplethLayer(config, colorScale, GRANTS_COLOR_PROPERTY, LUT_OR_RD, 'grants-preview'),
    [config, colorScale],
  )
  const outlineLayer = useMemo(() => createStateOutlineLayer(), [])
  const clusterLayer = useMemo(
    () =>
      new IconClusterLayer<GrantTermination>({
        data: GRANT_LOSSES,
        getPosition: getGrantPosition,
        getSize: 50,
        iconAtlas: '/location-icon-atlas-v7.png',
        iconMapping: '/location-icon-mapping.json',
        getColor: () => [0, 255, 0, 100],
        id: 'grants-preview-cluster',
        sizeScale: 40,
        pickable: false,
      }),
    [],
  )

  return (
    <div className="pointer-events-none absolute inset-0">
      <DeckGL
        viewState={PREVIEW_VIEW_STATE}
        controller={false}
        layers={[mapLayer, outlineLayer, clusterLayer]}
        useDevicePixels={false}
        getCursor={() => 'pointer'}
      >
        <Map mapStyle={BASE_MAP_STYLE} attributionControl={false} />
      </DeckGL>
    </div>
  )
}

function BaselinePreview() {
  const config = BASELINE_GEO_LEVELS.counties
  const colorScale = useMemo(() => createColorScale(config, false), [config])
  const mapLayer = useMemo(
    () => createBaselineLayer(config, false, colorScale),
    [config, colorScale],
  )
  const outlineLayer = useMemo(
    () => createStateOutlineLayer(),
    [],
  )

  return (
    <div className="pointer-events-none absolute inset-0">
      <DeckGL
        viewState={PREVIEW_VIEW_STATE}
        controller={false}
        layers={[mapLayer, outlineLayer]}
        useDevicePixels={false}
        getCursor={() => 'pointer'}
      >
        <Map mapStyle={BASE_MAP_STYLE} attributionControl={false} />
      </DeckGL>
    </div>
  )
}

const MAPS = [
  {
    slug: 'map-baseline',
    to: '/baseline' as const,
    preview: () => <BaselinePreview />,
  },
  {
    slug: 'map-grants',
    to: '/grants' as const,
    preview: () => <GrantsPreview />,
  },
  {
    slug: 'map-fy27',
    to: '/fy27' as const,
    preview: () => (
      <ChoroplethPreview
        config={FY27_GEO_LEVELS.counties}
        colorProperty={FY27_COLOR_PROPERTY}
        lut={LUT_MAGMA_INV}
        layerId="fy27-preview"
      />
    ),
  },
  {
    slug: 'map-idc',
    to: '/idc' as const,
    preview: () => (
      <ChoroplethPreview
        config={IDC_GEO_LEVELS.counties}
        colorProperty={IDC_COLOR_PROPERTY}
        lut={LUT_OR_RD}
        layerId="idc-preview"
      />
    ),
  },
]

function MapCard({
  slug,
  to,
  preview: Preview,
}: {
  slug: string
  to: '/baseline' | '/grants' | '/fy27' | '/idc'
  preview: () => React.JSX.Element
}) {
  const page = getPage(slug)
  const { title, blurb } = page.attrs
  const mapType = to.slice(1) as MapType

  return (
    <Link
      to={to}
      onClick={() => track(Events.MAP_CARD_CLICKED, { map_type: mapType })}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-video overflow-hidden">
        <Preview />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-brand-blue group-hover:text-brand-blue-light">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">{blurb}</p>
        <div className="mt-4 text-sm font-medium text-brand-blue group-hover:text-brand-blue-light">
          Explore map &rarr;
        </div>
      </div>
    </Link>
  )
}

function MapsRoute() {
  const a = INDEX.attrs

  return (
    <div className="flex w-full flex-col">
      <div className="w-full bg-brand-blue px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-white md:text-4xl">{a.title}</h1>
          <p className="mt-3 max-w-3xl text-lg leading-relaxed text-gray-200">
            {a.description}
          </p>
        </div>
      </div>

      <section className="w-full px-4 py-10 md:px-6 md:py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MAPS.map((m) => (
            <MapCard key={m.slug} slug={m.slug} to={m.to} preview={m.preview} />
          ))}
        </div>
      </section>
    </div>
  )
}
