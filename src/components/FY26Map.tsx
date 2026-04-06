import { formatCurrency } from '@/lib/constants'
import { FY26_GEO_LEVELS, FY26_COLOR_PROPERTY } from '@/lib/fy26-map-config'
import {
  LUT_MAGMA_INV,
  buildTooltipHeader,
  type LossGeoLevel,
  type TileProps,
} from '@/lib/map-shared'
import type { BudgetDrawerConfig } from './BudgetDrawer'
import ChoroplethMap from './ChoroplethMap'

const FY26_INSTITUTES = [
  { key: 'NIA', name: 'National Institute on Aging' },
  { key: 'NCI', name: 'National Cancer Institute' },
  { key: 'NIAID', name: 'National Institute of Allergy and Infectious Diseases' },
  { key: 'NHLBI', name: 'National Heart, Lung, and Blood Institute' },
  { key: 'NIGMS', name: 'National Institute of General Medical Sciences' },
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
    />
  )
}
