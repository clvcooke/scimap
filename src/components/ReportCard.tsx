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
import type { ReportCardData } from '@/lib/report-card-data'
import ColorScale from './ColorScale'

// ── Constants ──────────────────────────────────────────────────────

const DOMAIN = 'https://data.scienceimpacts.org'
const DISTRICT_TILES = `${DOMAIN}/tiles_districts_budget_119_v2/{z}/{x}/{y}.pbf`
const STATE_TILES = `${DOMAIN}/tiles_states_budget_v1/{z}/{x}/{y}.pbf`

const DISTRICTS_DOMAIN: [number, number] = [5_000_000, 500_000_000]
const STATE_DOMAIN: [number, number] = [10_000_000, 5_000_000_000]

// ── Helper: fit-bounds ─────────────────────────────────────────────

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

// ── Helper: magma MVT layer ────────────────────────────────────────

function createMagmaLayer(
  tileUrl: string,
  domain: [number, number],
  uniqueProperty: string,
  id: string,
  highlightId?: string | number,
) {
  const lower = domain[0] > 1 ? Math.log(domain[0]) : 0
  const upper = Math.log(domain[1])
  const cs = scaleLinear().domain([lower, upper]).range([0, 1]).clamp(true)

  return new MVTLayer({
    id,
    data: [tileUrl],
    binary: true,
    pickable: false,
    uniqueIdProperty: uniqueProperty,
    maxZoom: 7,
    getLineColor: [255, 255, 255, 60],
    lineWidthMinPixels: 1,
    getFillColor: (f: { properties: Record<string, number> }) => {
      const v = f.properties.budg_NIH_cuts_econ_loss ?? 0
      const t = cs(v > 0 ? Math.log(v) : 0)
      const c = interpolateMagma(1 - t)
      const rgb = c.startsWith('rgb')
        ? c.slice(4, -1).split(',').map((s) => parseInt(s.trim(), 10))
        : [
            parseInt(c.slice(1, 3), 16),
            parseInt(c.slice(3, 5), 16),
            parseInt(c.slice(5, 7), 16),
          ]
      const alpha =
        highlightId != null && highlightId !== f.properties[uniqueProperty]
          ? 160
          : 200
      return [rgb[0], rgb[1], rgb[2], alpha]
    },
  })
}

function createOutlineLayer(
  tileUrl: string,
  uniqueProperty: string,
  targetId: string | number | undefined,
  id: string,
) {
  return new MVTLayer({
    id,
    data: [tileUrl],
    binary: true,
    pickable: false,
    maxZoom: 7,
    getFillColor: [0, 0, 0, 0],
    getLineColor: (f: { properties: Record<string, number | string> }) => {
      if (targetId != null && f.properties[uniqueProperty] == targetId) {
        return [255, 255, 255, 255]
      }
      return [255, 255, 255, 80]
    },
    getLineWidth: (f: { properties: Record<string, number | string> }) =>
      targetId != null && f.properties[uniqueProperty] == targetId ? 3 : 1,
    lineWidthMinPixels: 1,
    lineWidthUnits: 'pixels' as const,
    updateTriggers: { getLineColor: [targetId], getLineWidth: [targetId] },
  })
}

// ── Mini-map component ─────────────────────────────────────────────

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
    zoom: 6,
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

// ── Info card (representatives + losses + top 5) ───────────────────

function InfoCard({ data }: { data: ReportCardData }) {
  const districtCode =
    data.CD119FP === '00'
      ? `${data.state_code}-AL`
      : `${data.state_code}-${data.CD119FP}`

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-5">
      {/* Congressional representatives */}
      <div className="mb-4">
        <h3 className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-700">
          Congressional Representatives
        </h3>
        <div className="space-y-1 text-sm">
          {data.representativeName && (
            <div className="flex justify-between gap-2">
              <span className="text-gray-600">House Representative:</span>
              <span className="font-medium text-gray-900">{data.representativeName}</span>
            </div>
          )}
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

      {/* Projected losses */}
      <div className="mb-4">
        <h3 className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-700">
          Projected Losses from NIH Budget Cuts in {districtCode}
        </h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between gap-2">
            <span className="font-medium text-gray-900">Job Loss:</span>
            <span className="font-semibold text-red-700">
              {data.budg_NIH_cuts_job_loss < 10
                ? '<10'
                : formatNumber(data.budg_NIH_cuts_job_loss)}
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="font-medium text-gray-900">Total Economic Loss:</span>
            <span className="font-semibold text-red-700">
              {formatCurrency(data.budg_NIH_cuts_econ_loss)}
            </span>
          </div>
          <div className="ml-2 space-y-0.5 text-xs">
            <div className="flex justify-between gap-2">
              <span className="text-gray-600">&bull; Aging Research:</span>
              <span className="font-medium text-orange-700">
                {formatCurrency(data.budg_NIA_cuts_econ_loss)}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-gray-600">&bull; Cancer Research:</span>
              <span className="font-medium text-orange-700">
                {formatCurrency(data.budg_NCI_cuts_econ_loss)}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-gray-600">&bull; Infectious Disease Research:</span>
              <span className="font-medium text-orange-700">
                {formatCurrency(data.budg_NIAID_cuts_econ_loss)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top 5 institutions */}
      {data.top_five_impact.length > 0 && (
        <div>
          <h3 className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-700">
            Top 5 Institutions Driving {districtCode} Economic Loss
          </h3>
          <div className="space-y-1 text-sm">
            {data.top_five_impact.slice(0, 5).map((inst, i) => (
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
    </div>
  )
}

// ── Main ReportCard ────────────────────────────────────────────────

export default function ReportCard({ data }: { data: ReportCardData }) {
  const [shareOpen, setShareOpen] = useState(false)

  const districtName =
    data.CD119FP === '00' ? 'At Large' : `District ${parseInt(data.CD119FP, 10)}`
  const districtTitle = `${data.state} ${districtName}`

  const currentUrl = typeof window !== 'undefined'
    ? `https://scienceimpacts.org${window.location.pathname}${window.location.search}`
    : ''

  const downloadImage = async () => {
    const imageUrl = `${DOMAIN}/report-cards-v6/report-card-${data.state_code}-${data.CD119FP}.png`
    const fileName = `fact-sheet-${data.state_code}-${data.CD119FP === '00' ? 'AL' : data.CD119FP}.png`
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
      title: `SCIMaP Scorecard: ${districtTitle}`,
      text: `See the impact of the FY26 White House NIH Budget on ${districtTitle}`,
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

  // District map layers
  const districtLayers = useMemo(
    () => [
      createMagmaLayer(
        DISTRICT_TILES,
        DISTRICTS_DOMAIN,
        'GEOID',
        'rc-district-fill',
        data.GEOID,
      ),
      createOutlineLayer(DISTRICT_TILES, 'GEOID', data.GEOID, 'rc-district-outline'),
    ],
    [data.GEOID],
  )

  // State overview map layers
  const stateLayers = useMemo(
    () => [
      createMagmaLayer(
        STATE_TILES,
        STATE_DOMAIN,
        'state_code',
        'rc-state-fill',
        data.state_code,
      ),
      createOutlineLayer(
        DISTRICT_TILES,
        'GEOID',
        data.GEOID,
        'rc-state-district-outline',
      ),
    ],
    [data.state_code, data.GEOID],
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="shrink-0">
            <img src="/science.png" alt="SCIMaP" className="h-14 w-14 md:h-19 md:w-19" />
          </Link>
          <div className="text-center md:text-left">
            <h1 className="text-lg font-bold text-gray-900 md:text-xl">
              SCIMaP Scorecard: White House NIH FY26 Budget Proposal
            </h1>
            <h2 className="text-base font-medium text-gray-700 md:text-lg">
              {districtTitle} — FY2026 NIH Budget Impact
            </h2>
            <p className="text-sm text-gray-500">
              Projected district-level economic losses from cuts proposed in the White House FY26
              NIH budget
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
          <button
            onClick={() => void downloadImage()}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            title="Download report card image"
          >
            <Download className="size-5" />
          </button>
        </div>
      </div>

      {/* Mobile: stack vertically */}
      <div className="flex flex-col gap-4 md:hidden">
        <InfoCard data={data} />
        <MiniMap
          minLat={data.district_bounds.min_lat}
          maxLat={data.district_bounds.max_lat}
          minLng={data.district_bounds.min_lng}
          maxLng={data.district_bounds.max_lng}
          layers={districtLayers}
          showColorbar
          colorbarDomain={DISTRICTS_DOMAIN}
          className="h-100"
        />
      </div>

      {/* Desktop: side-by-side */}
      <div className="hidden gap-4 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="flex flex-col gap-4">
          <InfoCard data={data} />
          <MiniMap
            minLat={data.state_bounds.min_lat}
            maxLat={data.state_bounds.max_lat}
            minLng={data.state_bounds.min_lng}
            maxLng={data.state_bounds.max_lng}
            layers={stateLayers}
            className="min-h-55 flex-1"
          />
        </div>
        <MiniMap
          minLat={data.district_bounds.min_lat}
          maxLat={data.district_bounds.max_lat}
          minLng={data.district_bounds.min_lng}
          maxLng={data.district_bounds.max_lng}
          layers={districtLayers}
          showColorbar
          colorbarDomain={DISTRICTS_DOMAIN}
          className="min-h-125"
        />
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-gray-500">
        Funding losses are calculated by comparing the FY 2026{' '}
        <a
          href="https://officeofbudget.od.nih.gov/pdfs/FY26/br/Overview%20of%20FY%202026%20Supplementary%20Tables.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          proposed NIH budget
        </a>{' '}
        with average funding for a given district (using data from{' '}
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
        . We also list losses specific to research funding for aging (NIA), cancer (NCI), and
        infectious diseases (NIAID).
      </div>
    </div>
  )
}
