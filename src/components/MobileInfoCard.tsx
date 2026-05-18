import { X } from 'lucide-react'
import { formatCurrency } from '@/lib/constants'
import { getBaselineValue } from '@/lib/map-config'
import type { SelectedFeature } from '@/lib/map-config'
import type { AgencyFilter } from '@/lib/map-shared'

const AGENCY_LABELS: Record<AgencyFilter, string> = {
  both: 'Impact',
  nih: 'NIH Impact',
  nsf: 'NSF Impact',
}

export default function MobileInfoCard({
  feature,
  perCapita,
  agencyFilter = 'both',
  onSeeMore,
  onClose,
}: {
  feature: SelectedFeature
  geoLabel: string
  perCapita: boolean
  agencyFilter?: AgencyFilter
  onSeeMore: () => void
  onClose: () => void
}) {
  const props = feature.properties
  const impact = getBaselineValue(props, agencyFilter)
  const pop = props.pop_2024 ?? 0

  const pc = pop > 0 ? impact / pop : 0

  return (
    <div className="absolute bottom-2 left-2 right-14 z-20 rounded-xl bg-white p-3 shadow-lg">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-gray-900">
            {feature.id}
          </div>
          <div className="mt-0.5 text-xs text-gray-500">
            <span>{AGENCY_LABELS[agencyFilter]}: {formatCurrency(impact)}</span>
            <span className="mx-1.5 text-gray-300">&middot;</span>
            {pop > 0 && <span>Pop: {pop.toLocaleString()}</span>}
            {perCapita && (
              <>
                <span className="mx-1.5 text-gray-300">&middot;</span>
                <span>Per Cap: {formatCurrency(pc)}</span>
              </>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 rounded-md p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
      </div>
      <button
        onClick={onSeeMore}
        className="mt-2 w-full rounded-lg bg-brand-blue py-1.5 text-xs font-semibold text-white active:bg-brand-blue-dark"
      >
        See Details
      </button>
    </div>
  )
}
