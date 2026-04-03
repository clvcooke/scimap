import { scaleLinear } from 'd3-scale'
import { MVTLayer } from '@deck.gl/geo-layers'
import { LUT_OR_RD, LUT_MAGMA_INV, LUT_SIZE, FILL_ALPHA } from './color-lut'
import {
  getHouseRep,
  getSenatorsList,
  formatPoliticianName,
} from './legislature'

// ── Types ──────────────────────────────────────────────────────────

export type LossGeoLevel = 'counties' | 'districts' | 'states'

export interface MapGeoConfig {
  tileUrl: string
  maxZoom: number
  uniqueIdProperty: string
  label: string
  domain: [number, number]
}

export type TileProps = Record<string, number | string>

// ── Color scale ────────────────────────────────────────────────────

export function createLogColorScale(domain: [number, number]) {
  const lower = domain[0] > 1 ? Math.log(domain[0]) : 0
  const upper = Math.log(domain[1])
  return scaleLinear().domain([lower, upper]).range([0, 1]).clamp(true)
}

// ── Layer factories ────────────────────────────────────────────────

export function createChoroplethLayer(
  config: MapGeoConfig,
  colorScale: ReturnType<typeof createLogColorScale>,
  colorProperty: string,
  lut: Uint8Array,
  layerId = 'choropleth-mvt',
) {
  return new MVTLayer({
    id: layerId,
    data: [config.tileUrl],
    binary: true,
    pickable: true,
    autoHighlight: true,
    highlightColor: [0, 0, 0, 50],
    uniqueIdProperty: config.uniqueIdProperty,
    maxZoom: config.maxZoom,
    getLineColor: [255, 255, 255, FILL_ALPHA / 3],
    getLineWidth: 1,
    lineWidthMinPixels: 1,
    lineWidthUnits: 'pixels' as const,
    updateTriggers: { getFillColor: [colorScale] },
    getFillColor: (f: { properties: Record<string, number> }) => {
      const v = f.properties[colorProperty] ?? 0
      const idx =
        Math.round(colorScale(v > 0 ? Math.log(v) : 0) * (LUT_SIZE - 1)) * 4
      return [lut[idx], lut[idx + 1], lut[idx + 2], lut[idx + 3]]
    },
  })
}

const STATE_TILE =
  'https://data.scienceimpacts.org/tiles_states_budget_v1/{z}/{x}/{y}.pbf'

export function createStateOutlineLayer(tileUrl: string = STATE_TILE) {
  return new MVTLayer({
    id: 'state-outline-mvt',
    data: [tileUrl],
    binary: true,
    getLineColor: [255, 255, 255, 200],
    lineWidthMinPixels: 2,
    pickable: false,
    maxZoom: 7,
    getFillColor: [0, 0, 0, 0],
  })
}

// ── Tooltip helpers ────────────────────────────────────────────────

/** Position a tooltip element near the cursor, flipping to stay in-viewport. */
export function positionTooltip(el: HTMLElement, x: number, y: number) {
  const gap = 12
  const rect = el.getBoundingClientRect()
  el.style.left = `${
    x + gap + rect.width > window.innerWidth
      ? x - gap - rect.width
      : x + gap
  }px`
  el.style.top = `${
    y + gap + rect.height > window.innerHeight
      ? y - gap - rect.height
      : y + gap
  }px`
}

/**
 * Build the common location + politician header HTML for a tooltip.
 * Returns `{ locationLine, politicianHtml }`.
 */
export function buildTooltipHeader(
  props: TileProps,
  geoLevel: LossGeoLevel,
): { locationLine: string; politicianHtml: string } {
  const state = props.state != null ? String(props.state) : ''
  const county = props.county != null ? String(props.county) : undefined

  let locationLine = state
  if (county) locationLine = `${county}, ${state}`
  if (geoLevel === 'districts' && props.GEOID) {
    const num = String(props.GEOID).slice(-2)
    const distLabel = num === '00' ? 'At-Large' : `District ${parseInt(num, 10)}`
    locationLine = `${state} (${distLabel})`
  }

  let html = ''
  if (geoLevel === 'districts' && props.state_code && props.CD119FP) {
    const rep = getHouseRep(`${props.state_code}-${props.CD119FP}`)
    if (rep) html += `<div>Rep: ${formatPoliticianName(rep.name, rep.party)}</div>`
  }
  if ((geoLevel === 'districts' || geoLevel === 'states') && props.state_code) {
    html += getSenatorsList(String(props.state_code))
      .map((s) => `<div>Sen: ${formatPoliticianName(s.name, s.party)}</div>`)
      .join('')
  }

  return { locationLine, politicianHtml: html }
}

// ── LUT re-exports (so consumers don't need to import color-lut directly) ──

export { LUT_OR_RD, LUT_MAGMA_INV }
