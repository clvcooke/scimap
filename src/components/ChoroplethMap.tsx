import { useState, useRef, useMemo, useCallback, type ReactNode } from 'react'
import { Map } from 'react-map-gl/maplibre'
import DeckGL from '@deck.gl/react'
import type { Layer, PickingInfo } from '@deck.gl/core'
import { ScatterplotLayer } from '@deck.gl/layers'
import type { MjolnirGestureEvent } from 'mjolnir.js'
import 'maplibre-gl/dist/maplibre-gl.css'
import { typedKeys } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { INITIAL_VIEW_STATE } from '@/lib/map-config'
import {
  createLogColorScale,
  createChoroplethLayer,
  createStateOutlineLayer,
  positionTooltip,
  type LossGeoLevel,
  type MapGeoConfig,
  type TileProps,
} from '@/lib/map-shared'
import { useIsMobile } from '@/hooks/use-mobile'
import { exportMapAsPng } from '@/lib/export-map'
import MapControls from './MapControls'
import ColorScale from './ColorScale'

interface ChoroplethMapProps {
  geoLevels: Record<LossGeoLevel, MapGeoConfig>
  defaultLevel: LossGeoLevel
  colorProperty: string
  colorLUT: Uint8Array
  layerId: string
  useMagma?: boolean
  /** Build the inner HTML for the hover tooltip given tile props + current geo level. */
  renderTooltip: (props: TileProps, geoLevel: LossGeoLevel) => string
  /** Extra deck.gl layers to render on top (e.g. cluster layer). */
  extraLayers?: Layer[]
  /** Click handler forwarded to DeckGL. */
  onMapClick?: ((info: PickingInfo, event: MjolnirGestureEvent) => void) | null
  /** Whether to disable map controller (e.g. when a modal is open). */
  controllerDisabled?: boolean
  /** Slot for overlay content (modals, etc.) rendered inside the map container. */
  children?: ReactNode
  /** Optional initial coordinates to center the map on (e.g. from zip code search). */
  initialLat?: number | undefined
  initialLng?: number | undefined
  initialZoom?: number | undefined
}

export default function ChoroplethMap({
  geoLevels,
  defaultLevel,
  colorProperty,
  colorLUT,
  layerId,
  useMagma = false,
  renderTooltip,
  extraLayers = [],
  onMapClick,
  controllerDisabled = false,
  children,
  initialLat,
  initialLng,
  initialZoom,
}: ChoroplethMapProps) {
  const [geoLevel, setGeoLevel] = useState<LossGeoLevel>(defaultLevel)
  const [viewState, setViewState] = useState(() => ({
    ...INITIAL_VIEW_STATE,
    ...(initialLat != null && initialLng != null
      ? { latitude: initialLat, longitude: initialLng, zoom: initialZoom ?? 10 }
      : {}),
  }))
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    initialLat != null && initialLng != null ? [initialLng, initialLat] : null,
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  const config = geoLevels[geoLevel]
  const colorScale = useMemo(() => createLogColorScale(config.domain), [config])
  const dataLayer = useMemo(
    () => createChoroplethLayer(config, colorScale, colorProperty, colorLUT, layerId),
    [config, colorScale, colorProperty, colorLUT, layerId],
  )
  const outlineLayer = useMemo(() => createStateOutlineLayer(), [])
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
    if (containerRef.current) exportMapAsPng(containerRef.current)
  }, [])

  const onHover = useCallback(
    (info: { x: number; y: number; object?: { properties?: TileProps } }) => {
      if (isMobile) return
      const el = tooltipRef.current
      if (!el) return

      if (!info.object?.properties) {
        el.style.display = 'none'
        return
      }

      el.innerHTML = renderTooltip(info.object.properties, geoLevel)
      el.style.display = 'block'
      positionTooltip(el, info.x, info.y)
    },
    [geoLevel, isMobile, renderTooltip],
  )

  return (
    <div ref={containerRef} className="absolute inset-2 overflow-hidden rounded-xl shadow-lg md:inset-4">
      {/* Geo-level tabs */}
      <div className="absolute left-2 top-2 z-10 flex flex-col gap-2 rounded-lg bg-white/90 p-2 shadow-md backdrop-blur-sm md:left-4 md:top-4 md:gap-3 md:p-3">
        <Tabs value={geoLevel} onValueChange={(v: string) => setGeoLevel(v as LossGeoLevel)}>
          <TabsList>
            {typedKeys(geoLevels).map((key) => (
              <TabsTrigger key={key} value={key} className="text-xs md:text-sm">
                {geoLevels[key].label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <DeckGL
        viewState={viewState}
        onViewStateChange={({ viewState: vs }) => {
          if ('longitude' in vs) setViewState((prev) => ({ ...prev, ...vs }))
        }}
        controller={!controllerDisabled}
        layers={[dataLayer, outlineLayer, ...extraLayers, locationLayer].filter(Boolean)}
        useDevicePixels={false}
        glOptions={{ preserveDrawingBuffer: true }}
        getCursor={({ isDragging }) => (isDragging ? 'grabbing' : 'grab')}
        onHover={onHover}
        onClick={onMapClick ?? null}
      >
        <Map
          mapStyle="https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json"
          preserveDrawingBuffer
        />
      </DeckGL>

      {/* Labels-only map overlay so roads/cities render above shaded layers */}
      <Map
        {...viewState}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-labels-gl-style/style.json"
        interactive={false}
        preserveDrawingBuffer
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />

      <MapControls setViewState={setViewState} onGeolocate={handleGeolocate} onExport={handleExport} />

      {/* Color scale legend */}
      <div className="pointer-events-none absolute bottom-12 right-2 z-10 md:bottom-16 md:right-4">
        <ColorScale domain={config.domain} useMagma={useMagma} />
      </div>

      {/* Hover tooltip (desktop) */}
      {!isMobile && (
        <div
          ref={tooltipRef}
          className="pointer-events-none absolute z-20 max-w-xs rounded bg-black/80 px-3 py-2 text-sm text-white shadow-lg"
          style={{ display: 'none', left: 0, top: 0 }}
        />
      )}

      {children}
    </div>
  )
}
