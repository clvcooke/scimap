import type { LossGeoLevel, MapGeoConfig } from './map-shared'

const DOMAIN = 'https://data.scienceimpacts.org'
const TILE_VERSION = '2026-03-16'

export const GRANTS_GEO_LEVELS: Record<LossGeoLevel, MapGeoConfig> = {
  counties: {
    tileUrl: `${DOMAIN}/tiles_counties_total_v${TILE_VERSION}-v2/{z}/{x}/{y}.pbf`,
    maxZoom: 9,
    uniqueIdProperty: 'FIPS',
    label: 'Counties',
    domain: [0, 25_000_000],
  },
  districts: {
    tileUrl: `${DOMAIN}/tiles_congs_total_v${TILE_VERSION}-v2/{z}/{x}/{y}.pbf`,
    maxZoom: 9,
    uniqueIdProperty: 'GEOID',
    label: 'Districts',
    domain: [250_000, 50_000_000],
  },
  states: {
    tileUrl: `${DOMAIN}/tiles_states_total_v${TILE_VERSION}-v2/{z}/{x}/{y}.pbf`,
    maxZoom: 7,
    uniqueIdProperty: 'state',
    label: 'States',
    domain: [10_000, 2_500_000_000],
  },
}

export const GRANTS_COLOR_PROPERTY = 'combined_econ_loss'
