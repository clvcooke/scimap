import { isTerminationReleaseId } from '@/lib/termination-release'

const CANDIDATE_HOST = 'terminations-candidate.scimap.pages.dev'
const CANDIDATE_SELECTION_URL = 'https://data.scienceimpacts.org/terminations/latest-validated.json'
export const NEWEST_DATASET_URL = `https://${CANDIDATE_HOST}/grants`

export type TerminationReleaseSource =
  | string
  | { releaseId: string }
  | { rejectedRelease: string[] }

export function getTerminationReleaseSource(
  { hostname, search }: Pick<Location, 'hostname' | 'search'>,
  configuredUrl: unknown,
): TerminationReleaseSource {
  if (hostname === 'localhost' || hostname.endsWith('.scimap.pages.dev')) {
    const releases = new URLSearchParams(search).getAll('release')
    if (releases.length === 1 && isTerminationReleaseId(releases[0]))
      return { releaseId: releases[0] }
    if (releases.length) return { rejectedRelease: releases }
  }
  if (hostname === CANDIDATE_HOST) return CANDIDATE_SELECTION_URL
  return typeof configuredUrl === 'string' && configuredUrl
    ? configuredUrl
    : '/termination-selection.json'
}

// Capture the entry URL before client-side routing can drop the override.
export const sessionTerminationSource = getTerminationReleaseSource(
  window.location,
  import.meta.env.VITE_TERMINATION_SELECTION_URL,
)
