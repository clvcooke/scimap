import { useEffect, useState, type ReactNode } from 'react'
import {
  loadTerminationRelease,
  loadTerminationReleaseById,
  type TerminationRelease,
} from '@/lib/termination-release'
import { ReleaseContext, useTerminationRelease } from '@/lib/termination-release-context'
import { sessionTerminationSource } from '@/lib/termination-preview'

const loadableSource =
  typeof sessionTerminationSource === 'string' || 'releaseId' in sessionTerminationSource
    ? sessionTerminationSource
    : null
// A page session stays on one release, including route changes. A reload reads the source again.
let sessionRelease: Promise<TerminationRelease> | undefined
function selectedRelease(source: string | { releaseId: string }) {
  sessionRelease ??= (
    typeof source === 'string'
      ? loadTerminationRelease(source)
      : loadTerminationReleaseById(source.releaseId)
  ).catch((error: unknown) => {
    sessionRelease = undefined
    throw error
  })
  return sessionRelease
}
export function TerminationReleaseProvider({
  children,
  fallback = (status) => status,
}: {
  children: ReactNode
  fallback?: (status: ReactNode) => ReactNode
}) {
  const [release, setRelease] = useState<TerminationRelease | null>(null)
  const [error, setError] = useState(false)
  useEffect(() => {
    if (!loadableSource) return
    let active = true
    void selectedRelease(loadableSource).then(
      (data) => {
        if (active) setRelease(data)
      },
      () => {
        if (active) setError(true)
      },
    )
    return () => {
      active = false
    }
  }, [])
  if (!loadableSource)
    return fallback(
      <div role="alert" className="p-6">
        Termination data is not shown because this link’s preview dataset ID is not valid. See the
        notice at the top of the page.
      </div>,
    )
  if (error)
    return fallback(
      <div role="alert" className="p-6">
        Termination data could not be loaded. Please reload to try again.
      </div>,
    )
  if (!release)
    return fallback(
      <div role="status" className="p-6">
        Loading termination data…
      </div>,
    )
  return <ReleaseContext.Provider value={release}>{children}</ReleaseContext.Provider>
}
export function TerminationReleaseDetails() {
  const { manifest, manifestUrl, downloads } = useTerminationRelease()
  return (
    <aside
      className="bg-gray-50 px-4 py-3 text-sm text-gray-700"
      aria-label="Termination data release"
    >
      <p>
        Reporting week: <time>{manifest.reporting_week}</time> · Data through:{' '}
        <time>{manifest.as_of}</time>
      </p>
      <p>
        Latest recorded grant event:{' '}
        {Object.entries(manifest.sources.freshness)
          .map(
            ([name, source]) =>
              `${name.startsWith('nih') ? 'NIH' : 'NSF'} ${source.latest_event_on_or_before_as_of ?? 'not reported'}`,
          )
          .join(' · ')}
      </p>
      {manifest.release_validation.warnings.length > 0 && (
        <p>Some areas have limited map coverage. See the release information for details.</p>
      )}
      <details>
        <summary className="cursor-pointer">Scientific CSV downloads</summary>
        <p>
          <a className="underline" href={manifestUrl}>
            Release information
          </a>
        </p>
        <ul>
          {downloads.map(({ name, url }) => (
            <li key={name}>
              <a className="underline" href={url}>
                {name}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </aside>
  )
}
