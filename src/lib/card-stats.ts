/**
 * National-level headline figures used in export card info slots.
 *
 * Baseline stats are computed live from table_states.json.
 * Other figures come from published SCIMaP / homepage metrics.
 */

import statesData from '@/data/table_states.json'
import { formatCurrency, formatNumber } from './constants'
import type { InfoSlot } from './export-map'

// ── Baseline (computed from state-level JSON) ─────────────────────────

const baseline = (statesData as { total_econ_impact: number; nih_raw_funding: number; nih_jobs: number; total_raw_funding: number }[]).reduce(
  (acc, s) => ({
    econImpact: acc.econImpact + s.total_econ_impact,
    nihFunding: acc.nihFunding + s.nih_raw_funding,
    totalFunding: acc.totalFunding + s.total_raw_funding,
    jobs: acc.jobs + s.nih_jobs,
  }),
  { econImpact: 0, nihFunding: 0, totalFunding: 0, jobs: 0 },
)

export const BASELINE_SLOTS: InfoSlot[] = [
  { label: 'Total Economic Impact', value: formatCurrency(baseline.econImpact) },
  { label: 'Total Funding (NIH + NSF)', value: formatCurrency(baseline.totalFunding) },
  { label: 'NIH Jobs Supported', value: formatNumber(baseline.jobs) },
]

// ── Grants (homepage headline metrics) ────────────────────────────────

export const GRANTS_SLOTS: InfoSlot[] = [
  { label: 'Economic Loss', value: '$11B' },
  { label: 'Grants Cancelled', value: '2,500+' },
  { label: 'Jobs at Risk', value: '49K' },
]

// ── FY26 Budget (published proposal figures) ──────────────────────────

export const FY26_SLOTS: InfoSlot[] = [
  { label: 'Proposed NIH Cut', value: '22%' },
  { label: 'HHS Budget Cuts', value: '$31B' },
  { label: 'NIH Funding at Stake', value: formatCurrency(baseline.nihFunding) },
]

// ── IDC (indirect cost cap policy) ────────────────────────────────────

export const IDC_SLOTS: InfoSlot[] = [
  { label: 'Proposed IDC Cap', value: '15%' },
  { label: 'Nationwide Economic Loss', value: '$11B' },
  { label: 'Jobs at Risk', value: '49K' },
]
