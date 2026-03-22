import { useState, useMemo } from 'react'
import { DrawerPreview as Drawer } from '@base-ui/react/drawer'
import { interpolateOrRd } from 'd3-scale-chromatic'
import { X } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { METRICS, INSTITUTES, formatMetricValue } from '@/lib/constants'
import type { Metric } from '@/lib/constants'
import type { SelectedFeature } from '@/lib/map-config'

// --- Drawer content (institute breakdown) ---

function DrawerBody({
  feature,
  geoLabel,
  perCapita,
}: {
  feature: SelectedFeature
  geoLabel: string
  perCapita: boolean
}) {
  const [metric, setMetric] = useState<Metric>('econ_impact')
  const props = feature.properties as Record<string, number | string>
  const population = (props.pop_2024 as number) ?? 0

  const rows = useMemo(() => {
    return INSTITUTES.map((inst) => {
      let value = (props[`${inst.key}_${metric}`] as number) ?? 0
      if (perCapita && population > 0) value = value / population
      return { ...inst, value }
    }).sort((a, b) => b.value - a.value)
  }, [props, metric, perCapita, population])

  const maxValue = rows[0]?.value ?? 1

  let nihTotal = (props[`NIH_tot_${metric}`] as number) ?? 0
  if (perCapita && population > 0) nihTotal = nihTotal / population

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between border-b px-5 py-4">
        <div>
          <Drawer.Title className="text-lg font-semibold text-gray-900">
            {geoLabel}: {feature.id}
          </Drawer.Title>
          <p className="mt-0.5 text-sm text-gray-500">
            Population: {population.toLocaleString()}
          </p>
        </div>
        <Drawer.Close className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 active:bg-gray-200">
          <X className="size-5" />
        </Drawer.Close>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-2 border-b px-4 py-3 sm:grid-cols-3 sm:gap-3 sm:px-5 sm:py-4">
        {METRICS.map((m) => {
          let val = (props[`NIH_tot_${m.key}`] as number) ?? 0
          if (perCapita && population > 0) val = val / population
          return (
            <div key={m.key} className="rounded-lg bg-gray-50 px-3 py-2">
              <div className="text-xs font-medium text-gray-500">{m.label}</div>
              <div className="mt-0.5 text-sm font-semibold text-gray-900">
                {formatMetricValue(val, m.key as Metric)}
              </div>
            </div>
          )
        })}
      </div>

      {/* Metric tabs */}
      <div className="border-b px-5 py-3">
        <Tabs value={metric} onValueChange={(val) => setMetric(val as Metric)}>
          <TabsList>
            {METRICS.map((m) => (
              <TabsTrigger key={m.key} value={m.key}>
                {m.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Institute breakdown */}
      <div className="flex-1 overflow-y-auto px-5 py-3">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Institute Breakdown
          </span>
          <span className="text-xs text-gray-400">
            Total: {formatMetricValue(nihTotal as number, metric)}
            {perCapita ? ' per capita' : ''}
          </span>
        </div>
        <div className="space-y-1.5">
          {rows.map((row) => {
            const pct = maxValue > 0 ? (row.value / maxValue) * 100 : 0
            const t = maxValue > 0 ? row.value / maxValue : 0
            return (
              <div key={row.key} className="group">
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-medium text-gray-700" title={row.name}>
                    {row.key}
                  </span>
                  <span className="text-xs tabular-nums text-gray-500">
                    {formatMetricValue(row.value, metric)}
                  </span>
                </div>
                <div className="mt-0.5 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: interpolateOrRd(0.3 + t * 0.7),
                    }}
                  />
                </div>
                <div className="mt-0.5 text-[11px] leading-tight text-gray-400 opacity-0 transition-opacity group-hover:opacity-100">
                  {row.name}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

// --- Drawer shell ---

export default function DetailDrawer({
  feature,
  geoLabel,
  perCapita,
  onClose,
}: {
  feature: SelectedFeature | null
  geoLabel: string
  perCapita: boolean
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
                <DrawerBody feature={feature} geoLabel={geoLabel} perCapita={perCapita} />
              )}
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
