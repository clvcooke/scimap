import type { LossGeoLevel, MapGeoConfig } from './map-shared'

const DOMAIN = 'https://data.scienceimpacts.org'

export const IDC_GEO_LEVELS: Record<LossGeoLevel, MapGeoConfig> = {
  counties: {
    tileUrl: `${DOMAIN}/tiles_counties_idc_v1/{z}/{x}/{y}.pbf`,
    maxZoom: 9,
    uniqueIdProperty: 'FIPS',
    label: 'Counties',
    domain: [0, 25_000_000],
  },
  districts: {
    tileUrl: `${DOMAIN}/tiles_districts_idc_v1/{z}/{x}/{y}.pbf`,
    maxZoom: 9,
    uniqueIdProperty: 'GEOID',
    label: 'Districts',
    domain: [250_000, 50_000_000],
  },
  states: {
    tileUrl: `${DOMAIN}/tiles_states_idc_v1/{z}/{x}/{y}.pbf`,
    maxZoom: 7,
    uniqueIdProperty: 'state',
    label: 'States',
    domain: [10_000, 2_500_000_000],
  },
}

export const IDC_COLOR_PROPERTY = 'IDC_econ_loss'
