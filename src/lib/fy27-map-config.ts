import type { LossGeoLevel, MapGeoConfig } from './map-shared'

const DOMAIN = 'https://data.scienceimpacts.org'

export const FY27_GEO_LEVELS: Record<LossGeoLevel, MapGeoConfig> = {
  counties: {
    tileUrl: `${DOMAIN}/tiles_counties_budget27_v1/{z}/{x}/{y}.pbf`,
    maxZoom: 9,
    uniqueIdProperty: 'FIPS',
    label: 'Counties',
    domain: [100_000, 100_000_000],
  },
  districts: {
    tileUrl: `${DOMAIN}/tiles_districts_budget27_v1/{z}/{x}/{y}.pbf`,
    maxZoom: 9,
    uniqueIdProperty: 'GEOID',
    label: 'Districts',
    domain: [5_000_000, 500_000_000],
  },
  states: {
    tileUrl: `${DOMAIN}/tiles_states_budget27_v1/{z}/{x}/{y}.pbf`,
    maxZoom: 7,
    uniqueIdProperty: 'state',
    label: 'States',
    domain: [10_000_000, 5_000_000_000],
  },
}

export const FY27_COLOR_PROPERTY = 'econ_budg_total_cuts'
