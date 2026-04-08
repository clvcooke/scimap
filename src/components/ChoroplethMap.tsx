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
  useLabelsStyle,
  type MapGeoConfig,
  type TileProps,
  type LossGeoLevel,
} from '@/lib/map-shared'
import { useIsMobile } from '@/hooks/use-mobile'
import MapControls from './MapControls'
import ShareMenu from './ShareMenu'
import ColorScale, { type ColorScheme } from './ColorScale'
import BudgetDrawer, { type BudgetDrawerConfig } from './BudgetDrawer'
import BudgetMobileCard from './BudgetMobileCard'

interface ChoroplethMapProps<K extends string> {
  geoLevels: Record<K, MapGeoConfig>
  defaultLevel: K
  /** Build the inner HTML for the hover tooltip given tile props + current geo level. */
  renderTooltip: (props: TileProps, geoLevel: K) => string

  // --- Layer creation (provide EITHER colorProperty+colorLUT+layerId OR layers callback) ---
  /** Property name for the color scale (used with colorLUT for automatic layer creation). */
  colorProperty?: string
  /** Pre-computed color lookup table (used with colorProperty). */
  colorLUT?: Uint8Array
  /** Deck.gl layer ID (used with colorProperty). */
  layerId?: string
  /** Callback that returns the data layers for the current geo config. Overrides colorProperty/colorLUT. */
  layers?: (config: MapGeoConfig) => Layer[]

  useMagma?: boolean
  colorScheme?: ColorScheme
  /** Override the domain used for the color scale legend. */
  colorScaleDomain?: [number, number]
  /** Extra deck.gl layers to render on top (e.g. cluster layer). */
  extraLayers?: Layer[]
  /** Click handler forwarded to DeckGL. */
  onMapClick?: ((info: PickingInfo, event: MjolnirGestureEvent) => void) | null
  /** Whether to disable map controller (e.g. when a modal is open). */
  controllerDisabled?: boolean
  /** Slot for overlay content (modals, etc.) rendered inside the map container. */
  children?: ReactNode
  /** Extra controls rendered below the geo-level tabs (e.g. per-capita toggle). */
  extraControls?: ReactNode
  /** Optional initial coordinates to center the map on (e.g. from zip code search). */
  initialLat?: number | undefined
  initialLng?: number | undefined
  initialZoom?: number | undefined
  /** When provided, clicking a region opens a detail drawer with this config. */
  drawerConfig?: BudgetDrawerConfig
  /** Whether to show user location dot when initial coords are provided. Defaults to true. */
  displayLocation?: boolean
  /** Called when the user changes the geo level tab. */
  onGeoLevelChange?: (level: K) => void
}

export default function ChoroplethMap<K extends string>({
  geoLevels,
  defaultLevel,
  renderTooltip,
  colorProperty,
  colorLUT,
  layerId,
  layers: layersFn,
  useMagma = false,
  colorScheme,
  colorScaleDomain,
  extraLayers = [],
  onMapClick,
  controllerDisabled = false,
  children,
  extraControls,
  initialLat,
  initialLng,
  initialZoom,
  drawerConfig,
  displayLocation = true,
  onGeoLevelChange,
}: ChoroplethMapProps<K>) {
  const [geoLevel, setGeoLevel] = useState<K>(defaultLevel)
  const [selectedProps, setSelectedProps] = useState<TileProps | null>(null)
  const [previewProps, setPreviewProps] = useState<TileProps | null>(null)
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
  const labelsStyle = useLabelsStyle()

  const config = geoLevels[geoLevel]
  const domain = colorScaleDomain ?? config.domain
  const colorScale = useMemo(() => createLogColorScale(domain), [domain])
  const dataLayers = useMemo(() => {
    if (layersFn) return layersFn(config)
    if (colorProperty && colorLUT) {
      return [createChoroplethLayer(config, colorScale, colorProperty, colorLUT, layerId ?? 'choropleth-mvt')]
    }
    return []
  }, [config, colorScale, colorProperty, colorLUT, layerId, layersFn])
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
      positionTooltip(el, info.x, info.y, containerRef.current ?? undefined)
    },
    [geoLevel, isMobile, renderTooltip],
  )

  const handleClick = useCallback(
    (info: PickingInfo, event: MjolnirGestureEvent) => {
      // If a custom click handler is provided, delegate to it
      if (onMapClick) {
        onMapClick(info, event)
        return
      }

      // Built-in drawer click handling
      if (!drawerConfig) return

      const props = (info.object as { properties?: TileProps } | undefined)?.properties
      if (!props) {
        setSelectedProps(null)
        setPreviewProps(null)
        return
      }

      if (isMobile) {
        requestAnimationFrame(() => setPreviewProps(props))
      } else {
        requestAnimationFrame(() => setSelectedProps(props))
      }
    },
    [onMapClick, drawerConfig, isMobile],
  )

  return (
    <div ref={containerRef} className="absolute inset-2 overflow-hidden rounded-xl shadow-lg md:inset-8">
      {/* Control panel */}
      <div className="absolute left-2 top-2 z-10 flex flex-col gap-2 rounded-lg bg-white/90 p-2 shadow-md backdrop-blur-sm md:left-4 md:top-4 md:gap-3 md:p-3">
        <Tabs value={geoLevel} onValueChange={(v: string) => { const level = v as K; setGeoLevel(level); onGeoLevelChange?.(level) }}>
          <TabsList>
            {typedKeys(geoLevels).map((key) => (
              <TabsTrigger key={key} value={key} className="text-xs md:text-sm">
                {geoLevels[key].label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        {extraControls}
      </div>

      <DeckGL
        viewState={viewState}
        onViewStateChange={({ viewState: vs }) => {
          if ('longitude' in vs) setViewState((prev) => ({ ...prev, ...vs }))
        }}
        controller={!controllerDisabled}
        layers={[...dataLayers, outlineLayer, ...extraLayers, locationLayer].filter(Boolean)}
        useDevicePixels={false}
        deviceProps={{ webgl: { preserveDrawingBuffer: true } }}
        getCursor={({ isDragging, isHovering }) => (isDragging ? 'grabbing' : isHovering && (drawerConfig || onMapClick) ? 'pointer' : 'grab')}
        onHover={onHover}
        onClick={handleClick}
      >
        <Map
          mapStyle="https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json"
          attributionControl={false}
        />
      </DeckGL>

      {/* Labels-only map overlay so roads/cities render above shaded layers */}
      {labelsStyle && (
        <Map
          {...viewState}
          mapStyle={labelsStyle}
          interactive={false}
          attributionControl={false}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        />
      )}

      {/* Logo watermark */}
      <div className="absolute bottom-14 left-2 z-10 md:bottom-18 md:left-4">
        <img src="/logo_v3_white-01.png" alt="SCIMaP" className="h-10 w-10 md:h-12 md:w-12" />
      </div>

      <MapControls setViewState={setViewState} onGeolocate={handleGeolocate} />
      <ShareMenu className="absolute top-2 right-2 z-10 md:top-4 md:right-4" />

      {/* Color scale legend */}
      <div className="pointer-events-none absolute bottom-2 right-2 z-10 md:bottom-4 md:right-4">
        <ColorScale domain={domain} useMagma={useMagma} scheme={colorScheme} />
      </div>

      {/* Hover tooltip (desktop, fixed so it escapes overflow-hidden) */}
      {!isMobile && (
        <div
          ref={tooltipRef}
          className="pointer-events-none fixed z-50 max-w-xs rounded bg-black/80 px-3 py-2 text-sm text-white shadow-lg"
          style={{ display: 'none', left: 0, top: 0 }}
        />
      )}

      {/* Built-in drawer for budget maps */}
      {drawerConfig && (
        <>
          {isMobile && previewProps && (
            <BudgetMobileCard
              props={previewProps}
              geoLevel={geoLevel as string as LossGeoLevel}
              config={drawerConfig}
              onSeeMore={() => {
                setSelectedProps(previewProps)
                setPreviewProps(null)
              }}
              onClose={() => setPreviewProps(null)}
            />
          )}
          <BudgetDrawer
            props={selectedProps}
            geoLevel={geoLevel as string as LossGeoLevel}
            config={drawerConfig}
            onClose={() => setSelectedProps(null)}
          />
        </>
      )}

      {children}
    </div>
  )
}
