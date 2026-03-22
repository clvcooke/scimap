import {useState, useRef, useMemo, useCallback} from 'react'
import { Map } from 'react-map-gl/maplibre'
import DeckGL from '@deck.gl/react'
import {MVTLayer} from '@deck.gl/geo-layers'
import {scaleLinear, type ScaleLinear} from 'd3-scale'
import {interpolateOrRd} from 'd3-scale-chromatic'
import {DrawerPreview as Drawer} from '@base-ui/react/drawer'
import {X, Plus, Minus, LocateFixed} from 'lucide-react'
import 'maplibre-gl/dist/maplibre-gl.css'
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs.tsx'
import {Button} from '@/components/ui/button.tsx'
import {METRICS, formatCurrency, formatMetricValue} from '@/lib/constants'
import type {GeoLevel, Metric} from '@/lib/constants'

const DOMAIN = 'https://data.scienceimpacts.org'
const TILE_VERSION = 'baseline-v1'
const ALPHA_COLOR = 200
const COLOR_LUT_SIZE = 256

interface GeoConfig {
    tileUrl: string
    maxZoom: number
    uniqueIdProperty: string
    label: string
    totalDomain: [number, number]
    perCapitaDomain: [number, number]
}

const GEO_LEVELS: Record<GeoLevel, GeoConfig> = {
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

type TileProperties = Record<string, number>

const INSTITUTES = [
    {key: 'NCI', name: 'National Cancer Institute'},
    {key: 'NIAID', name: 'Allergy and Infectious Diseases'},
    {key: 'NHLBI', name: 'Heart, Lung, and Blood'},
    {key: 'NIGMS', name: 'General Medical Sciences'},
    {key: 'NIA', name: 'Aging'},
    {key: 'NIMH', name: 'Mental Health'},
    {key: 'NIDDK', name: 'Diabetes and Digestive and Kidney'},
    {key: 'NINDS', name: 'Neurological Disorders and Stroke'},
    {key: 'NICHD', name: 'Child Health and Human Development'},
    {key: 'NIDA', name: 'Drug Abuse'},
    {key: 'NIEHS', name: 'Environmental Health Sciences'},
    {key: 'NEI', name: 'Eye Institute'},
    {key: 'NIAMS', name: 'Arthritis and Musculoskeletal'},
    {key: 'NIBIB', name: 'Biomedical Imaging and Bioengineering'},
    {key: 'NIAAA', name: 'Alcohol Abuse and Alcoholism'},
    {key: 'NHGRI', name: 'Human Genome Research'},
    {key: 'NIDCR', name: 'Dental and Craniofacial Research'},
    {key: 'NIDCD', name: 'Deafness and Communication Disorders'},
    {key: 'NIMHD', name: 'Minority Health and Health Disparities'},
    {key: 'NINR', name: 'Nursing Research'},
    {key: 'NCATS', name: 'Advancing Translational Sciences'},
    {key: 'NCCIH', name: 'Complementary and Integrative Health'},
    {key: 'NLM', name: 'National Library of Medicine'},
    {key: 'FIC', name: 'Fogarty International Center'},
    {key: 'OD', name: 'Office of the Director'},
] as const

interface SelectedFeature {
    id: string
    properties: TileProperties
}


// Pre-compute a 256-entry color lookup table from the OrRd ramp.
// Avoids per-feature string creation (interpolateOrRd returns "rgb(…)")
// and string parsing (parseInt) — just a single array index instead.
function buildColorLUT(): Uint8Array {
    const lut = new Uint8Array(COLOR_LUT_SIZE * 4)
    for (let i = 0; i < COLOR_LUT_SIZE; i++) {
        const t = i / (COLOR_LUT_SIZE - 1)
        const colorString = interpolateOrRd(t)
        const offset = i * 4
        if (colorString.startsWith('rgb')) {
            const parts = colorString.slice(4, -1).split(',')
            lut[offset] = parseInt(parts[0], 10)
            lut[offset + 1] = parseInt(parts[1], 10)
            lut[offset + 2] = parseInt(parts[2], 10)
        } else {
            const hex = colorString.slice(1)
            lut[offset] = parseInt(hex.slice(0, 2), 16)
            lut[offset + 1] = parseInt(hex.slice(2, 4), 16)
            lut[offset + 2] = parseInt(hex.slice(4, 6), 16)
        }
        lut[offset + 3] = ALPHA_COLOR
    }
    return lut
}

const COLOR_LUT = buildColorLUT()

function generateMapLayer({
    config,
    perCapita,
    colorScale,
}: {
    config: GeoConfig
    perCapita: boolean
    colorScale: ScaleLinear<number, number>
}) {
    return new MVTLayer({
        id: 'baseline-mvt',
        data: [config.tileUrl],
        binary: true,
        pickable: true,
        autoHighlight: true,
        highlightColor: [0, 0, 0, 50],
        uniqueIdProperty: config.uniqueIdProperty,
        maxZoom: config.maxZoom,
        getLineColor: [255, 255, 255, ALPHA_COLOR / 3],
        getLineWidth: 1,
        lineWidthMinPixels: 1,
        lineWidthUnits: 'pixels' as const,
        updateTriggers: {
            getFillColor: [colorScale, perCapita],
        },
        // @ts-expect-error deck.gl types are complex
        getFillColor: (feature: { id: string; properties: TileProperties }) => {
            let value = feature.properties.NIH_tot_econ_impact ?? 0
            if (perCapita) {
                const pop = feature.properties.pop_2024 ?? 0
                value = pop > 0 ? value / pop : 0
            }
            const logValue = value > 0 ? Math.log(value) : 0
            const idx = Math.round(colorScale(logValue) * (COLOR_LUT_SIZE - 1)) * 4
            return [COLOR_LUT[idx], COLOR_LUT[idx + 1], COLOR_LUT[idx + 2], COLOR_LUT[idx + 3]]
        },
    })
}

const INITIAL_VIEW_STATE = {
    longitude: -98.5795,
    latitude: 39.8283,
    zoom: 3.5,
}

function DrawerContent({
    feature,
    geoLabel,
    perCapita,
}: {
    feature: SelectedFeature
    geoLabel: string
    perCapita: boolean
}) {
    console.log("drawere content");
    const [metric, setMetric] = useState<Metric>('econ_impact')
    const props = feature.properties
    const population = props.pop_2024 ?? 0

    const rows = useMemo(() => {
        return INSTITUTES.map((inst) => {
            let value = props[`${inst.key}_${metric}`] ?? 0
            if (perCapita && population > 0) value = value / population
            return {...inst, value}
        }).sort((a, b) => b.value - a.value)
    }, [props, metric, perCapita, population])

    const maxValue = rows[0]?.value ?? 1

    let nihTotal = props[`NIH_tot_${metric}`] ?? 0
    if (perCapita && population > 0) nihTotal = nihTotal / population

    return (
        <>
            {/* Header */}
            <div className="flex items-start justify-between border-b px-5 py-4">
                <div>
                    <Drawer.Title className="text-lg font-semibold text-gray-900">
                        {geoLabel}: {feature.id}
                    </Drawer.Title>
                    <p className="mt-0.5 text-sm text-gray-500">
                        Population: {population.toLocaleString()}
                    </p>
                </div>
                <Drawer.Close className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <X className="size-5" />
                </Drawer.Close>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-3 border-b px-5 py-4">
                {METRICS.map((m) => {
                    let val = props[`NIH_tot_${m.key}`] ?? 0
                    if (perCapita && population > 0) val = val / population
                    return (
                        <div key={m.key} className="rounded-lg bg-gray-50 px-3 py-2">
                            <div className="text-xs font-medium text-gray-500">{m.label}</div>
                            <div className="mt-0.5 text-sm font-semibold text-gray-900">
                                {formatMetricValue(val, m.key)}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Metric tabs */}
            <div className="border-b px-5 py-3">
                <Tabs value={metric} onValueChange={(val) => setMetric(val as Metric)}>
                    <TabsList>
                        {METRICS.map((m) => (
                            <TabsTrigger key={m.key} value={m.key}>
                                {m.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>

            {/* Institute breakdown */}
            <div className="flex-1 overflow-y-auto px-5 py-3">
                <div className="mb-2 flex items-baseline justify-between">
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Institute Breakdown
                    </span>
                    <span className="text-xs text-gray-400">
                        Total: {formatMetricValue(nihTotal, metric)}
                        {perCapita ? ' per capita' : ''}
                    </span>
                </div>
                <div className="space-y-1.5">
                    {rows.map((row) => {
                        const pct = maxValue > 0 ? (row.value / maxValue) * 100 : 0
                        const t = maxValue > 0 ? row.value / maxValue : 0
                        return (
                            <div key={row.key} className="group">
                                <div className="flex items-baseline justify-between text-sm">
                                    <span className="font-medium text-gray-700" title={row.name}>
                                        {row.key}
                                    </span>
                                    <span className="text-xs tabular-nums text-gray-500">
                                        {formatMetricValue(row.value, metric)}
                                    </span>
                                </div>
                                <div className="mt-0.5 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                                    <div
                                        className="h-full rounded-full transition-all duration-300"
                                        style={{
                                            width: `${pct}%`,
                                            backgroundColor: interpolateOrRd(0.3 + t * 0.7),
                                        }}
                                    />
                                </div>
                                <div className="mt-0.5 text-[11px] leading-tight text-gray-400 opacity-0 transition-opacity group-hover:opacity-100">
                                    {row.name}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

function MapControls({
    setViewState,
}: {
    setViewState: React.Dispatch<React.SetStateAction<typeof INITIAL_VIEW_STATE>>
}) {
    function handleZoomIn() {
        setViewState((vs) => ({ ...vs, zoom: vs.zoom + 1 }))
    }

    function handleZoomOut() {
        setViewState((vs) => ({ ...vs, zoom: Math.max(vs.zoom - 1, 1) }))
    }

    function handleLocate() {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setViewState({
                    longitude: pos.coords.longitude,
                    latitude: pos.coords.latitude,
                    zoom: 10,
                })
            },
            () => {
                // Silently ignore if user denies location
            },
        )
    }

    return (
        <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1">
            <button
                onClick={handleZoomIn}
                className="flex size-8 items-center justify-center rounded-t-lg bg-white shadow-md hover:bg-gray-100 active:bg-gray-200 transition-colors"
                aria-label="Zoom in"
            >
                <Plus className="size-4" />
            </button>
            <button
                onClick={handleZoomOut}
                className="flex size-8 items-center justify-center bg-white shadow-md hover:bg-gray-100 active:bg-gray-200 transition-colors"
                aria-label="Zoom out"
            >
                <Minus className="size-4" />
            </button>
            <button
                onClick={handleLocate}
                className="flex size-8 items-center justify-center rounded-b-lg bg-white shadow-md hover:bg-gray-100 active:bg-gray-200 transition-colors"
                aria-label="Zoom to my location"
            >
                <LocateFixed className="size-4" />
            </button>
        </div>
    )
}

export default function SCIMap() {
    const [geoLevel, setGeoLevel] = useState<GeoLevel>('states')
    const [perCapita, setPerCapita] = useState(false)
    const [selectedFeature, setSelectedFeature] = useState<SelectedFeature | null>(null)
    const [viewState, setViewState] = useState(INITIAL_VIEW_STATE)
    const tooltipRef = useRef<HTMLDivElement>(null)
    const config = GEO_LEVELS[geoLevel]

    const colorScale = useMemo(() => {
        const domain = perCapita ? config.perCapitaDomain : config.totalDomain
        const lower = domain[0] > 0 ? Math.log(domain[0]) : 0
        const upper = Math.log(domain[1])
        return scaleLinear().domain([lower, upper]).range([0, 1]).clamp(true)
    }, [config, perCapita])

    const mapLayer = useMemo(() => {
        return generateMapLayer({config, perCapita, colorScale})
    }, [config, perCapita, colorScale])

    const onHover = useCallback(
        (info: { x: number; y: number; object?: { properties?: TileProperties } }) => {
            const el = tooltipRef.current
            if (!el) return
            if (!info.object?.properties) {
                el.style.display = 'none'
                return
            }
            const props = info.object.properties
            const econImpact = props.NIH_tot_econ_impact ?? 0
            const population = props.pop_2024 ?? 0
            const id = props[config.uniqueIdProperty] ?? ''
            const pcValue = population > 0 ? econImpact / population : 0

            el.innerHTML =
                `<div class="font-semibold">${config.label}: ${id}</div>` +
                `<div>Economic Impact: ${formatCurrency(econImpact)}</div>` +
                `<div>Population: ${population.toLocaleString()}</div>` +
                (perCapita ? `<div>Per Capita: ${formatCurrency(pcValue)}</div>` : '')
            el.style.display = 'block'

            const gap = 12
            const rect = el.getBoundingClientRect()
            const vw = window.innerWidth
            const vh = window.innerHeight

            const left = info.x + gap + rect.width > vw ? info.x - gap - rect.width : info.x + gap
            const top = info.y + gap + rect.height > vh ? info.y - gap - rect.height : info.y + gap

            el.style.left = `${left}px`
            el.style.top = `${top}px`
        },
        [config.uniqueIdProperty, config.label, perCapita],
    )

    return (
      <div className="absolute inset-4 overflow-hidden rounded-xl shadow-lg">
        {/* Control panel */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-3 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
          <Tabs value={geoLevel} onValueChange={(val) => setGeoLevel(val as GeoLevel)}>
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
          controller={true}
          layers={[mapLayer]}
          useDevicePixels={false}
          getCursor={({ isDragging }) => (isDragging ? 'grabbing' : 'grab')}
          onHover={onHover}
          onClick={(info: { object?: { properties?: TileProperties } }) => {
            if (!info.object?.properties) {
              setSelectedFeature(null)
              return
            }
            const props = info.object.properties
            const id = String(props[config.uniqueIdProperty] ?? '')
            requestAnimationFrame(() => {
              setSelectedFeature({ id, properties: props })
            })
          }}
        >
          <Map id="scimap" mapStyle="https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json" />
        </DeckGL>

        {/* Map controls */}
        <MapControls setViewState={setViewState} />

        {/* Hover tooltip — updated via ref, not state, to avoid re-renders */}
        <div
          ref={tooltipRef}
          className="pointer-events-none absolute z-20 rounded bg-black/80 px-3 py-2 text-sm text-white shadow-lg"
          style={{ display: 'none', left: 0, top: 0 }}
        />

        <Drawer.Root
          open={selectedFeature !== null}
          onOpenChange={(open) => {
            if (!open) setSelectedFeature(null)
          }}
          swipeDirection="right"
        >
          <Drawer.Portal>
            <Drawer.Backdrop
              className="fixed inset-0 z-30 bg-black/25 backdrop-blur-[2px] transition-opacity duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0"
            />
            <Drawer.Viewport className="fixed inset-0 z-40">
              <Drawer.Popup className="fixed inset-y-0 right-0 w-105 max-w-[calc(100vw-48px)] transition-transform duration-300 ease-out data-[ending-style]:translate-x-full data-[starting-style]:translate-x-full">
                <Drawer.Content className="flex h-full w-full flex-col overflow-hidden rounded-l-xl bg-white shadow-2xl">
                  {selectedFeature && (
                    <DrawerContent
                      feature={selectedFeature}
                      geoLabel={config.label.replace(/s$/, '')}
                      perCapita={perCapita}
                    />
                  )}
                </Drawer.Content>
              </Drawer.Popup>
            </Drawer.Viewport>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    )
}
