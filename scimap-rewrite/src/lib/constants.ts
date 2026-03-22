export type GeoLevel = 'states' | 'counties' | 'districts' | 'cities'

export type Metric = 'econ_impact' | 'raw_funding' | 'jobs'

export const METRICS: { key: Metric; label: string }[] = [
  { key: 'econ_impact', label: 'Economic Impact' },
  { key: 'raw_funding', label: 'Funding' },
  { key: 'jobs', label: 'Jobs' },
]

export const INSTITUTES = [
  { key: 'NCI', name: 'National Cancer Institute' },
  { key: 'NIAID', name: 'Allergy and Infectious Diseases' },
  { key: 'NHLBI', name: 'Heart, Lung, and Blood' },
  { key: 'NIGMS', name: 'General Medical Sciences' },
  { key: 'NIA', name: 'Aging' },
  { key: 'NIMH', name: 'Mental Health' },
  { key: 'NIDDK', name: 'Diabetes and Digestive and Kidney' },
  { key: 'NINDS', name: 'Neurological Disorders and Stroke' },
  { key: 'NICHD', name: 'Child Health and Human Development' },
  { key: 'NIDA', name: 'Drug Abuse' },
  { key: 'NIEHS', name: 'Environmental Health Sciences' },
  { key: 'NEI', name: 'Eye Institute' },
  { key: 'NIAMS', name: 'Arthritis and Musculoskeletal' },
  { key: 'NIBIB', name: 'Biomedical Imaging and Bioengineering' },
  { key: 'NIAAA', name: 'Alcohol Abuse and Alcoholism' },
  { key: 'NHGRI', name: 'Human Genome Research' },
  { key: 'NIDCR', name: 'Dental and Craniofacial Research' },
  { key: 'NIDCD', name: 'Deafness and Communication Disorders' },
  { key: 'NIMHD', name: 'Minority Health and Health Disparities' },
  { key: 'NINR', name: 'Nursing Research' },
  { key: 'NCATS', name: 'Advancing Translational Sciences' },
  { key: 'NCCIH', name: 'Complementary and Integrative Health' },
  { key: 'NLM', name: 'National Library of Medicine' },
  { key: 'FIC', name: 'Fogarty International Center' },
  { key: 'OD', name: 'Office of the Director' },
] as const

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
