import { useState, useRef, useMemo, useCallback, useEffect, type ReactNode } from 'react'
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
  getLegislatorKeys,
  type MapGeoConfig,
  type TileProps,
  type LossGeoLevel,
} from '@/lib/map-shared'
import {
  Events,
  track,
  setPersonProperties,
  buildGeographyEventProps,
  type MapType,
} from '@/lib/analytics'
import { useIsMobile } from '@/hooks/use-mobile'
import { Info, X } from 'lucide-react'
import { InlineMarkdown } from './InlineMarkdown'
import MapControls from './MapControls'
import ShareMenu from './ShareMenu'
import ColorScale, { type ColorScheme } from './ColorScale'
import BudgetDrawer, { type BudgetDrawerConfig } from './BudgetDrawer'
import type { FiscalYear } from '@/lib/report-card-data'
import BudgetMobileCard from './BudgetMobileCard'
import MapTour from './MapTour'

export interface MapAboutContent {
  heading?: string
  description?: string
  dataSources?: string[]
}

function trackGeographyClick(
  props: TileProps,
  geoLevel: LossGeoLevel,
  mapType: MapType | undefined,
): void {
  const eventProps = buildGeographyEventProps(props, geoLevel, mapType)
  track(Events.MAP_GEOGRAPHY_CLICKED, eventProps)
  const { stateCode, cdFp } = getLegislatorKeys(props)
  setPersonProperties({
    last_state_code: stateCode || undefined,
    last_state_name: props.state_name != null ? String(props.state_name) : undefined,
    last_map_type: mapType,
    last_geo_level: geoLevel,
    last_district_viewed:
      geoLevel === 'districts' && cdFp ? `${stateCode}-${cdFp}` : undefined,
  })
}

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
  /** Fiscal year for the scorecard link in the drawer. */
  fiscalYear?: FiscalYear | undefined
  /** Content for the "About this map" info panel. */
  aboutContent?: MapAboutContent | undefined
  /** Analytics label identifying which map this is (e.g. 'fy27'). */
  mapType?: MapType
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
  fiscalYear,
  aboutContent,
  mapType,
}: ChoroplethMapProps<K>) {
  const [geoLevel, setGeoLevel] = useState<K>(defaultLevel)
  const [selectedProps, setSelectedProps] = useState<TileProps | null>(null)
  const [previewProps, setPreviewProps] = useState<TileProps | null>(null)
  const [mobileTooltipProps, setMobileTooltipProps] = useState<TileProps | null>(null)
  const [viewState, setViewState] = useState(() => ({
    ...INITIAL_VIEW_STATE,
    ...(initialLat != null && initialLng != null
      ? { latitude: initialLat, longitude: initialLng, zoom: initialZoom ?? 10 }
      : {}),
  }))
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    displayLocation && initialLat != null && initialLng != null ? [initialLng, initialLat] : null,
  )
  const isMobile = useIsMobile()
  const [showAbout, setShowAbout] = useState(!isMobile)
  const [tourActive, setTourActive] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const aboutPanelRef = useRef<HTMLDivElement>(null)

  // Close about panel when clicking outside (but not while the tour is running —
  // intro.js overlay clicks would otherwise dismiss it).
  useEffect(() => {
    if (!showAbout || tourActive) return
    function handleClick(e: MouseEvent) {
      if (aboutPanelRef.current && !aboutPanelRef.current.contains(e.target as Node)) {
        setShowAbout(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showAbout, tourActive])
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
      const props = (info.object as { properties?: TileProps } | undefined)?.properties
      if (props) {
        trackGeographyClick(props, geoLevel as unknown as LossGeoLevel, mapType)
      }

      // Mobile tooltip card for maps without a drawer (e.g. grants).
      // On desktop the hover tooltip covers this; on mobile, tapping a region
      // shows the same info as a dismissible card.
      if (isMobile && !drawerConfig) {
        if (props) {
          setMobileTooltipProps(props)
          return
        }
        if (!info.object) setMobileTooltipProps(null)
      }

      // If a custom click handler is provided, delegate to it
      if (onMapClick) {
        onMapClick(info, event)
        return
      }

      // Built-in drawer click handling
      if (!drawerConfig) return

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
    [onMapClick, drawerConfig, isMobile, geoLevel, mapType],
  )

  return (
    <div ref={containerRef} data-tour="map-canvas" className="absolute inset-x-4 inset-y-2 overflow-hidden rounded-xl shadow-lg md:inset-x-16 md:inset-y-8">
      {/* Top bar: region selector (left) + info/share (right) */}
      <div className="pointer-events-none absolute left-2 right-2 top-2 z-10 flex items-start justify-between md:left-4 md:right-4 md:top-4">
        <div data-tour="map-toggles" className="pointer-events-auto flex flex-col gap-2 md:rounded-lg md:bg-white/90 md:p-3 md:shadow-md md:backdrop-blur-sm">
          <Tabs
            value={geoLevel}
            onValueChange={(v: string) => {
              const level = v as K
              track(Events.MAP_GEO_LEVEL_CHANGED, {
                map_type: mapType,
                from_level: geoLevel,
                to_level: level,
              })
              setGeoLevel(level)
              onGeoLevelChange?.(level)
            }}
          >
            <TabsList className="shadow md:shadow-none">
              {typedKeys(geoLevels).map((key) => (
                <TabsTrigger key={key} value={key} className="text-xs md:text-sm">
                  {geoLevels[key].label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          {extraControls}
        </div>

        {/* Info + share buttons */}
        <div className="pointer-events-auto flex items-start gap-2">
          {aboutContent?.description && (
            <div ref={aboutPanelRef} className="relative">
              <button
                onClick={() => {
                  setShowAbout((v) => {
                    if (!v) track(Events.MAP_ABOUT_OPENED, { map_type: mapType })
                    return !v
                  })
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-colors hover:bg-white md:h-9 md:w-9"
                aria-label="About this map"
              >
                <Info className="h-4 w-4 text-gray-600 md:h-5 md:w-5" />
              </button>
              {showAbout && !tourActive && (
                <div className="absolute right-0 top-full mt-2 w-72 rounded-lg bg-white/95 p-4 shadow-lg backdrop-blur-sm md:w-96 md:p-5">
                  <div className="mb-2 flex items-start justify-between md:mb-3">
                    <h4 className="text-sm font-semibold text-gray-900 md:text-base">{aboutContent.heading ?? 'About This Map'}</h4>
                    <button onClick={() => setShowAbout(false)} className="ml-2 rounded p-0.5 text-gray-400 hover:text-gray-600">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs leading-relaxed text-gray-600 md:text-sm md:leading-relaxed">
                    <InlineMarkdown>{aboutContent.description}</InlineMarkdown>
                  </p>
                  {aboutContent.dataSources && aboutContent.dataSources.length > 0 && (
                    <div className="mt-3 border-t border-gray-200 pt-2 md:mt-4 md:pt-3">
                      <span className="text-[11px] font-medium text-gray-400 md:text-xs">Data Sources</span>
                      <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 text-[11px] text-gray-500 md:gap-x-3 md:gap-y-1 md:text-xs">
                        {aboutContent.dataSources.map((s) => (
                          <span key={s}><InlineMarkdown>{s}</InlineMarkdown></span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <ShareMenu pageType={mapType ? `map-${mapType}` : 'map'} context={{ geo_level: geoLevel }} />
        </div>
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

      <MapControls setViewState={setViewState} onGeolocate={handleGeolocate} />

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

      {/* Mobile tooltip card — shown for maps without a drawer when a region is tapped */}
      {isMobile && !drawerConfig && mobileTooltipProps && (
        <div className="absolute bottom-2 left-2 right-14 z-20 rounded-xl bg-white p-3 text-sm text-gray-900 shadow-lg">
          <div className="flex items-start gap-2">
            <div
              className="min-w-0 flex-1 space-y-0.5 [&_.font-semibold]:text-gray-900"
              dangerouslySetInnerHTML={{ __html: renderTooltip(mobileTooltipProps, geoLevel) }}
            />
            <button
              onClick={() => setMobileTooltipProps(null)}
              className="shrink-0 rounded-md p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
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
            fiscalYear={fiscalYear}
            mapType={mapType}
          />
        </>
      )}

      {children}
      <MapTour onTourActiveChange={setTourActive} />
    </div>
  )
}
