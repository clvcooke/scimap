import { useEffect, useState, type ReactNode } from 'react'
import { loadTerminationRelease, type TerminationRelease } from '@/lib/termination-release'

import { ReleaseContext, useTerminationRelease } from '@/lib/termination-release-context'
const configuredUrl: unknown = import.meta.env.VITE_TERMINATION_SELECTION_URL
const SELECTION_URL =
  typeof configuredUrl === 'string' && configuredUrl ? configuredUrl : '/termination-selection.json'
// A page session stays on one release, including route changes. A reload reads the pointer again.
let sessionRelease: Promise<TerminationRelease> | undefined
function selectedRelease() {
  sessionRelease ??= loadTerminationRelease(SELECTION_URL).catch((error: unknown) => {
    sessionRelease = undefined
    throw error
  })
  return sessionRelease
}
export function TerminationReleaseProvider({ children }: { children: ReactNode }) {
  const [release, setRelease] = useState<TerminationRelease | null>(null)
  const [error, setError] = useState(false)
  useEffect(() => {
    let active = true
    void selectedRelease().then(
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
  if (error)
    return (
      <div role="alert" className="p-6">
        Termination data could not be loaded. Please reload to try again.
      </div>
    )
  if (!release)
    return (
      <div role="status" className="p-6">
        Loading termination data…
      </div>
    )
  return <ReleaseContext.Provider value={release}>{children}</ReleaseContext.Provider>
}
export function TerminationReleaseDetails() {
  const { manifest, downloads } = useTerminationRelease()
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
        Source events:{' '}
        {Object.entries(manifest.sources.freshness)
          .map(
            ([name, source]) =>
              `${name.startsWith('nih') ? 'NIH' : 'NSF'} ${source.latest_event_on_or_before_as_of ?? 'not reported'}`,
          )
          .join(' · ')}
      </p>
      {manifest.release_validation.warnings.map((warning) => (
        <p key={warning}>{warning}</p>
      ))}
      <details>
        <summary className="cursor-pointer">Scientific CSV downloads</summary>
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
