import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency, formatNumber } from '@/lib/constants'
import type { GeoLevel } from '@/lib/constants'
import { typedKeys } from '@/lib/utils'

import statesData from '@/data/table_states.json'
import countiesData from '@/data/table_counties.json'
import districtsData from '@/data/table_districts.json'
import citiesData from '@/data/table_cities.json'

// --- Types ---

interface RegionRow {
  id: string
  name: string
  econ_impact: number
  raw_funding: number
  jobs: number
  pop_2024: number
}

type SortKey = 'econ_impact' | 'raw_funding' | 'jobs' | 'pop_2024'

const GEO_TABLE: Record<GeoLevel, { label: string; data: RegionRow[] }> = {
  states: { label: 'State', data: statesData },
  counties: { label: 'County', data: countiesData },
  districts: { label: 'District', data: districtsData },
  cities: { label: 'City', data: citiesData },
}

// --- Component ---

const popFormatter = new Intl.NumberFormat('en-US')

const SORT_COLUMNS: { key: SortKey; label: string; hideOnMobile?: boolean }[] = [
  { key: 'econ_impact', label: 'Economic Impact' },
  { key: 'raw_funding', label: 'Funding', hideOnMobile: true },
  { key: 'jobs', label: 'Jobs', hideOnMobile: true },
  { key: 'pop_2024', label: 'Population' },
]

function formatValue(value: number, key: SortKey): string {
  if (key === 'jobs') return formatNumber(value)
  if (key === 'pop_2024') return popFormatter.format(Math.round(value))
  return formatCurrency(value)
}

export default function FundingTable() {
  const [geoLevel, setGeoLevel] = useState<GeoLevel>('counties')
  const [sortKey, setSortKey] = useState<SortKey>('econ_impact')
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
          Funding by Region
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
            <thead className="sticky top-0 z-10 bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="w-10 px-2 py-3 font-semibold text-gray-600 md:w-12 md:px-4">
                  #
                </th>
                <th className="px-2 py-3 font-semibold text-gray-600 md:px-4">
                  {config.label.replace(/s$/, '')}
                </th>
                {SORT_COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className={`cursor-pointer select-none px-2 py-3 text-right font-semibold text-gray-600 hover:text-gray-900 md:px-4 ${col.hideOnMobile ? 'hidden md:table-cell' : ''}`}
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
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((row, i) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                >
                  <td className="px-2 py-2 tabular-nums text-gray-400 md:px-4 md:py-2.5">
                    {i + 1}
                  </td>
                  <td className="max-w-30 truncate px-2 py-2 font-medium text-gray-900 md:max-w-none md:px-4 md:py-2.5">
                    {row.name}
                  </td>
                  {SORT_COLUMNS.map((col) => (
                    <td
                      key={col.key}
                      className={`px-2 py-2 text-right tabular-nums text-gray-700 md:px-4 md:py-2.5 ${col.hideOnMobile ? 'hidden md:table-cell' : ''}`}
                    >
                      {formatValue(row[col.key], col.key)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
