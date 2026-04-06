export type GeoLevel = 'states' | 'counties' | 'districts' | 'cities'

export type Metric = 'econ_impact' | 'raw_funding' | 'jobs'

export const METRICS: { key: Metric; label: string }[] = [
  { key: 'econ_impact', label: 'Economic Impact' },
  { key: 'raw_funding', label: 'Funding' },
  { key: 'jobs', label: 'Jobs' },
]

export const INSTITUTES = [
  { key: 'NCI', name: 'National Cancer Institute' },
  { key: 'NIAID', name: 'National Institute of Allergy and Infectious Diseases' },
  { key: 'NHLBI', name: 'National Heart, Lung, and Blood Institute' },
  { key: 'NIGMS', name: 'National Institute of General Medical Sciences' },
  { key: 'NIA', name: 'National Institute on Aging' },
  { key: 'NIMH', name: 'National Institute of Mental Health' },
  { key: 'NIDDK', name: 'National Institute of Diabetes and Digestive and Kidney Diseases' },
  { key: 'NINDS', name: 'National Institute of Neurological Disorders and Stroke' },
  { key: 'NICHD', name: 'Eunice Kennedy Shriver National Institute of Child Health and Human Development' },
  { key: 'NIDA', name: 'National Institute on Drug Abuse' },
  { key: 'NIEHS', name: 'National Institute of Environmental Health Sciences' },
  { key: 'NEI', name: 'National Eye Institute' },
  { key: 'NIAMS', name: 'National Institute of Arthritis and Musculoskeletal and Skin Diseases' },
  { key: 'NIBIB', name: 'National Institute of Biomedical Imaging and Bioengineering' },
  { key: 'NIAAA', name: 'National Institute on Alcohol Abuse and Alcoholism' },
  { key: 'NHGRI', name: 'National Human Genome Research Institute' },
  { key: 'NIDCR', name: 'National Institute of Dental and Craniofacial Research' },
  { key: 'NIDCD', name: 'National Institute on Deafness and Other Communication Disorders' },
  { key: 'NIMHD', name: 'National Institute on Minority Health and Health Disparities' },
  { key: 'NINR', name: 'National Institute of Nursing Research' },
  { key: 'NCATS', name: 'National Center for Advancing Translational Sciences' },
  { key: 'NCCIH', name: 'National Center for Complementary and Integrative Health' },
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
