import type { AgencyFilter, LossGeoLevel, MapGeoConfig } from './map-shared'

import { artifactUrl, type TerminationRelease } from './termination-release'

const GEO_LEVEL_DEFAULTS: Record<LossGeoLevel, MapGeoConfig> = {
  counties: {
    tileUrl: '',
    maxZoom: 7,
    uniqueIdProperty: 'FIPS',
    label: 'Counties',
    domain: [0, 25_000_000],
  },
  districts: {
    tileUrl: '',
    maxZoom: 7,
    uniqueIdProperty: 'GEOID',
    label: 'Districts',
    domain: [250_000, 50_000_000],
  },
  states: {
    tileUrl: '',
    maxZoom: 7,
    uniqueIdProperty: 'state',
    label: 'States',
    domain: [10_000, 2_500_000_000],
  },
}

export const GRANTS_COLOR_PROPERTY = 'terminated_econ_loss'

export const GRANTS_COLOR_PROPERTIES: Record<AgencyFilter, string> = {
  both: 'terminated_econ_loss',
  nih: 'nih_overall_econ_loss',
  nsf: 'nsf_overall_econ_loss',
}

export const GRANTS_JOB_PROPERTIES: Record<AgencyFilter, string> = {
  both: 'terminated_job_loss',
  nih: 'nih_overall_job_loss',
  nsf: 'nsf_overall_job_loss',
}

/** Currently-active (not-yet-reinstated) economic loss. */
export const GRANTS_CURRENT_ECON_PROPERTIES: Record<AgencyFilter, string> = {
  both: 'terminated_current_econ_loss',
  nih: 'nih_current_econ_loss',
  nsf: 'nsf_current_econ_loss',
}

/** Currently-active (not-yet-reinstated) job loss. */
export const GRANTS_CURRENT_JOB_PROPERTIES: Record<AgencyFilter, string> = {
  both: 'terminated_current_job_loss',
  nih: 'nih_current_job_loss',
  nsf: 'nsf_current_job_loss',
}

/** Per-agency domain overrides for good color contrast. */
export const GRANTS_AGENCY_DOMAINS: Record<AgencyFilter, Record<LossGeoLevel, [number, number]>> = {
  both: {
    counties:  [0, 25_000_000],
    districts: [250_000, 50_000_000],
    states:    [10_000, 2_500_000_000],
  },
  nih: {
    counties:  [0, 20_000_000],
    districts: [200_000, 40_000_000],
    states:    [10_000, 2_000_000_000],
  },
  nsf: {
    counties:  [0, 5_000_000],
    districts: [50_000, 10_000_000],
    states:    [10_000, 500_000_000],
  },
}

export function grantsGeoLevels(release: TerminationRelease): Record<LossGeoLevel, MapGeoConfig> {
  return Object.fromEntries(Object.entries(GEO_LEVEL_DEFAULTS).map(([level, config]) => {
    const tile = release.manifest.artifacts.tiles[level as LossGeoLevel]
    return [level, { ...config, tileUrl: artifactUrl(release.baseUrl, tile.path), maxZoom: tile.max_zoom, uniqueIdProperty: tile.id_property }]
  })) as Record<LossGeoLevel, MapGeoConfig>
}
