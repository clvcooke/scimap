import { scaleLinear, type ScaleLinear } from 'd3-scale'
import { MVTLayer } from '@deck.gl/geo-layers'
import { LUT_BLUES, LUT_SIZE, FILL_ALPHA } from './color-lut'
import type { GeoLevel } from './constants'
import { NSF_DIRECTORATES, type AgencyFilter } from './map-shared'

// --- Types ---

export type TileProperties = Record<string, number>

export interface SelectedFeature {
  id: string
  properties: TileProperties
}

export interface GeoConfig {
  tileUrl: string
  maxZoom: number
  uniqueIdProperty: string
  label: string
  totalDomain: [number, number]
  perCapitaDomain: [number, number]
}

// --- Tile configuration ---

const DOMAIN = 'https://data.scienceimpacts.org'
const TILE_VERSION = 'baseline-v6'
export const INITIAL_VIEW_STATE = {
  longitude: -98.5795,
  latitude: 39.8283,
  zoom: 3.5,
  maxZoom: 12,
  bearing: 0,
  pitch: 0,
  padding: { top: 0, bottom: 0, left: 0, right: 0 },
}

export const GEO_LEVELS: Record<GeoLevel, GeoConfig> = {
  counties: {
    tileUrl: `${DOMAIN}/tiles_counties_baseline_${TILE_VERSION}/{z}/{x}/{y}.pbf`,
    maxZoom: 9,
    uniqueIdProperty: 'FIPS',
    label: 'Counties',
    totalDomain: [0, 25_000_000],
    perCapitaDomain: [0.01, 50_000],
  },
  districts: {
    tileUrl: `${DOMAIN}/tiles_districts_baseline_${TILE_VERSION}/{z}/{x}/{y}.pbf`,
    maxZoom: 9,
    uniqueIdProperty: 'GEOID',
    label: 'Districts',
    totalDomain: [250_000, 50_000_000],
    perCapitaDomain: [10, 5_000],
  },
  states: {
    tileUrl: `${DOMAIN}/tiles_states_baseline_${TILE_VERSION}/{z}/{x}/{y}.pbf`,
    maxZoom: 7,
    uniqueIdProperty: 'state',
    label: 'States',
    totalDomain: [10_000, 2_500_000_000],
    perCapitaDomain: [50, 5_000],
  },
  // cities: {
  //   tileUrl: `${DOMAIN}/tiles_cities_baseline_${TILE_VERSION}/{z}/{x}/{y}.pbf`,
  //   maxZoom: 9,
  //   uniqueIdProperty: 'CBSA_FIPS',
  //   label: 'Cities',
  //   totalDomain: [10_000, 10_000_000_000],
  //   perCapitaDomain: [1, 10_000],
  // },
}

/** Per-agency domain overrides for good color contrast. */
export const BASELINE_AGENCY_DOMAINS: Record<AgencyFilter, Record<GeoLevel, [number, number]>> = {
  both: {
    states:    [10_000, 3_000_000_000],
    counties:  [0, 30_000_000],
    districts: [250_000, 60_000_000],
  },
  nih: {
    states:    [10_000, 2_500_000_000],
    counties:  [0, 25_000_000],
    districts: [250_000, 50_000_000],
  },
  nsf: {
    states:    [10_000, 500_000_000],
    counties:  [0, 5_000_000],
    districts: [50_000, 10_000_000],
  },
}

// --- Layer factory ---

function getNsfEconImpact(props: TileProperties): number {
  let sum = 0
  for (const d of NSF_DIRECTORATES) {
    sum += props[`NSF_${d.key}_econ_impact`] ?? 0
  }
  return sum
}

function getNsfJobs(props: TileProperties): number {
  let sum = 0
  for (const d of NSF_DIRECTORATES) {
    sum += props[`NSF_${d.key}_jobs`] ?? 0
  }
  return sum
}

function getBaselineValue(props: TileProperties, agencyFilter: AgencyFilter): number {
  if (agencyFilter === 'nih') return props.NIH_tot_econ_impact ?? 0
  if (agencyFilter === 'nsf') return getNsfEconImpact(props)
  return (props.NIH_tot_econ_impact ?? 0) + getNsfEconImpact(props)
}

export { getNsfEconImpact, getNsfJobs, getBaselineValue }

export function createBaselineLayer(
  config: GeoConfig,
  perCapita: boolean,
  colorScale: ScaleLinear<number, number>,
  agencyFilter: AgencyFilter = 'both',
) {
  return new MVTLayer({
    id: 'baseline-mvt',
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
    updateTriggers: { getFillColor: [colorScale, perCapita, agencyFilter] },
    getFillColor: (f: { properties: TileProperties }) => {
      let v = getBaselineValue(f.properties, agencyFilter)
      if (perCapita) {
        const pop = f.properties.pop_2024 ?? 0
        v = pop > 0 ? v / pop : 0
      }
      const idx = Math.round(colorScale(v > 0 ? Math.log(v) : 0) * (LUT_SIZE - 1)) * 4
      return [LUT_BLUES[idx], LUT_BLUES[idx + 1], LUT_BLUES[idx + 2], LUT_BLUES[idx + 3]]
    },
  })
}

export function createColorScale(config: GeoConfig, perCapita: boolean, domainOverride?: [number, number]) {
  const domain = domainOverride ?? (perCapita ? config.perCapitaDomain : config.totalDomain)
  const lower = domain[0] > 0 ? Math.log(domain[0]) : 0
  const upper = Math.log(domain[1])
  return scaleLinear().domain([lower, upper]).range([0, 1]).clamp(true)
}
