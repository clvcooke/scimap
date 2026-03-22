import { useState, useEffect, useMemo, useRef } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency, formatNumber } from '@/lib/constants'
import type { GeoLevel } from '@/lib/constants'

// --- CSV config per geo level ---

interface GeoTableConfig {
  label: string
  idColumn: string
  nameColumn: string | null
  stateColumn: string | null
  load: () => Promise<{ default: string }>
}

const GEO_TABLE: Record<GeoLevel, GeoTableConfig> = {
  states: {
    label: 'States',
    idColumn: 'state',
    nameColumn: null,
    stateColumn: null,
    load: () => import('../../data/baseline/baseline_state.csv?raw'),
  },
  counties: {
    label: 'Counties',
    idColumn: 'FIPS',
    nameColumn: 'name',
    stateColumn: 'state',
    load: () => import('../../data/baseline/baseline_county.csv?raw'),
  },
  districts: {
    label: 'Districts',
    idColumn: 'GEOID',
    nameColumn: null,
    stateColumn: 'state',
    load: () => import('../../data/baseline/baseline_district.csv?raw'),
  },
  cities: {
    label: 'Cities',
    idColumn: 'CBSA_FIPS',
    nameColumn: 'CBSA_NAME',
    stateColumn: null,
    load: () => import('../../data/baseline/baseline_city.csv?raw'),
  },
}

// --- CSV parser (handles quoted fields) ---

function parseCSV(text: string): Record<string, string>[] {
  const rows: Record<string, string>[] = []
  const lines = splitCSVLines(text)
  if (lines.length < 2) return rows

  const headers = splitCSVRow(lines[0])
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue
    const fields = splitCSVRow(lines[i])
    const row: Record<string, string> = {}
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = fields[j] ?? ''
    }
    rows.push(row)
  }
  return rows
}

function splitCSVLines(text: string): string[] {
  const lines: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (ch === '"') {
      inQuotes = !inQuotes
      current += ch
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (ch === '\r' && text[i + 1] === '\n') i++
      lines.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  if (current) lines.push(current)
  return lines
}

function splitCSVRow(line: string): string[] {
  const fields: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += ch
      }
    } else {
      if (ch === '"') {
        inQuotes = true
      } else if (ch === ',') {
        fields.push(field)
        field = ''
      } else {
        field += ch
      }
    }
  }
  fields.push(field)
  return fields
}

// --- Aggregation ---

interface RegionRow {
  id: string
  name: string
  econ_impact: number
  raw_funding: number
  jobs: number
  pop_2024: number
}

type SortKey = 'econ_impact' | 'raw_funding' | 'jobs' | 'pop_2024'

function aggregate(rows: Record<string, string>[], config: GeoTableConfig): RegionRow[] {
  const map = new Map<string, RegionRow>()

  for (const row of rows) {
    const id = row[config.idColumn] ?? ''
    if (!id) continue

    let entry = map.get(id)
    if (!entry) {
      let name = id
      if (config.nameColumn && row[config.nameColumn]) {
        name = row[config.nameColumn]
      } else if (config.stateColumn && row[config.stateColumn]) {
        // For districts: "AL-01" format
        name = `${row[config.stateColumn]}-${id.slice(-2)}`
      }

      entry = {
        id,
        name,
        econ_impact: 0,
        raw_funding: 0,
        jobs: 0,
        pop_2024: parseFloat(row.pop_2024) || 0,
      }
      map.set(id, entry)
    }

    entry.econ_impact += parseFloat(row.econ_impact) || 0
    entry.raw_funding += parseFloat(row.raw_funding) || 0
    entry.jobs += parseFloat(row.jobs) || 0
  }

  return Array.from(map.values())
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
  const [geoLevel, setGeoLevel] = useState<GeoLevel>('states')
  const [sortKey, setSortKey] = useState<SortKey>('econ_impact')
  const [sortAsc, setSortAsc] = useState(false)
  const [rows, setRows] = useState<RegionRow[] | null>(null)
  const [loading, setLoading] = useState(true)

  // Cache aggregated results so switching tabs is instant after first load.
  // Only the small aggregated arrays are kept (~51–3143 rows of numbers),
  // not the raw CSV strings, so memory stays low.
  const cache = useRef(new Map<GeoLevel, RegionRow[]>())

  const config = GEO_TABLE[geoLevel]

  // Load + parse + aggregate CSV (cached after first load per geo level)
  useEffect(() => {
    const cached = cache.current.get(geoLevel)
    if (cached) {
      setRows(cached)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setRows(null)

    void config.load().then((mod) => {
      if (cancelled) return
      const parsed = parseCSV(mod.default)
      const aggregated = aggregate(parsed, config)
      cache.current.set(geoLevel, aggregated)
      setRows(aggregated)
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [geoLevel, config])

  // Sort (re-runs when sort changes or data loads, not on re-parse)
  const sortedRows = useMemo(() => {
    if (!rows) return []
    const sorted = [...rows]
    sorted.sort((a, b) => {
      const diff = a[sortKey] - b[sortKey]
      return sortAsc ? diff : -diff
    })
    return sorted
  }, [rows, sortKey, sortAsc])

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
        <h2 className="mb-4 text-xl font-bold text-gray-900">Funding by Region</h2>

        <Tabs value={geoLevel} onValueChange={(v) => setGeoLevel(v as GeoLevel)}>
          <TabsList className="mb-4">
            {(Object.keys(GEO_TABLE) as GeoLevel[]).map((key) => (
              <TabsTrigger key={key} value={key}>
                {GEO_TABLE[key].label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="py-12 text-center text-sm text-gray-500">Loading data...</div>
        ) : (
          <div className="overflow-auto rounded-lg border border-gray-200 max-h-150">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 z-10 bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="w-10 px-2 py-3 font-semibold text-gray-600 md:w-12 md:px-4">#</th>
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
        )}
      </div>
    </section>
  )
}
