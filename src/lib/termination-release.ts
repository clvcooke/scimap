import type { GrantTermination } from '@/data/grant-losses'
import type { LossGeoLevel } from './map-shared'
import POINT_POLICY from './termination-point-policy.json'

export interface RegionRow {
  id: string
  name: string
  nih_econ_loss: number
  nih_funding_loss: number
  nih_job_loss: number
  nsf_econ_loss: number
  nsf_funding_loss: number
  nsf_job_loss: number
  total_econ_loss: number
  total_funding_loss: number
  total_job_loss: number
}
interface Artifact {
  path: string
  sha256: string
}
interface TileArtifact extends Artifact {
  max_zoom: number
  min_zoom: number
  id_property: string
  layer: string
}
export interface ReleaseManifest {
  schema_version: number
  release_id: string
  reporting_week: string
  as_of: string
  validation: { status: string }
  release_validation: { status: string; warnings: string[] }
  institution_points: typeof POINT_POLICY
  sources: { freshness: Record<string, { latest_event_on_or_before_as_of: string | null }> }
  artifacts: {
    tables: Record<LossGeoLevel, Artifact>
    institutions: Artifact
    downloads: Record<string, Artifact>
    tiles: Record<LossGeoLevel, TileArtifact>
  }
}
export interface TerminationRelease {
  manifest: ReleaseManifest
  manifestUrl: string
  baseUrl: string
  tables: Record<LossGeoLevel, RegionRow[]>
  grants: GrantTermination[]
  downloads: { name: string; url: string }[]
}
const LEVELS: LossGeoLevel[] = ['states', 'counties', 'districts']
const HASH = /^[a-f0-9]{64}$/
const DATA_ROOT = 'https://data.scienceimpacts.org/terminations/releases/'

export function artifactUrl(base: string, path: string) {
  if (
    !path ||
    path.startsWith('/') ||
    path.split('/').some((part) => !part || part === '.' || part === '..') ||
    /[?#%\\:]/.test(path)
  ) {
    throw new Error('Invalid release artifact path')
  }
  return base + path
}

async function fetchBytes(url: string, fetcher: typeof fetch, signal?: AbortSignal) {
  const response = await fetcher(url, { signal: signal ?? null, cache: 'no-cache' })
  if (!response.ok) throw new Error(`Could not load termination data (${response.status})`)
  return response.arrayBuffer()
}
async function verifiedJson(
  url: string,
  hash: string,
  fetcher: typeof fetch,
  signal?: AbortSignal,
): Promise<unknown> {
  if (!HASH.test(hash)) throw new Error('Missing release checksum')
  const bytes = await fetchBytes(url, fetcher, signal)
  const actual = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), (n) =>
    n.toString(16).padStart(2, '0'),
  ).join('')
  if (actual !== hash) throw new Error('Termination release checksum mismatch')
  return JSON.parse(new TextDecoder().decode(bytes)) as unknown
}

export function validateManifest(value: unknown): asserts value is ReleaseManifest {
  const m = value as ReleaseManifest
  if (
    m?.schema_version !== 1 ||
    !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(m.release_id) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(m.reporting_week) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(m.as_of) ||
    m.reporting_week > m.as_of ||
    m.validation?.status !== 'passed' ||
    m.release_validation?.status !== 'passed' ||
    !Array.isArray(m.release_validation.warnings) ||
    !m.release_validation.warnings.every((v) => typeof v === 'string')
  ) {
    throw new Error('Unsupported or unvalidated termination release')
  }
  if (
    m.institution_points?.minimum_current_loss_dollars !==
      POINT_POLICY.minimum_current_loss_dollars ||
    m.institution_points?.requires_positive_current_grant_count !== true
  )
    throw new Error('Unsupported institution point policy')
  for (const level of LEVELS) {
    const tile = m.artifacts?.tiles?.[level]
    if (
      tile?.path !== `tiles/${level}/{z}/{x}/{y}.pbf` ||
      tile.layer !== `terminations_${level}` ||
      tile.id_property !== { states: 'state', counties: 'FIPS', districts: 'GEOID' }[level] ||
      tile.min_zoom !== 0 ||
      !Number.isInteger(tile.max_zoom) ||
      tile.max_zoom < 0 ||
      tile.max_zoom > 14
    )
      throw new Error('Unsupported termination tile configuration')
  }
  if (
    !m.sources?.freshness ||
    !m.artifacts?.downloads ||
    !Object.keys(m.artifacts.downloads).length
  )
    throw new Error('Missing release provenance/downloads')
}
function validateTable(value: unknown): RegionRow[] {
  const rows = value as RegionRow[]
  const metrics = [
    'nih_econ_loss',
    'nih_funding_loss',
    'nih_job_loss',
    'nsf_econ_loss',
    'nsf_funding_loss',
    'nsf_job_loss',
    'total_econ_loss',
    'total_funding_loss',
    'total_job_loss',
  ] as const
  if (
    !Array.isArray(rows) ||
    !rows.length ||
    rows.some(
      (r) =>
        !r ||
        typeof r.id !== 'string' ||
        typeof r.name !== 'string' ||
        metrics.some((k) => !Number.isFinite(r[k])),
    ) ||
    new Set(rows.map((r) => r.id)).size !== rows.length
  )
    throw new Error('Invalid termination table')
  return rows
}
function validateGrants(value: unknown): GrantTermination[] {
  const rows = (value as { GRANT_LOSSES: GrantTermination[] })?.GRANT_LOSSES
  if (
    !Array.isArray(rows) ||
    rows.some(
      (r) =>
        !r ||
        typeof r.org_name !== 'string' ||
        !['lat', 'lon', 'terminated_loss', 'terminated_loss_noself', 'nih_loss', 'nsf_loss'].every(
          (k) => Number.isFinite(r[k]),
        ) ||
        Math.abs(r.lat) > 90 ||
        Math.abs(r.lon) > 180 ||
        r.terminated_loss < POINT_POLICY.minimum_current_loss_dollars ||
        ![r.terminated_num, r.nih_num, r.nsf_num].every((n) => Number.isInteger(n) && n >= 0) ||
        r.terminated_num <= 0 ||
        r.terminated_num !== r.nih_num + r.nsf_num,
    )
  )
    throw new Error('Invalid termination institution data')
  return rows
}

/** Resolve the pointer once; expose nothing until every artifact belongs to that manifest. */
export async function loadTerminationRelease(
  selectionUrl: string,
  fetcher: typeof fetch = fetch,
  signal?: AbortSignal,
): Promise<TerminationRelease> {
  const selection = JSON.parse(
    new TextDecoder().decode(await fetchBytes(selectionUrl, fetcher, signal)),
  ) as { schema_version: number; manifest_url: string; manifest_sha256: string; release_id: string }
  if (
    selection.schema_version !== 1 ||
    typeof selection.manifest_url !== 'string' ||
    !selection.manifest_url.startsWith(DATA_ROOT) ||
    selection.manifest_url !== `${DATA_ROOT}${selection.release_id}/manifest.json`
  )
    throw new Error('Invalid termination selection')
  const manifest = await verifiedJson(
    selection.manifest_url,
    selection.manifest_sha256,
    fetcher,
    signal,
  )
  validateManifest(manifest)
  if (selection.release_id !== manifest.release_id)
    throw new Error('Termination release identity mismatch')
  const baseUrl = selection.manifest_url.slice(0, -'manifest.json'.length)
  const [states, counties, districts, institutions] = await Promise.all([
    ...LEVELS.map(async (level) => {
      const record = manifest.artifacts.tables?.[level]
      if (!record) throw new Error('Missing termination table')
      return verifiedJson(artifactUrl(baseUrl, record.path), record.sha256, fetcher, signal)
    }),
    verifiedJson(
      artifactUrl(baseUrl, manifest.artifacts.institutions.path),
      manifest.artifacts.institutions.sha256,
      fetcher,
      signal,
    ),
  ])
  return {
    manifest,
    manifestUrl: selection.manifest_url,
    baseUrl,
    tables: {
      states: validateTable(states),
      counties: validateTable(counties),
      districts: validateTable(districts),
    },
    grants: validateGrants(institutions),
    downloads: Object.entries(manifest.artifacts.downloads).map(([name, record]) => ({
      name,
      url: artifactUrl(baseUrl, record.path),
    })),
  }
}
