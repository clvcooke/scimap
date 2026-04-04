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

const baseline = (statesData as { econ_impact: number; raw_funding: number; jobs: number }[]).reduce(
  (acc, s) => ({
    econImpact: acc.econImpact + s.econ_impact,
    funding: acc.funding + s.raw_funding,
    jobs: acc.jobs + s.jobs,
  }),
  { econImpact: 0, funding: 0, jobs: 0 },
)

export const BASELINE_SLOTS: InfoSlot[] = [
  { label: 'Total Economic Impact', value: formatCurrency(baseline.econImpact) },
  { label: 'NIH Funding', value: formatCurrency(baseline.funding) },
  { label: 'Jobs Supported', value: formatNumber(baseline.jobs) },
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
  { label: 'NIH Funding at Stake', value: formatCurrency(baseline.funding) },
]

// ── FY27 Budget (proposed NIH + NSF cuts) ────────────────────────────

export const FY27_SLOTS: InfoSlot[] = [
  { label: 'Agencies Affected', value: 'NIH + NSF' },
  { label: 'NIH Funding at Stake', value: formatCurrency(baseline.funding) },
  { label: 'Jobs Supported', value: formatNumber(baseline.jobs) },
]

// ── IDC (indirect cost cap policy) ────────────────────────────────────

export const IDC_SLOTS: InfoSlot[] = [
  { label: 'Proposed IDC Cap', value: '15%' },
  { label: 'Nationwide Economic Loss', value: '$11B' },
  { label: 'Jobs at Risk', value: '49K' },
]
