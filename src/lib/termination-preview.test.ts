import { expect, it } from 'vitest'
import { getTerminationReleaseSource } from './termination-preview'

const releaseId = '2026-11-24-daily-20261124T162915Z-02777460'
const website = 'https://data.scienceimpacts.org/terminations/website-release.json'

it.each([
  'work-s01-candidate-preview.scimap.pages.dev',
  'abc.other-project.pages.dev',
  'localhost',
])('accepts a pinned release on %s', (hostname) => {
  expect(
    getTerminationReleaseSource({ hostname, search: `?release=${releaseId}` }, website),
  ).toEqual({
    releaseId,
  })
})

it.each(['scienceimpacts.org', 'www.scienceimpacts.org', 'preview.pages.dev.example.org'])(
  'ignores even a malformed override on %s and preserves the normal selection',
  (hostname) => {
    const location = { hostname, search: '?release=../other' }
    expect(getTerminationReleaseSource(location, website)).toBe(website)
    expect(getTerminationReleaseSource(location, undefined)).toBe('/termination-selection.json')
  },
)

it('uses the daily pointer only on the dedicated candidate alias', () => {
  const candidate = { hostname: 'terminations-candidate.scimap.pages.dev', search: '' }
  expect(getTerminationReleaseSource(candidate, website)).toBe(
    'https://data.scienceimpacts.org/terminations/latest-validated.json',
  )
  expect(
    getTerminationReleaseSource({ ...candidate, search: `?release=${releaseId}` }, website),
  ).toEqual({
    releaseId,
  })
  expect(
    getTerminationReleaseSource({ hostname: 'other.scimap.pages.dev', search: '' }, undefined),
  ).toBe('/termination-selection.json')
})

it('rejects ambiguous preview URLs instead of choosing the first ID or the default', () => {
  const location = { hostname: 'localhost', search: '?release=one&release=two' }
  expect(getTerminationReleaseSource(location, website)).toEqual({ releaseId: '' })
})
