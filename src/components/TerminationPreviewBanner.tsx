import { sessionTerminationSource } from '@/lib/termination-preview'
import { isTerminationReleaseId } from '@/lib/termination-release'

export function TerminationPreviewBanner() {
  if (typeof sessionTerminationSource === 'string') return null
  const { releaseId } = sessionTerminationSource
  return (
    <aside
      aria-label="Termination dataset preview"
      className="break-all border-b border-amber-300 bg-amber-100 px-4 py-2 text-sm text-amber-950"
    >
      {isTerminationReleaseId(releaseId)
        ? `Previewing dataset ${releaseId}`
        : 'Invalid preview dataset ID.'}{' '}
      <a className="font-semibold underline" href="/grants">
        Open default dataset
      </a>
    </aside>
  )
}
