import { formatCurrency } from '@/lib/constants'
import { FY26_GEO_LEVELS, FY26_COLOR_PROPERTY } from '@/lib/fy26-map-config'
import { FY26_SLOTS } from '@/lib/card-stats'
import {
  LUT_MAGMA_INV,
  buildTooltipHeader,
  type LossGeoLevel,
  type TileProps,
} from '@/lib/map-shared'
import type { BudgetDrawerConfig } from './BudgetDrawer'
import ChoroplethMap from './ChoroplethMap'

const FY26_INSTITUTES = [
  { key: 'NIA', name: 'Aging' },
  { key: 'NCI', name: 'Cancer' },
  { key: 'NIAID', name: 'Allergy & Infectious Disease' },
  { key: 'NHLBI', name: 'Heart, Lung, and Blood' },
  { key: 'NIGMS', name: 'General Medical Sciences' },
  { key: 'NIMH', name: 'Mental Health' },
  { key: 'NIDDK', name: 'Diabetes, Digestive & Kidney' },
  { key: 'NINDS', name: 'Neurological Disorders & Stroke' },
  { key: 'NICHD', name: 'Child Health & Development' },
  { key: 'NIDA', name: 'Drug Abuse' },
  { key: 'NIEHS', name: 'Environmental Health Sciences' },
  { key: 'NEI', name: 'Eye Institute' },
  { key: 'NIAMS', name: 'Arthritis & Musculoskeletal' },
  { key: 'NIBIB', name: 'Biomedical Imaging' },
  { key: 'NIAAA', name: 'Alcohol Abuse & Alcoholism' },
  { key: 'NHGRI', name: 'Human Genome Research' },
  { key: 'NIDCR', name: 'Dental & Craniofacial Research' },
  { key: 'NIDCD', name: 'Deafness & Communication' },
  { key: 'NIMHD', name: 'Minority Health & Disparities' },
  { key: 'NINR', name: 'Nursing Research' },
  { key: 'NCATS', name: 'Translational Sciences' },
  { key: 'NCCIH', name: 'Complementary & Integrative Health' },
  { key: 'NLM', name: 'Library of Medicine' },
  { key: 'FIC', name: 'Fogarty International Center' },
  { key: 'OD', name: 'Office of the Director' },
] as const

const drawerConfig: BudgetDrawerConfig = {
  stats: (p) => [
    { label: 'Economic Loss', value: Number(p.budg_NIH_cuts_econ_loss ?? 0), format: 'currency' },
    { label: 'Jobs Lost', value: Number(p.budg_NIH_cuts_job_loss ?? 0), format: 'number' },
  ],
  sections: (p) => [
    {
      title: 'NIH Institute Breakdown',
      rows: FY26_INSTITUTES
        .map((inst) => ({
          key: inst.key,
          name: inst.name,
          value: Number(p[`budg_${inst.key}_cuts_econ_loss`] ?? 0),
          format: 'currency' as const,
        }))
        .filter((r) => r.value > 0),
    },
  ],
}

const renderTooltip = (p: TileProps, geoLevel: LossGeoLevel) => {
  const { locationLine, politicianHtml } = buildTooltipHeader(p, geoLevel)
  const econLoss = (p.budg_NIH_cuts_econ_loss as number) ?? 0
  const jobLoss = (p.budg_NIH_cuts_job_loss as number) ?? 0
  const agingLoss = (p.budg_NIA_cuts_econ_loss as number) ?? 0
  const cancerLoss = (p.budg_NCI_cuts_econ_loss as number) ?? 0
  const infectLoss = (p.budg_NIAID_cuts_econ_loss as number) ?? 0

  return (
    `<div class="font-semibold">${locationLine}</div>` +
    politicianHtml +
    `<div class="mt-1">Total Economic Loss: ${formatCurrency(econLoss)}</div>` +
    (jobLoss > 10 ? `<div>Jobs Lost: ${jobLoss.toLocaleString()}</div>` : '') +
    `<div class="mt-1 text-[11px] text-gray-300">` +
    `Aging: ${formatCurrency(agingLoss)} · Cancer: ${formatCurrency(cancerLoss)} · Infectious Disease: ${formatCurrency(infectLoss)}` +
    `</div>` +
    `<div class="mt-1 text-[11px] text-gray-400 italic">Click for details</div>`
  )
}

export default function FY26Map({ initialLat, initialLng, initialZoom }: {
  initialLat?: number | undefined
  initialLng?: number | undefined
  initialZoom?: number | undefined
}) {
  return (
    <ChoroplethMap
      geoLevels={FY26_GEO_LEVELS}
      defaultLevel="districts"
      colorProperty={FY26_COLOR_PROPERTY}
      colorLUT={LUT_MAGMA_INV}
      layerId="fy26-mvt"
      useMagma
      renderTooltip={renderTooltip}
      drawerConfig={drawerConfig}
      initialLat={initialLat}
      initialLng={initialLng}
      initialZoom={initialZoom}
      exportTitle="FY26 Budget Impact"
      exportSubtitle="Projected NIH Funding Cuts by Region"
      exportFilename="scimap-fy26-budget.png"
      exportExtraSlots={FY26_SLOTS}
    />
  )
}
