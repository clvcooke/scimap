import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency, formatNumber } from '@/lib/constants'
import type { GeoLevel } from '@/lib/constants'
import { typedKeys } from '@/lib/utils'

import statesData from '@/data/table_terminations_states.json'
import countiesData from '@/data/table_terminations_counties.json'
import districtsData from '@/data/table_terminations_districts.json'

// --- Types ---

interface RegionRow {
  id: string
  name: string
  nih_econ_loss: number
  nih_funding_loss: number
  nih_job_loss: number
  nsf_econ_loss: number
  nsf_funding_loss: number
  nsf_job_loss: number
  total_econ_loss: number
  total_funding_loss: number
  total_job_loss: number
}

type SortKey = keyof Omit<RegionRow, 'id' | 'name'>

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
    bg: 'bg-red-50/50',
    headerBg: 'bg-red-50',
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
  { key: 'total_funding_loss', label: 'Funding Lost', group: 'total', hideOnMobile: true },
  { key: 'total_job_loss', label: 'Jobs Lost', group: 'total', hideOnMobile: true },
  { key: 'nih_econ_loss', label: 'Economic Loss', group: 'nih', hideOnMobile: true },
  { key: 'nih_funding_loss', label: 'Funding Lost', group: 'nih', hideOnMobile: true },
  { key: 'nih_job_loss', label: 'Jobs Lost', group: 'nih', hideOnMobile: true },
  { key: 'nsf_econ_loss', label: 'Economic Loss', group: 'nsf', hideOnMobile: true },
  { key: 'nsf_funding_loss', label: 'Funding Lost', group: 'nsf', hideOnMobile: true },
  { key: 'nsf_job_loss', label: 'Jobs Lost', group: 'nsf', hideOnMobile: true },
]

// Build column groups for the two-row header
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
  if (key.endsWith('_job_loss')) return formatNumber(value)
  return formatCurrency(value)
}

// --- Component ---

export default function TerminationsTable() {
  const [geoLevel, setGeoLevel] = useState<GeoLevel>('counties')
  const [sortKey, setSortKey] = useState<SortKey>('total_econ_loss')
  const [sortAsc, setSortAsc] = useState(false)

  const config = GEO_TABLE[geoLevel]

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

  return (
    <section className="w-full bg-white px-3 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          Grant Terminations by Region
        </h2>

        <Tabs
          value={geoLevel}
          onValueChange={(v: string) => setGeoLevel(v as GeoLevel)}
        >
          <TabsList className="mb-4">
            {typedKeys(GEO_TABLE).map((key) => (
              <TabsTrigger key={key} value={key}>
                {GEO_TABLE[key].label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

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
                    {row.name}
                  </td>
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
