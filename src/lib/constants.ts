export type GeoLevel = 'states' | 'counties' | 'districts' // | 'cities'

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

const COMPACT_USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function formatCurrency(value: number): string {
  if (value === 0) return '$0'
  if (Math.abs(value) < 1_000) return '<$1K'
  return COMPACT_USD.format(value)
}

const COMPACT_NUM = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 0,
})

export function formatNumber(value: number): string {
  if (value >= 0 && value < 10) return '<10'
  return COMPACT_NUM.format(value)
}

export function formatMetricValue(value: number, metric: Metric): string {
  return metric === 'jobs' ? formatNumber(value) : formatCurrency(value)
}

export const FIPS_TO_STATE: Record<string, string> = {
  '01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT',
  '10':'DE','11':'DC','12':'FL','13':'GA','15':'HI','16':'ID','17':'IL',
  '18':'IN','19':'IA','20':'KS','21':'KY','22':'LA','23':'ME','24':'MD',
  '25':'MA','26':'MI','27':'MN','28':'MS','29':'MO','30':'MT','31':'NE',
  '32':'NV','33':'NH','34':'NJ','35':'NM','36':'NY','37':'NC','38':'ND',
  '39':'OH','40':'OK','41':'OR','42':'PA','44':'RI','45':'SC','46':'SD',
  '47':'TN','48':'TX','49':'UT','50':'VT','51':'VA','53':'WA','54':'WV',
  '55':'WI','56':'WY','60':'AS','66':'GU','69':'MP','72':'PR','78':'VI',
}

export function countyDisplayName(name: string, fipsId: string): string {
  const stateCode = FIPS_TO_STATE[fipsId.slice(0, 2).padStart(2, '0')]
  const displayName = name && name !== 'NA' ? name : `County ${fipsId}`
  return stateCode ? `${displayName}, ${stateCode}` : displayName
}
