import { useState, useRef, useMemo, useCallback } from 'react'
import { Map } from 'react-map-gl/maplibre'
import DeckGL from '@deck.gl/react'
import { ScatterplotLayer } from '@deck.gl/layers'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/constants'
import type { GeoLevel } from '@/lib/constants'
import { typedKeys } from '@/lib/utils'
import {
  GEO_LEVELS,
  INITIAL_VIEW_STATE,
  createBaselineLayer,
  createColorScale,
} from '@/lib/map-config'
import type { TileProperties, SelectedFeature } from '@/lib/map-config'
import { createStateOutlineLayer } from '@/lib/map-shared'
import { useIsMobile } from '@/hooks/use-mobile'
import { exportMapCard, currentDateLabel } from '@/lib/export-map'
import { BASELINE_SLOTS } from '@/lib/card-stats'
import MapControls from './MapControls'
import DetailDrawer from './DetailDrawer'
import MobileInfoCard from './MobileInfoCard'

export default function SCIMap({ initialLat, initialLng, initialZoom, displayLocation = true }: {
  initialLat?: number | undefined
  initialLng?: number | undefined
  initialZoom?: number | undefined
  displayLocation?: boolean
}) {
  const [geoLevel, setGeoLevel] = useState<GeoLevel>('states')
  const [perCapita, setPerCapita] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState<SelectedFeature | null>(null)
  const [previewFeature, setPreviewFeature] = useState<SelectedFeature | null>(null)
  const [viewState, setViewState] = useState(() => ({
    ...INITIAL_VIEW_STATE,
    ...(initialLat != null && initialLng != null
      ? { latitude: initialLat, longitude: initialLng, zoom: initialZoom ?? 10 }
      : {}),
  }))
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    displayLocation && initialLat != null && initialLng != null ? [initialLng, initialLat] : null,
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  const config = GEO_LEVELS[geoLevel]
  const colorScale = useMemo(() => createColorScale(config, perCapita), [config, perCapita])
  const mapLayer = useMemo(
    () => createBaselineLayer(config, perCapita, colorScale),
    [config, perCapita, colorScale],
  )
  const outlineLayer = useMemo(
    () => createStateOutlineLayer(GEO_LEVELS.states.tileUrl),
    [],
  )
  const locationLayer = useMemo(
    () =>
      userLocation
        ? new ScatterplotLayer({
            id: 'user-location',
            data: [{ position: userLocation }],
            getPosition: (d: { position: [number, number] }) => d.position,
            getFillColor: [66, 133, 244, 180],
            getLineColor: [255, 255, 255, 255],
            getRadius: 8,
            radiusMinPixels: 8,
            radiusMaxPixels: 12,
            stroked: true,
            lineWidthMinPixels: 2,
            pickable: false,
          })
        : null,
    [userLocation],
  )

  const handleGeolocate = useCallback((lat: number, lng: number) => {
    setUserLocation([lng, lat])
  }, [])

  const handleExport = useCallback(() => {
    if (!containerRef.current) return
    void exportMapCard({
      container: containerRef.current,
      title: 'NIH Economic Impact',
      subtitle: 'Baseline Federal Research Funding Across the U.S.',
      stats: BASELINE_SLOTS,
      meta: `${config.label}  ·  ${perCapita ? 'Per Capita' : 'Total'}  ·  ${currentDateLabel()}`,
      filename: 'scimap-baseline.png',
    })
  }, [config.label, perCapita])

  const onHover = useCallback(
    (info: { x: number; y: number; object?: { properties?: TileProperties } }) => {
      if (isMobile) return

      const el = tooltipRef.current
      if (!el) return

      if (!info.object?.properties) {
        el.style.display = 'none'
        return
      }

      const tile = info.object.properties
      const impact = tile.NIH_tot_econ_impact ?? 0
      const pop = tile.pop_2024 ?? 0
      const id = tile[config.uniqueIdProperty] ?? ''
      const pc = pop > 0 ? impact / pop : 0

      el.innerHTML =
        `<div class="font-semibold">${config.label}: ${id}</div>` +
        `<div>Economic Impact: ${formatCurrency(impact)}</div>` +
        `<div>Population: ${pop.toLocaleString()}</div>` +
        (perCapita ? `<div>Per Capita: ${formatCurrency(pc)}</div>` : '')
      el.style.display = 'block'

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
    [config.uniqueIdProperty, config.label, perCapita, isMobile],
  )

  const onClick = useCallback(
    (info: { object?: { properties?: TileProperties } }) => {
      if (!info.object?.properties) {
        setSelectedFeature(null)
        setPreviewFeature(null)
        return
      }
      const tile = info.object.properties
      const id = String(tile[config.uniqueIdProperty] ?? '')
      const feature = { id, properties: tile }

      if (isMobile) {
        requestAnimationFrame(() => setPreviewFeature(feature))
      } else {
        requestAnimationFrame(() => setSelectedFeature(feature))
      }
    },
    [config.uniqueIdProperty, isMobile],
  )

  return (
    <div ref={containerRef} className="absolute inset-2 overflow-hidden rounded-xl shadow-lg md:inset-4">
      {/* Control panel */}
      <div className="absolute left-2 top-2 z-10 flex flex-col gap-2 rounded-lg bg-white/90 p-2 shadow-md backdrop-blur-sm md:left-4 md:top-4 md:gap-3 md:p-3">
        <Tabs value={geoLevel} onValueChange={(v: string) => setGeoLevel(v as GeoLevel)}>
          <TabsList>
            {typedKeys(GEO_LEVELS).map((key) => (
              <TabsTrigger key={key} value={key} className="text-xs md:text-sm">
                {GEO_LEVELS[key].label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex gap-1">
          <Button
            variant={perCapita ? 'ghost' : 'secondary'}
            size="sm"
            className="text-xs md:text-sm"
            onClick={() => setPerCapita(false)}
          >
            Total
          </Button>
          <Button
            variant={perCapita ? 'secondary' : 'ghost'}
            size="sm"
            className="text-xs md:text-sm"
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
        layers={[mapLayer, outlineLayer, locationLayer].filter(Boolean)}
        useDevicePixels={false}
        deviceProps={{ webgl: { preserveDrawingBuffer: true } }}
        getCursor={({ isDragging }) => (isDragging ? 'grabbing' : 'grab')}
        onHover={onHover}
        onClick={onClick}
      >
        <Map
          mapStyle="https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json"
          attributionControl={false}
        />
      </DeckGL>

      <MapControls setViewState={setViewState} onGeolocate={handleGeolocate} onExport={handleExport} />

      {/* Hover tooltip (desktop only, ref-driven) */}
      {!isMobile && (
        <div
          ref={tooltipRef}
          className="pointer-events-none absolute z-20 rounded bg-black/80 px-3 py-2 text-sm text-white shadow-lg"
          style={{ display: 'none', left: 0, top: 0 }}
        />
      )}

      {/* Mobile preview card */}
      {isMobile && previewFeature && (
        <MobileInfoCard
          feature={previewFeature}
          geoLabel={config.label.replace(/s$/, '')}
          perCapita={perCapita}
          onSeeMore={() => {
            setSelectedFeature(previewFeature)
            setPreviewFeature(null)
          }}
          onClose={() => setPreviewFeature(null)}
        />
      )}

      <DetailDrawer
        feature={selectedFeature}
        geoLabel={config.label.replace(/s$/, '')}
        perCapita={perCapita}
        onClose={() => setSelectedFeature(null)}
      />
    </div>
  )
}
