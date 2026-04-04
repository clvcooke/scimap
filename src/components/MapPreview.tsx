import { useMemo } from 'react'
import { Map } from 'react-map-gl/maplibre'
import DeckGL from '@deck.gl/react'
import 'maplibre-gl/dist/maplibre-gl.css'
import {
  GEO_LEVELS,
  createBaselineLayer,
  createColorScale,
} from '@/lib/map-config'

const PREVIEW_VIEW_STATE = {
  longitude: -98.5795,
  latitude: 39.8283,
  zoom: 2.8,
  bearing: 0,
  pitch: 0,
  padding: { top: 0, bottom: 0, left: 0, right: 0 },
}
import { createStateOutlineLayer } from '@/lib/map-shared'

/**
 * A static, non-interactive preview of the baseline funding map.
 * Renders the real choropleth tiles at the default US-wide view.
 */
export default function MapPreview() {
  const config = GEO_LEVELS.states
  const colorScale = useMemo(() => createColorScale(config, false), [config])
  const mapLayer = useMemo(
    () => createBaselineLayer(config, false, colorScale),
    [config, colorScale],
  )
  const outlineLayer = useMemo(
    () => createStateOutlineLayer(GEO_LEVELS.states.tileUrl),
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
