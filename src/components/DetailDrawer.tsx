import { useState, useMemo } from 'react'
import { DrawerPreview as Drawer } from '@base-ui/react/drawer'
import { interpolateBlues } from 'd3-scale-chromatic'
import { X } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { METRICS, formatMetricValue, formatNumber } from '@/lib/constants'
import type { Metric } from '@/lib/constants'
import type { SelectedFeature } from '@/lib/map-config'
import { NSF_DIRECTORATES, type AgencyFilter } from '@/lib/map-shared'

// --- Drawer content (agency breakdown) ---

function getNsfMetricTotal(props: Record<string, number>, metric: Metric): number {
  let sum = 0
  for (const d of NSF_DIRECTORATES) {
    sum += props[`NSF_${d.key}_${metric}`] ?? 0
  }
  return sum
}

function getSummaryCards(
  props: Record<string, number>,
  agencyFilter: AgencyFilter,
  perCapita: boolean,
  population: number,
): { key: string; label: string; value: number }[] {
  const adjust = (v: number) => (perCapita && population > 0 ? v / population : v)

  if (agencyFilter === 'nih') {
    return METRICS.map((m) => ({
      key: m.key,
      label: m.label,
      value: adjust(props[`NIH_tot_${m.key}`] ?? 0),
    }))
  }

  if (agencyFilter === 'nsf') {
    return METRICS.map((m) => ({
      key: m.key,
      label: m.label,
      value: adjust(getNsfMetricTotal(props, m.key)),
    }))
  }

  // both: NIH + NSF totals
  return METRICS.map((m) => {
    const nih = props[`NIH_tot_${m.key}`] ?? 0
    const nsf = getNsfMetricTotal(props, m.key)
    return { key: m.key, label: m.label, value: adjust(nih + nsf) }
  })
}

function DrawerBody({
  feature,
  perCapita,
  agencyFilter = 'both',
}: {
  feature: SelectedFeature
  perCapita: boolean
  agencyFilter?: AgencyFilter
}) {
  const [metric, setMetric] = useState<Metric>('econ_impact')
  const props = feature.properties
  const population = props.pop_2024 ?? 0

  const availableMetrics = METRICS
  const activeMetric = metric

  // Agency breakdown rows (Total, NIH, NSF)
  const breakdownRows = useMemo(() => {
    const adjust = (v: number) => (perCapita && population > 0 ? v / population : v)
    const nih = adjust(props[`NIH_tot_${activeMetric}`] ?? 0)
    const nsf = adjust(getNsfMetricTotal(props, activeMetric))

    if (agencyFilter === 'nih') {
      return [{ key: 'NIH', name: 'National Institutes of Health', value: nih }]
    }
    if (agencyFilter === 'nsf') {
      return [{ key: 'NSF', name: 'National Science Foundation', value: nsf }]
    }
    return [
      { key: 'Total', name: 'Combined Total', value: nih + nsf },
      { key: 'NIH', name: 'National Institutes of Health', value: nih },
      { key: 'NSF', name: 'National Science Foundation', value: nsf },
    ]
  }, [props, activeMetric, perCapita, population, agencyFilter])

  const summaryCards = useMemo(
    () => getSummaryCards(props, agencyFilter, perCapita, population),
    [props, agencyFilter, perCapita, population],
  )

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between border-b px-5 py-4">
        <div>
          <Drawer.Title className="text-lg font-semibold text-gray-900">
            {feature.id}
          </Drawer.Title>
          {population > 0 && (
            <p className="mt-0.5 text-sm text-gray-500">
              Population: {formatNumber(population)}
            </p>
          )}
        </div>
        <Drawer.Close className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 active:bg-gray-200">
          <X className="size-5" />
        </Drawer.Close>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-2 border-b px-4 py-3 sm:grid-cols-3 sm:gap-3 sm:px-5 sm:py-4">
        {summaryCards.map((card) => (
          <div key={card.key} className="rounded-lg bg-gray-50 px-3 py-2">
            <div className="text-xs font-medium text-gray-500">{card.label}</div>
            <div className="mt-0.5 text-sm font-semibold text-gray-900">
              {formatMetricValue(card.value, card.key as Metric)}
            </div>
          </div>
        ))}
      </div>

      {/* Metric tabs */}
      <div className="border-b px-5 py-3">
        <Tabs value={activeMetric} onValueChange={(val: string) => setMetric(val as Metric)}>
          <TabsList>
            {availableMetrics.map((m) => (
              <TabsTrigger key={m.key} value={m.key}>
                {m.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Breakdown section */}
      <div className="flex-1 overflow-y-auto px-5 py-3">
        {breakdownRows.length > 0 && (
          <BreakdownSection
            title="Agency Breakdown"
            rows={breakdownRows}
            metric={activeMetric}
          />
        )}
      </div>
    </>
  )
}

function BreakdownSection({
  title,
  rows,
  metric,
}: {
  title: string
  rows: { key: string; name: string; value: number }[]
  metric: Metric
}) {
  const maxValue = Math.max(...rows.map((r) => r.value), 0) || 1

  return (
    <div className="mb-5 last:mb-0">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
          {title}
        </span>
      </div>
      <div className="space-y-3">
        {rows.map((row) => {
          const pct = maxValue > 0 ? (row.value / maxValue) * 100 : 0
          const t = maxValue > 0 ? row.value / maxValue : 0
          return (
            <div key={row.key}>
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="font-medium text-gray-700">{row.name}</span>
                <span className="shrink-0 text-xs tabular-nums text-gray-500">
                  {formatMetricValue(row.value, metric)}
                </span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: interpolateBlues(0.3 + t * 0.7),
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// --- Drawer shell ---

export default function DetailDrawer({
  feature,
  perCapita,
  agencyFilter = 'both',
  onClose,
}: {
  feature: SelectedFeature | null
  perCapita: boolean
  agencyFilter?: AgencyFilter
  onClose: () => void
}) {
  return (
    <Drawer.Root
      open={feature !== null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      swipeDirection="right"
    >
      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 z-60 bg-black/25 backdrop-blur-[2px] transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Drawer.Viewport className="fixed inset-0 z-70">
          <Drawer.Popup className="fixed inset-y-0 right-0 w-full transition-transform duration-300 ease-out data-ending-style:translate-x-full data-starting-style:translate-x-full sm:w-105 sm:max-w-[calc(100vw-48px)]">
            <Drawer.Content className="flex h-full w-full flex-col overflow-hidden rounded-l-xl bg-white shadow-2xl">
              {feature && (
                <DrawerBody feature={feature} perCapita={perCapita} agencyFilter={agencyFilter} />
              )}
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
