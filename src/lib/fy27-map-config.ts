import type { AgencyFilter, LossGeoLevel, MapGeoConfig } from './map-shared'

const DOMAIN = 'https://data.scienceimpacts.org'

export const FY27_GEO_LEVELS: Record<LossGeoLevel, MapGeoConfig> = {
  counties: {
    tileUrl: `${DOMAIN}/tiles_counties_budget27_v5/{z}/{x}/{y}.pbf`,
    maxZoom: 9,
    uniqueIdProperty: 'FIPS',
    label: 'Counties',
    domain: [25_000, 20_000_000],
  },
  districts: {
    tileUrl: `${DOMAIN}/tiles_districts_budget27_v5/{z}/{x}/{y}.pbf`,
    maxZoom: 9,
    uniqueIdProperty: 'GEOID',
    label: 'Districts',
    domain: [5_000_000, 500_000_000],
  },
  states: {
    tileUrl: `${DOMAIN}/tiles_states_budget27_v5/{z}/{x}/{y}.pbf`,
    maxZoom: 7,
    uniqueIdProperty: 'state',
    label: 'States',
    domain: [10_000_000, 5_000_000_000],
  },
}

export const FY27_COLOR_PROPERTY = 'econ_budg_total_cuts'

export const FY27_COLOR_PROPERTIES: Record<AgencyFilter, string> = {
  both: 'econ_budg_total_cuts',
  nih: 'econ_budg_NIH_cuts',
  nsf: 'econ_budg_NSF_cuts',
}

/** Per-agency domain overrides for good color contrast. */
export const FY27_AGENCY_DOMAINS: Record<AgencyFilter, Record<LossGeoLevel, [number, number]>> = {
  both: {
    counties:  [25_000, 20_000_000],
    districts: [5_000_000, 500_000_000],
    states:    [10_000_000, 5_000_000_000],
  },
  nih: {
    counties:  [10_000, 10_000_000],
    districts: [1_500_000, 200_000_000],
    states:    [10_000_000, 4_000_000_000],
  },
  nsf: {
    counties:  [10_000, 20_000_000],
    districts: [1_500_000, 200_000_000],
    states:    [10_000_000, 4_000_000_000],
  },
}
