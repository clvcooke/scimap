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

export const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia',
  FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois',
  IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
  ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
  MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada',
  NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York',
  NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon',
  PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota',
  TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia',
  WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  AS: 'American Samoa', GU: 'Guam', MP: 'Northern Mariana Islands',
  PR: 'Puerto Rico', VI: 'U.S. Virgin Islands',
}

/** Return the full state name for an abbreviation, or the abbreviation itself as fallback. */
export function stateName(abbr: string): string {
  return STATE_NAMES[abbr] ?? abbr
}

export function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1) return `$${Math.round(value).toLocaleString()}`
  if (value > 0) return '<$1'
  if (value === 0) return '$0'
  return `$${Math.round(value).toLocaleString()}`
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  if (value > 0 && value < 10) return '<10'
  return value.toFixed(0)
}

export function formatMetricValue(value: number, metric: Metric): string {
  return metric === 'jobs' ? formatNumber(value) : formatCurrency(value)
}
