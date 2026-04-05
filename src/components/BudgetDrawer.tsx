import { type ReactNode } from 'react'
import { DrawerPreview as Drawer } from '@base-ui/react/drawer'
import { interpolateOrRd } from 'd3-scale-chromatic'
import { X } from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/constants'
import {
  getHouseRep,
  getSenatorsList,
  formatPoliticianName,
} from '@/lib/legislature'
import type { LossGeoLevel, TileProps } from '@/lib/map-shared'

// ── Types ──────────────────────────────────────────────────────────

export interface StatCard {
  label: string
  value: number
  format: 'currency' | 'number'
}

export interface BreakdownRow {
  key: string
  name: string
  value: number
  format: 'currency' | 'number'
}

export interface DrawerSection {
  title: string
  rows: BreakdownRow[]
}

export interface BudgetDrawerConfig {
  /** Summary metric cards shown at the top. */
  stats: (props: TileProps) => StatCard[]
  /** Breakdown sections with bar charts. */
  sections: (props: TileProps) => DrawerSection[]
}

// ── Helpers ─────────────────────────────────────────────────────────

function formatStat(value: number, format: 'currency' | 'number') {
  return format === 'currency' ? formatCurrency(value) : formatNumber(value)
}

function locationLabel(props: TileProps, geoLevel: LossGeoLevel): string {
  const state = props.state != null ? String(props.state) : ''
  const county = props.county != null ? String(props.county) : undefined

  if (geoLevel === 'districts' && props.GEOID) {
    const num = String(props.GEOID).slice(-2)
    const distLabel = num === '00' ? 'At-Large' : `District ${parseInt(num, 10)}`
    return `${state} ${distLabel}`
  }
  if (county) return `${county}, ${state}`
  return props.state_name ? String(props.state_name) : state
}

function PoliticianInfo({ props, geoLevel }: { props: TileProps; geoLevel: LossGeoLevel }) {
  const lines: ReactNode[] = []

  if (geoLevel === 'districts' && props.state_code && props.CD119FP) {
    const rep = getHouseRep(`${props.state_code}-${props.CD119FP}`)
    if (rep) {
      lines.push(
        <div key="rep" className="text-sm text-gray-500">
          Rep: {formatPoliticianName(rep.name, rep.party)}
        </div>,
      )
    }
  }

  if ((geoLevel === 'districts' || geoLevel === 'states') && props.state_code) {
    for (const s of getSenatorsList(String(props.state_code))) {
      lines.push(
        <div key={`sen-${s.name}`} className="text-sm text-gray-500">
          Sen: {formatPoliticianName(s.name, s.party)}
        </div>,
      )
    }
  }

  if (lines.length === 0) return null
  return <div className="mt-1">{lines}</div>
}

// ── Drawer body ─────────────────────────────────────────────────────

function DrawerBody({
  props,
  geoLevel,
  config,
}: {
  props: TileProps
  geoLevel: LossGeoLevel
  config: BudgetDrawerConfig
}) {
  const stats = config.stats(props)
  const sections = config.sections(props)
  const population = Number(props.pop_2024 ?? 0)

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between border-b px-5 py-4">
        <div>
          <Drawer.Title className="text-lg font-semibold text-gray-900">
            {locationLabel(props, geoLevel)}
          </Drawer.Title>
          {population > 0 && (
            <p className="mt-0.5 text-sm text-gray-500">
              Population: {population.toLocaleString()}
            </p>
          )}
          <PoliticianInfo props={props} geoLevel={geoLevel} />
        </div>
        <Drawer.Close className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 active:bg-gray-200">
          <X className="size-5" />
        </Drawer.Close>
      </div>

      {/* Summary cards */}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 gap-2 border-b px-4 py-3 sm:grid-cols-3 sm:gap-3 sm:px-5 sm:py-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-lg bg-gray-50 px-3 py-2">
              <div className="text-xs font-medium text-gray-500">{s.label}</div>
              <div className="mt-0.5 text-sm font-semibold text-gray-900">
                {formatStat(s.value, s.format)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Breakdown sections */}
      <div className="flex-1 overflow-y-auto px-5 py-3">
        {sections.map((section) => {
          const sorted = [...section.rows].sort((a, b) => b.value - a.value)
          const maxValue = sorted[0]?.value ?? 1

          return (
            <div key={section.title} className="mb-5 last:mb-0">
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                {section.title}
              </div>
              <div className="space-y-3">
                {sorted.map((row) => {
                  if (row.value <= 0) return null
                  const pct = maxValue > 0 ? (row.value / maxValue) * 100 : 0
                  const t = maxValue > 0 ? row.value / maxValue : 0
                  return (
                    <div key={row.key}>
                      <div className="flex items-baseline justify-between gap-2 text-sm">
                        <span className="font-medium text-gray-700">
                          {row.name} ({row.key})
                        </span>
                        <span className="shrink-0 text-xs tabular-nums text-gray-500">
                          {formatStat(row.value, row.format)}
                        </span>
                      </div>
                      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: interpolateOrRd(0.3 + t * 0.7),
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

// ── Drawer shell ────────────────────────────────────────────────────

export default function BudgetDrawer({
  props,
  geoLevel,
  config,
  onClose,
}: {
  props: TileProps | null
  geoLevel: LossGeoLevel
  config: BudgetDrawerConfig
  onClose: () => void
}) {
  return (
    <Drawer.Root
      open={props !== null}
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
              {props && (
                <DrawerBody props={props} geoLevel={geoLevel} config={config} />
              )}
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
