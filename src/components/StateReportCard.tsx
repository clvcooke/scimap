import { useMemo, useState, useRef, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import DeckGL from '@deck.gl/react'
import type { MapViewState } from '@deck.gl/core'
import { WebMercatorViewport } from '@deck.gl/core'
import { MVTLayer } from '@deck.gl/geo-layers'
import { Map } from 'react-map-gl/maplibre'
import { scaleLinear } from 'd3-scale'
import { interpolateMagma } from 'd3-scale-chromatic'
import { Share2, Download } from 'lucide-react'
import 'maplibre-gl/dist/maplibre-gl.css'

import { formatCurrency, formatNumber } from '@/lib/constants'
import type { StateReportCardData, FiscalYear } from '@/lib/report-card-data'
import { FILL_ALPHA } from '@/lib/color-lut'
import ColorScale from './ColorScale'

const DOMAIN = 'https://data.scienceimpacts.org'

const TILES_BY_FY = {
  fy27: {
    states: `${DOMAIN}/tiles_states_budget27_v3/{z}/{x}/{y}.pbf`,
    colorProperty: 'econ_budg_total_cuts',
  },
} as const

const STATE_DOMAIN: [number, number] = [10_000_000, 5_000_000_000]

function fitBounds(
  minLat: number,
  maxLat: number,
  minLng: number,
  maxLng: number,
  width: number,
  height: number,
  padding = 50,
): MapViewState {
  const vp = new WebMercatorViewport({ width, height })
  const { longitude, latitude, zoom } = vp.fitBounds(
    [
      [minLng, minLat],
      [maxLng, maxLat],
    ],
    { padding },
  )
  return { longitude, latitude, zoom }
}

function createMagmaStateLayer(
  tileUrl: string,
  highlightId: string,
  colorProperty: string,
) {
  const lower = Math.log(STATE_DOMAIN[0])
  const upper = Math.log(STATE_DOMAIN[1])
  const cs = scaleLinear().domain([lower, upper]).range([0, 1]).clamp(true)

  return new MVTLayer({
    id: 'rc-state-fill',
    data: [tileUrl],
    binary: true,
    pickable: false,
    uniqueIdProperty: 'state',
    maxZoom: 7,
    getLineColor: [255, 255, 255, FILL_ALPHA / 3],
    getLineWidth: (f: { properties: Record<string, number | string> }) =>
      f.properties.state === highlightId ? 2.5 : 1,
    lineWidthMinPixels: 1,
    lineWidthUnits: 'pixels' as const,
    getFillColor: (f: { properties: Record<string, number | string> }) => {
      const v = (f.properties[colorProperty] as number) ?? 0
      const t = cs(v > 0 ? Math.log(v) : 0)
      const c = interpolateMagma(1 - t)
      const rgb = c.startsWith('rgb')
        ? c.slice(4, -1).split(',').map((s) => parseInt(s.trim(), 10))
        : [
            parseInt(c.slice(1, 3), 16),
            parseInt(c.slice(3, 5), 16),
            parseInt(c.slice(5, 7), 16),
          ]
      const alpha = f.properties.state === highlightId ? FILL_ALPHA : 70
      return [rgb[0], rgb[1], rgb[2], alpha]
    },
    updateTriggers: { getFillColor: [highlightId], getLineWidth: [highlightId] },
  })
}

function MiniMap({
  minLat,
  maxLat,
  minLng,
  maxLng,
  layers,
  showColorbar = false,
  colorbarDomain,
  className = '',
}: {
  minLat: number
  maxLat: number
  minLng: number
  maxLng: number
  layers: MVTLayer[]
  showColorbar?: boolean
  colorbarDomain?: [number, number]
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [viewState, setViewState] = useState<MapViewState>({
    longitude: (minLng + maxLng) / 2,
    latitude: (minLat + maxLat) / 2,
    zoom: 5,
  })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const { width, height } = el.getBoundingClientRect()
    if (width > 0 && height > 0) {
      setViewState(fitBounds(minLat, maxLat, minLng, maxLng, width, height))
    }
  }, [minLat, maxLat, minLng, maxLng])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-lg border border-gray-200 ${className}`}
      style={{ pointerEvents: 'none' }}
    >
      <DeckGL
        initialViewState={viewState}
        controller={false}
        layers={layers}
        getCursor={() => 'default'}
      >
        <Map
          attributionControl={false}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        />
      </DeckGL>
      {showColorbar && colorbarDomain && (
        <div className="pointer-events-none absolute bottom-2 right-2 z-10">
          <ColorScale domain={colorbarDomain} useMagma />
        </div>
      )}
    </div>
  )
}

function InfoCard({ data }: { data: StateReportCardData }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-5">
      <div className="mb-4">
        <h3 className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-700">
          U.S. Senators
        </h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between gap-2">
            <span className="text-gray-600">Junior Senator:</span>
            <span className="font-medium text-gray-900">{data.juniorSenator}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-gray-600">Senior Senator:</span>
            <span className="font-medium text-gray-900">{data.seniorSenator}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-700">
          Projected Losses from Budget Cuts in {data.state}
        </h3>
        <div className="space-y-1 text-sm">
          {(() => {
            const jobLoss = data.budg_total_cuts_job_loss ?? data.budg_NIH_cuts_job_loss
            return (
              <div className="flex justify-between gap-2">
                <span className="font-medium text-gray-900">Job Loss:</span>
                <span className="font-semibold text-red-700">
                  {jobLoss < 10 ? '<10' : formatNumber(jobLoss)}
                </span>
              </div>
            )
          })()}
          <div className="flex justify-between gap-2 border-t pt-1">
            <span className="font-bold text-gray-900">Total Economic Loss:</span>
            <span className="font-bold text-red-700">
              {formatCurrency(data.budg_total_cuts_econ_loss)}
            </span>
          </div>
          <div className="ml-2 space-y-0.5 text-xs">
            <div className="flex justify-between gap-2">
              <span className="text-gray-600">&bull; NIH:</span>
              <span className="font-medium text-orange-700">
                {formatCurrency(data.budg_NIH_cuts_econ_loss)}
              </span>
            </div>
            {data.budg_NSF_cuts_econ_loss > 0 && (
              <div className="flex justify-between gap-2">
                <span className="text-gray-600">&bull; NSF:</span>
                <span className="font-medium text-orange-700">
                  {formatCurrency(data.budg_NSF_cuts_econ_loss)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {data.top_nih_impact.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-700">
            Top 3 NIH-Funded Institutions Driving {data.state} Economic Loss
          </h3>
          <div className="space-y-1 text-sm">
            {data.top_nih_impact.slice(0, 3).map((inst, i) => (
              <div key={i} className="flex justify-between gap-2">
                <span className="min-w-0 flex-1 text-gray-900">{inst.org_name}</span>
                <span className="shrink-0 font-semibold text-red-700">
                  {formatCurrency(inst.budg_NIH_cuts_econ_loss)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.top_nsf_impact.length > 0 && (
        <div>
          <h3 className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-700">
            Top 3 NSF-Funded Institutions Driving {data.state} Economic Loss
          </h3>
          <div className="space-y-1 text-sm">
            {data.top_nsf_impact.slice(0, 3).map((inst, i) => (
              <div key={i} className="flex justify-between gap-2">
                <span className="min-w-0 flex-1 text-gray-900">{inst.org_name}</span>
                <span className="shrink-0 font-semibold text-red-700">
                  {formatCurrency(inst.budg_NSF_cuts_econ_loss)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function StateReportCard({
  data,
  fiscalYear = 'fy27',
}: {
  data: StateReportCardData
  fiscalYear?: FiscalYear
}) {
  const fyLabel = 'FY27'
  const fyYear = '2027'
  const [shareOpen, setShareOpen] = useState(false)

  const currentUrl =
    typeof window !== 'undefined'
      ? `https://scienceimpacts.org${window.location.pathname}${window.location.search}`
      : ''

  const hasDownloadableImage = true

  const downloadImage = async () => {
    const imageUrl = `${DOMAIN}/report-cards-${fiscalYear}-v2/report-card-${data.state_code}.png`
    const fileName = `fact-sheet-${fiscalYear}-${data.state_code}.png`
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: `SCIMaP Scorecard: ${data.state}`,
      text: `See the impact of the ${fyLabel} White House Budget on ${data.state}`,
      url: currentUrl,
    }
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(currentUrl)
      setShareOpen(true)
      setTimeout(() => setShareOpen(false), 2000)
    }
  }

  const tiles = TILES_BY_FY.fy27

  const stateLayers = useMemo(
    () => [createMagmaStateLayer(tiles.states, data.state_code, tiles.colorProperty)],
    [data.state_code, tiles],
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <div className="mb-6 flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="shrink-0">
            <img src="/logo_v3-01.png" alt="SCIMaP" className="h-14 w-14 md:h-19 md:w-19" />
          </Link>
          <div className="text-center md:text-left">
            <h1 className="text-lg font-bold text-gray-900 md:text-xl">
              SCIMaP Scorecard: White House {fyLabel} Budget Proposal
            </h1>
            <h2 className="text-base font-medium text-gray-700 md:text-lg">
              {data.state} — FY{fyYear} Science Funding Impact
            </h2>
            <p className="text-sm text-gray-500">
              Projected state-level economic losses from cuts proposed in the White House {fyLabel}{' '}
              budget for NIH and NSF
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => void handleShare()}
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
              title="Share this scorecard"
            >
              <Share2 className="size-5" />
            </button>
            {shareOpen && (
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white">
                Link copied!
              </div>
            )}
          </div>
          {hasDownloadableImage && (
            <button
              onClick={() => void downloadImage()}
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              title="Download report card image"
            >
              <Download className="size-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 md:hidden">
        <InfoCard data={data} />
        <MiniMap
          minLat={data.state_bounds.min_lat}
          maxLat={data.state_bounds.max_lat}
          minLng={data.state_bounds.min_lng}
          maxLng={data.state_bounds.max_lng}
          layers={stateLayers}
          showColorbar
          colorbarDomain={STATE_DOMAIN}
          className="h-100"
        />
      </div>

      <div className="hidden gap-4 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <InfoCard data={data} />
        <MiniMap
          minLat={data.state_bounds.min_lat}
          maxLat={data.state_bounds.max_lat}
          minLng={data.state_bounds.min_lng}
          maxLng={data.state_bounds.max_lng}
          layers={stateLayers}
          showColorbar
          colorbarDomain={STATE_DOMAIN}
          className="min-h-125"
        />
      </div>

      <div className="mt-6 text-center text-xs text-gray-500">
        Funding losses are calculated by comparing the FY {fyYear} proposed NIH and NSF budgets with
        average funding for a given state (using data from{' '}
        <a
          href="https://reporter.nih.gov/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          NIH RePORTER
        </a>
        ) between FY2020-2024. Corresponding economic and job losses are determined based on an{' '}
        <a
          href="https://www.unitedformedicalresearch.org/wp-content/uploads/2025/03/UMR_NIH-Role-in-Sustaining-US-Economy-FY2024-2025-Update.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          analysis of lost economic activity
        </a>{' '}
        and distributed among local communities based on{' '}
        <a
          href="https://lehd.ces.census.gov/data/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          U.S. Census data
        </a>
        .
      </div>
    </div>
  )
}
