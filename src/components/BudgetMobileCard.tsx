import { X } from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/constants'
import type { LossGeoLevel, TileProps } from '@/lib/map-shared'
import { stateName } from '@/lib/constants'
import type { BudgetDrawerConfig } from './BudgetDrawer'

export default function BudgetMobileCard({
  props,
  geoLevel,
  config,
  onSeeMore,
  onClose,
}: {
  props: TileProps
  geoLevel: LossGeoLevel
  config: BudgetDrawerConfig
  onSeeMore: () => void
  onClose: () => void
}) {
  const stateRaw = props.state != null ? String(props.state) : ''
  const county = props.county != null ? String(props.county) : undefined

  let label = stateName(stateRaw)
  if (geoLevel === 'districts' && props.GEOID) {
    const num = String(props.GEOID).slice(-2)
    const distLabel = num === '00' ? 'At-Large' : num === '98' && stateRaw === 'DC' ? 'No District' : `District ${parseInt(num, 10)}`
    label = `${stateRaw} ${distLabel}`
  } else if (county) {
    label = `${county}, ${stateRaw}`
  } else if (props.state_name) {
    label = String(props.state_name)
  }

  const stats = config.stats(props)

  return (
    <div className="absolute bottom-2 left-2 right-14 z-20 rounded-xl bg-white p-3 shadow-lg">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-gray-900">{label}</div>
          <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-gray-500">
            {stats.slice(0, 3).map((s) => (
              <span key={s.label}>
                {s.label}: {s.format === 'currency' ? formatCurrency(s.value) : formatNumber(s.value)}
              </span>
            ))}
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
