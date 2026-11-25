import { Fragment } from 'react'
import { NEWEST_DATASET_URL, sessionTerminationSource } from '@/lib/termination-preview'

export function TerminationPreviewBanner() {
  if (typeof sessionTerminationSource === 'string') return null
  return (
    <aside
      aria-label="Termination dataset preview"
      className="break-all border-b border-amber-300 bg-amber-100 px-4 py-2 text-sm text-amber-950"
    >
      {'releaseId' in sessionTerminationSource ? (
        <>
          Previewing dataset {sessionTerminationSource.releaseId}{' '}
          <a className="font-semibold underline" href="/grants">
            Open default dataset
          </a>
        </>
      ) : (
        <>
          {sessionTerminationSource.rejectedRelease.length > 1
            ? 'This link has more than one preview dataset ID, so none was loaded: '
            : 'This link’s preview dataset ID is not valid, so it was not loaded: '}
          {sessionTerminationSource.rejectedRelease.map((value, index) => (
            <Fragment key={index}>
              {index > 0 && ', '}
              {value ? <code>{value}</code> : <em>(empty)</em>}
            </Fragment>
          ))}
          . A dataset ID starts with a letter or number and otherwise uses only letters, numbers,
          periods (.), underscores (_) and hyphens (-).{' '}
          <a className="font-semibold underline" href={NEWEST_DATASET_URL}>
            Open the newest dataset
          </a>
        </>
      )}
    </aside>
  )
}
