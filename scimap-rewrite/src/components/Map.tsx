import { useState, useRef, useMemo, useCallback } from 'react'
import { Map } from 'react-map-gl/maplibre'
import DeckGL from '@deck.gl/react'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/constants'
import type { GeoLevel } from '@/lib/constants'
import {
  GEO_LEVELS,
  INITIAL_VIEW_STATE,
  createBaselineLayer,
  createColorScale,
} from '@/lib/map-config'
import type { TileProperties, SelectedFeature } from '@/lib/map-config'
import MapControls from './MapControls'
import DetailDrawer from './DetailDrawer'

export default function SCIMap() {
  const [geoLevel, setGeoLevel] = useState<GeoLevel>('states')
  const [perCapita, setPerCapita] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState<SelectedFeature | null>(null)
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const config = GEO_LEVELS[geoLevel]
  const colorScale = useMemo(() => createColorScale(config, perCapita), [config, perCapita])
  const mapLayer = useMemo(
    () => createBaselineLayer(config, perCapita, colorScale),
    [config, perCapita, colorScale],
  )

  const onHover = useCallback(
    (info: { x: number; y: number; object?: { properties?: TileProperties } }) => {
      const el = tooltipRef.current
      if (!el) return

      if (!info.object?.properties) {
        el.style.display = 'none'
        return
      }

      const props = info.object.properties
      const impact = props.NIH_tot_econ_impact ?? 0
      const pop = props.pop_2024 ?? 0
      const id = props[config.uniqueIdProperty] ?? ''
      const pc = pop > 0 ? impact / pop : 0

      el.innerHTML =
        `<div class="font-semibold">${config.label}: ${id}</div>` +
        `<div>Economic Impact: ${formatCurrency(impact)}</div>` +
        `<div>Population: ${pop.toLocaleString()}</div>` +
        (perCapita ? `<div>Per Capita: ${formatCurrency(pc)}</div>` : '')
      el.style.display = 'block'

      // Flip tooltip when near viewport edges
      const gap = 12
      const rect = el.getBoundingClientRect()
      const left =
        info.x + gap + rect.width > window.innerWidth
          ? info.x - gap - rect.width
          : info.x + gap
      const top =
        info.y + gap + rect.height > window.innerHeight
          ? info.y - gap - rect.height
          : info.y + gap
      el.style.left = `${left}px`
      el.style.top = `${top}px`
    },
    [config.uniqueIdProperty, config.label, perCapita],
  )

  const onClick = useCallback(
    (info: { object?: { properties?: TileProperties } }) => {
      if (!info.object?.properties) {
        setSelectedFeature(null)
        return
      }
      const props = info.object.properties
      const id = String(props[config.uniqueIdProperty] ?? '')
      requestAnimationFrame(() => setSelectedFeature({ id, properties: props }))
    },
    [config.uniqueIdProperty],
  )

  return (
    <div className="absolute inset-4 overflow-hidden rounded-xl shadow-lg">
      {/* Control panel */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-3 rounded-lg bg-white/90 p-3 shadow-md backdrop-blur-sm">
        <Tabs value={geoLevel} onValueChange={(v) => setGeoLevel(v as GeoLevel)}>
          <TabsList>
            {(Object.keys(GEO_LEVELS) as GeoLevel[]).map((key) => (
              <TabsTrigger key={key} value={key}>
                {GEO_LEVELS[key].label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex gap-1">
          <Button
            variant={perCapita ? 'ghost' : 'secondary'}
            size="sm"
            onClick={() => setPerCapita(false)}
          >
            Total
          </Button>
          <Button
            variant={perCapita ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setPerCapita(true)}
          >
            Per Capita
          </Button>
        </div>
      </div>

      <DeckGL
        viewState={viewState}
        onViewStateChange={({ viewState: vs }) => setViewState(vs as typeof INITIAL_VIEW_STATE)}
        controller
        layers={[mapLayer]}
        useDevicePixels={false}
        getCursor={({ isDragging }) => (isDragging ? 'grabbing' : 'grab')}
        onHover={onHover}
        onClick={onClick}
      >
        <Map mapStyle="https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json" />
      </DeckGL>

      <MapControls setViewState={setViewState} />

      {/* Hover tooltip (ref-driven, no re-renders) */}
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute z-20 rounded bg-black/80 px-3 py-2 text-sm text-white shadow-lg"
        style={{ display: 'none', left: 0, top: 0 }}
      />

      <DetailDrawer
        feature={selectedFeature}
        geoLabel={config.label.replace(/s$/, '')}
        perCapita={perCapita}
        onClose={() => setSelectedFeature(null)}
      />
    </div>
  )
}
