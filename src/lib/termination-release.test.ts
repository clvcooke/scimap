import { webcrypto } from 'node:crypto'
import { describe, it, expect, vi } from 'vitest'
import { loadTerminationRelease, artifactUrl } from './termination-release'
import POINT_POLICY from './termination-point-policy.json'

Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true })
async function hash(text: string) {
  return Array.from(
    new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))),
    (n) => n.toString(16).padStart(2, '0'),
  ).join('')
}
async function fixture(id = 'test-a') {
  const base = `https://data.scienceimpacts.org/terminations/releases/${id}/`
  const row = {
    id: '01',
    name: 'Alabama',
    nih_econ_loss: 1,
    nih_funding_loss: 1,
    nih_job_loss: 1,
    nsf_econ_loss: 0,
    nsf_funding_loss: 0,
    nsf_job_loss: 0,
    total_econ_loss: 1,
    total_funding_loss: 1,
    total_job_loss: 1,
  }
  const table = JSON.stringify([row])
  const points = JSON.stringify({ GRANT_LOSSES: [] })
  const manifest = {
    schema_version: 1,
    release_id: id,
    reporting_week: '2026-10-23',
    as_of: '2026-10-26',
    validation: { status: 'passed' },
    release_validation: { status: 'passed', warnings: [] },
    institution_points: POINT_POLICY,
    sources: { freshness: { nih: { latest_event_on_or_before_as_of: '2026-10-20' } } },
    artifacts: {
      tables: Object.fromEntries(
        ['states', 'counties', 'districts'].map((level) => [
          level,
          { path: `tables/${level}.json`, sha256: '' },
        ]),
      ),
      institutions: { path: 'institutions.json', sha256: await hash(points) },
      downloads: { 'science.csv': { path: 'downloads/science.csv', sha256: 'a'.repeat(64) } },
      tiles: Object.fromEntries(
        ['states', 'counties', 'districts'].map((level) => [
          level,
          {
            path: `tiles/${level}/{z}/{x}/{y}.pbf`,
            layer: `terminations_${level}`,
            id_property: (
              { states: 'state', counties: 'FIPS', districts: 'GEOID' } as Record<string, string>
            )[level],
            min_zoom: 0,
            max_zoom: 7,
          },
        ]),
      ),
    },
  }
  for (const entry of Object.values(manifest.artifacts.tables)) entry.sha256 = await hash(table)
  const bodies: Record<string, string> = Object.fromEntries(
    ['states', 'counties', 'districts'].map((level) => [base + `tables/${level}.json`, table]),
  )
  bodies[base + 'institutions.json'] = points
  async function seal() {
    bodies[base + 'manifest.json'] = JSON.stringify(manifest)
    bodies['/selection.json'] = JSON.stringify({
      schema_version: 1,
      release_id: id,
      manifest_url: base + 'manifest.json',
      manifest_sha256: await hash(bodies[base + 'manifest.json']!),
    })
  }
  await seal()
  const fetcher = vi.fn(async (url: string | URL | Request) => {
    const body = bodies[String(url)]
    if (body === undefined) return { ok: false, status: 404 } as Response
    return { ok: true, arrayBuffer: async () => new TextEncoder().encode(body).buffer } as Response
  }) as unknown as typeof fetch
  return { base, manifest, bodies, seal, fetcher }
}
describe('atomic termination release loading', () => {
  it('keeps tables, tiles and downloads on one verified selection even if the pointer changes during loading', async () => {
    const a = await fixture(),
      b = await fixture('test-b')
    const fetcher: typeof fetch = async (...args) => {
      const response = await a.fetcher(...args)
      if (String(args[0]) === '/selection.json')
        a.bodies['/selection.json'] = b.bodies['/selection.json']!
      return response
    }
    const release = await loadTerminationRelease('/selection.json', fetcher)
    expect(release.manifest.release_id).toBe('test-a')
    expect(release.tables.counties[0]?.name).toBe('Alabama')
    expect(release.downloads[0]?.url).toBe(a.base + 'downloads/science.csv')
  })
  it('rejects a corrupt table instead of exposing a partial release', async () => {
    const f = await fixture()
    f.bodies[f.base + 'tables/counties.json'] = '[]'
    await expect(loadTerminationRelease('/selection.json', f.fetcher)).rejects.toThrow('checksum')
  })
  it('rejects a replaced manifest', async () => {
    const f = await fixture()
    f.bodies[f.base + 'manifest.json'] += ' '
    await expect(loadTerminationRelease('/selection.json', f.fetcher)).rejects.toThrow('checksum')
  })
  it('blocks unsupported point policy and scientific/release failures', async () => {
    for (const field of ['validation', 'release_validation'] as const) {
      const f = await fixture()
      f.manifest[field].status = 'failed'
      await f.seal()
      await expect(loadTerminationRelease('/selection.json', f.fetcher)).rejects.toThrow(
        'unvalidated',
      )
    }
    const f = await fixture()
    f.manifest.institution_points = { ...POINT_POLICY, minimum_current_loss_dollars: 1 }
    await f.seal()
    await expect(loadTerminationRelease('/selection.json', f.fetcher)).rejects.toThrow(
      'point policy',
    )
  })
  it('blocks validly hashed but malformed data', async () => {
    const f = await fixture()
    f.bodies[f.base + 'institutions.json'] = JSON.stringify({
      GRANT_LOSSES: [{ org_name: 'Invalid' }],
    })
    f.manifest.artifacts.institutions.sha256 = await hash(f.bodies[f.base + 'institutions.json']!)
    await f.seal()
    await expect(loadTerminationRelease('/selection.json', f.fetcher)).rejects.toThrow(
      'institution',
    )
  })
  it('surfaces a missing artifact and forwards cancellation', async () => {
    const f = await fixture()
    delete f.bodies[f.base + 'tables/states.json']
    const controller = new AbortController()
    await expect(
      loadTerminationRelease('/selection.json', f.fetcher, controller.signal),
    ).rejects.toThrow('404')
    expect(f.fetcher).toHaveBeenCalledWith(
      '/selection.json',
      expect.objectContaining({ signal: controller.signal }),
    )
  })
  it('does not allow artifacts to escape the release directory', () => {
    for (const path of [
      '../other.json',
      '/absolute.json',
      'https://other.test/file',
      'tables/%2e%2e/data.json',
      'tables/a.json?x',
    ])
      expect(() => artifactUrl('https://example.test/release/', path)).toThrow()
  })
})
