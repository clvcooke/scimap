import { useMemo } from 'react'
import { Map } from 'react-map-gl/maplibre'
import DeckGL from '@deck.gl/react'
import 'maplibre-gl/dist/maplibre-gl.css'
import { FY27_GEO_LEVELS, FY27_COLOR_PROPERTY } from '@/lib/fy27-map-config'
import {
  createLogColorScale,
  createChoroplethLayer,
  createStateOutlineLayer,
  LUT_MAGMA_INV,
} from '@/lib/map-shared'

const PREVIEW_VIEW_STATE = {
  longitude: -98.5795,
  latitude: 39.8283,
  zoom: 2.8,
  bearing: 0,
  pitch: 0,
  padding: { top: 0, bottom: 0, left: 0, right: 0 },
}

/**
 * A static, non-interactive preview of the FY27 budget impact map.
 * Renders the real choropleth tiles at the default US-wide view.
 */
export default function MapPreview() {
  const config = FY27_GEO_LEVELS.counties
  const colorScale = useMemo(() => createLogColorScale(config.domain), [config])
  const mapLayer = useMemo(
    () =>
      createChoroplethLayer(
        config,
        colorScale,
        FY27_COLOR_PROPERTY,
        LUT_MAGMA_INV,
        'fy27-preview-mvt',
      ),
    [config, colorScale],
  )
  const outlineLayer = useMemo(
    () => createStateOutlineLayer(FY27_GEO_LEVELS.states.tileUrl),
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
        <Map
          mapStyle="https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json"
          attributionControl={false}
        />
      </DeckGL>
    </div>
  )
}
