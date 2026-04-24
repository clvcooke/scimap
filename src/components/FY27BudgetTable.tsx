import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, Download } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatNumber, countyDisplayName } from '@/lib/constants'
import type { GeoLevel } from '@/lib/constants'
import { typedKeys } from '@/lib/utils'
import { toCsv, downloadCsv } from '@/lib/csv'

import statesData from '@/data/table_fy27_states.json'
import countiesData from '@/data/table_fy27_counties.json'
import districtsData from '@/data/table_fy27_districts.json'

// --- Types ---

interface RegionRow {
  id: string
  name: string
  nih_econ_loss: number
  nih_funding_cut: number
  nih_jobs_lost: number
  nsf_econ_loss: number
  nsf_funding_cut: number
  nsf_jobs_lost: number
  total_econ_loss: number
  total_funding_cut: number
  total_jobs_lost: number
  rep_name?: string
  rep_party?: string
}

type SortKey = keyof Pick<
  RegionRow,
  | 'nih_econ_loss'
  | 'nih_funding_cut'
  | 'nih_jobs_lost'
  | 'nsf_econ_loss'
  | 'nsf_funding_cut'
  | 'nsf_jobs_lost'
  | 'total_econ_loss'
  | 'total_funding_cut'
  | 'total_jobs_lost'
>

const GEO_TABLE: Record<GeoLevel, { label: string; data: RegionRow[] }> = {
  states: { label: 'State', data: statesData as RegionRow[] },
  counties: { label: 'County', data: countiesData as RegionRow[] },
  districts: { label: 'District', data: districtsData as RegionRow[] },
}

// --- Column config ---

type GroupId = 'total' | 'nih' | 'nsf'

interface ColumnDef {
  key: SortKey
  label: string
  group: GroupId
  hideOnMobile?: boolean
}

const GROUP_STYLES: Record<
  GroupId,
  { label: string; bg: string; headerBg: string; border: string }
> = {
  total: {
    label: 'Total',
    bg: 'bg-orange-50/50',
    headerBg: 'bg-orange-50',
    border: '',
  },
  nih: {
    label: 'NIH',
    bg: 'bg-emerald-50/40',
    headerBg: 'bg-emerald-50',
    border: '',
  },
  nsf: {
    label: 'NSF',
    bg: 'bg-amber-50/40',
    headerBg: 'bg-amber-50',
    border: '',
  },
}

const SORT_COLUMNS: ColumnDef[] = [
  { key: 'total_econ_loss', label: 'Economic Loss', group: 'total' },
  { key: 'total_funding_cut', label: 'Funding Cut', group: 'total', hideOnMobile: true },
  { key: 'total_jobs_lost', label: 'Jobs Lost', group: 'total', hideOnMobile: true },
  { key: 'nih_econ_loss', label: 'Economic Loss', group: 'nih', hideOnMobile: true },
  { key: 'nih_funding_cut', label: 'Funding Cut', group: 'nih', hideOnMobile: true },
  { key: 'nih_jobs_lost', label: 'Jobs Lost', group: 'nih', hideOnMobile: true },
  { key: 'nsf_econ_loss', label: 'Economic Loss', group: 'nsf', hideOnMobile: true },
  { key: 'nsf_funding_cut', label: 'Funding Cut', group: 'nsf', hideOnMobile: true },
  { key: 'nsf_jobs_lost', label: 'Jobs Lost', group: 'nsf', hideOnMobile: true },
]

const COLUMN_GROUPS = (() => {
  const groups: { id: GroupId; span: number; visibleSpan: number }[] = []
  for (const col of SORT_COLUMNS) {
    const last = groups[groups.length - 1]
    if (last?.id === col.group) {
      last.span++
      if (!col.hideOnMobile) last.visibleSpan++
    } else {
      groups.push({
        id: col.group,
        span: 1,
        visibleSpan: col.hideOnMobile ? 0 : 1,
      })
    }
  }
  return groups
})()

function firstInGroup(col: ColumnDef, idx: number): string {
  if (idx === 0) return GROUP_STYLES[col.group].border
  if (SORT_COLUMNS[idx - 1].group !== col.group)
    return GROUP_STYLES[col.group].border
  return ''
}

function formatValue(value: number, key: SortKey): string {
  if (key.endsWith('_jobs_lost')) return formatNumber(value)
  return formatCurrency(value)
}

function buildCsv(rows: RegionRow[], regionLabel: string, includeRep: boolean): string {
  const header = [
    'id',
    regionLabel,
    ...(includeRep ? ['Representative', 'Party'] : []),
    ...SORT_COLUMNS.map((c) => `${GROUP_STYLES[c.group].label} ${c.label}`),
  ]
  const dataRows = rows.map((row) => [
    row.id,
    row.name,
    ...(includeRep ? [row.rep_name ?? '', row.rep_party ?? ''] : []),
    ...SORT_COLUMNS.map((col) => row[col.key]),
  ])
  return toCsv([header, ...dataRows])
}

// --- Component ---

export default function FY27BudgetTable() {
  const [geoLevel, setGeoLevel] = useState<GeoLevel>('districts')
  const [sortKey, setSortKey] = useState<SortKey>('total_econ_loss')
  const [sortAsc, setSortAsc] = useState(false)

  const config = GEO_TABLE[geoLevel]
  const showRep = geoLevel === 'districts'

  const sortedRows = useMemo(() => {
    const sorted = [...config.data]
    sorted.sort((a, b) => {
      const diff = a[sortKey] - b[sortKey]
      return sortAsc ? diff : -diff
    })
    return sorted
  }, [config.data, sortKey, sortAsc])

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortAsc(!sortAsc)
    } else {
      setSortKey(key)
      setSortAsc(false)
    }
  }

  function handleExport() {
    const csv = buildCsv(sortedRows, config.label, showRep)
    downloadCsv(csv, `fy27_budget_${geoLevel}.csv`)
  }

  return (
    <section className="w-full bg-white px-3 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          FY27 Budget Cuts by Region
        </h2>

        <div className="mb-4 flex items-center justify-between gap-2">
          <Tabs
            value={geoLevel}
            onValueChange={(v: string) => setGeoLevel(v as GeoLevel)}
          >
            <TabsList>
              {typedKeys(GEO_TABLE).map((key) => (
                <TabsTrigger key={key} value={key}>
                  {GEO_TABLE[key].label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download data-icon="inline-start" />
            <span className="hidden sm:inline">Download CSV</span>
            <span className="sm:hidden">CSV</span>
          </Button>
        </div>

        <div className="overflow-auto rounded-lg border border-gray-200 max-h-150">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 z-10">
              {/* Row 1: group headers */}
              <tr className="bg-gray-50">
                <th
                  rowSpan={2}
                  className="w-10 bg-gray-50 px-2 py-2 md:w-12 md:px-4"
                />
                <th rowSpan={2} className="bg-gray-50 px-2 py-2 md:px-4" />
                {showRep && (
                  <th
                    rowSpan={2}
                    className="hidden bg-gray-50 px-2 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 md:table-cell md:px-4"
                  >
                    Representative
                  </th>
                )}
                {COLUMN_GROUPS.map((g) => {
                  const style = GROUP_STYLES[g.id]
                  return (
                    <th
                      key={g.id}
                      colSpan={g.span}
                      className={`px-2 py-2 text-center text-xs font-bold uppercase tracking-wider md:px-4 ${style.headerBg} ${style.border} ${g.visibleSpan === 0 ? 'hidden md:table-cell' : ''}`}
                    >
                      {style.label}
                    </th>
                  )
                })}
              </tr>
              {/* Row 2: sub-column headers */}
              <tr className="border-b border-gray-200">
                {SORT_COLUMNS.map((col, idx) => {
                  const style = GROUP_STYLES[col.group]
                  const border = firstInGroup(col, idx)
                  return (
                    <th
                      key={col.key}
                      className={`cursor-pointer select-none px-2 py-2 text-right text-xs font-semibold text-gray-600 hover:text-gray-900 md:px-4 ${style.headerBg} ${border} ${col.hideOnMobile ? 'hidden md:table-cell' : ''}`}
                      onClick={() => handleSort(col.key)}
                    >
                      <span className="inline-flex items-center gap-1">
                        {col.label}
                        {sortKey === col.key &&
                          (sortAsc ? (
                            <ChevronUp className="size-3.5" />
                          ) : (
                            <ChevronDown className="size-3.5" />
                          ))}
                      </span>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((row, i) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 transition-colors hover:bg-gray-100/50"
                >
                  <td className="px-2 py-2 tabular-nums text-gray-400 md:px-4 md:py-2.5">
                    {i + 1}
                  </td>
                  <td className="max-w-30 truncate px-2 py-2 font-medium text-gray-900 md:max-w-none md:px-4 md:py-2.5">
                    {geoLevel === 'counties' ? countyDisplayName(row.name, row.id) : row.name}
                  </td>
                  {showRep && (
                    <td className="hidden max-w-48 truncate px-2 py-2 text-gray-700 md:table-cell md:px-4 md:py-2.5">
                      {row.rep_name ? (
                        <span>
                          {row.rep_name}
                          {row.rep_party && (
                            <span className="ml-1 text-xs text-gray-500">
                              ({row.rep_party.charAt(0)})
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  )}
                  {SORT_COLUMNS.map((col, idx) => {
                    const style = GROUP_STYLES[col.group]
                    const border = firstInGroup(col, idx)
                    return (
                      <td
                        key={col.key}
                        className={`px-2 py-2 text-right tabular-nums text-gray-700 md:px-4 md:py-2.5 ${style.bg} ${border} ${col.hideOnMobile ? 'hidden md:table-cell' : ''}`}
                      >
                        {formatValue(row[col.key], col.key)}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
