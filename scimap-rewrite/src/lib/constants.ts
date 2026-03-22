export type GeoLevel = 'states' | 'counties' | 'districts' | 'cities'

export type Metric = 'econ_impact' | 'raw_funding' | 'jobs'

export const METRICS: { key: Metric; label: string }[] = [
  { key: 'econ_impact', label: 'Economic Impact' },
  { key: 'raw_funding', label: 'Funding' },
  { key: 'jobs', label: 'Jobs' },
]

export function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`
  return `$${value.toFixed(2)}`
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value.toFixed(0)
}

export function formatMetricValue(value: number, metric: Metric): string {
  return metric === 'jobs' ? formatNumber(value) : formatCurrency(value)
}
