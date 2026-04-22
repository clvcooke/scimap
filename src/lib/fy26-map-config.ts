import type { LossGeoLevel, MapGeoConfig } from './map-shared'

const DOMAIN = 'https://data.scienceimpacts.org'

export const FY26_GEO_LEVELS: Record<LossGeoLevel, MapGeoConfig> = {
  counties: {
    tileUrl: `${DOMAIN}/tiles_counties_budget_v1/{z}/{x}/{y}.pbf`,
    maxZoom: 9,
    uniqueIdProperty: 'FIPS',
    label: 'Counties',
    domain: [100_000, 100_000_000],
  },
  districts: {
    tileUrl: `${DOMAIN}/tiles_districts_budget_119_v2/{z}/{x}/{y}.pbf`,
    maxZoom: 9,
    uniqueIdProperty: 'GEOID',
    label: 'Districts',
    domain: [5_000_000, 500_000_000],
  },
  states: {
    tileUrl: `${DOMAIN}/tiles_states_budget_v1/{z}/{x}/{y}.pbf`,
    maxZoom: 7,
    uniqueIdProperty: 'state',
    label: 'States',
    domain: [10_000_000, 5_000_000_000],
  },
}

export const FY26_COLOR_PROPERTY = 'budg_NIH_cuts_econ_loss'
