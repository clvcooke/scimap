import { formatCurrency } from '@/lib/constants'
import { FY27_GEO_LEVELS, FY27_COLOR_PROPERTY } from '@/lib/fy27-map-config'
import {
  LUT_MAGMA_INV,
  buildTooltipHeader,
  type LossGeoLevel,
  type TileProps,
} from '@/lib/map-shared'
import type { BudgetDrawerConfig } from './BudgetDrawer'
import ChoroplethMap from './ChoroplethMap'

const NSF_DIRECTORATES = [
  { key: 'BIO', name: 'Biological Sciences' },
  { key: 'CSE', name: 'Computer & Information Science' },
  { key: 'EDU', name: 'STEM Education' },
  { key: 'ENG', name: 'Engineering' },
  { key: 'GEO', name: 'Geosciences' },
  { key: 'MPS', name: 'Math & Physical Sciences' },
  { key: 'OIA', name: 'Integrative Activities' },
  { key: 'OISE', name: 'International Science & Engineering' },
  { key: 'SBE', name: 'Social, Behavioral & Economic Sciences' },
  { key: 'TIP', name: 'Technology, Innovation & Partnerships' },
] as const

const drawerConfig: BudgetDrawerConfig = {
  stats: (p) => [
    { label: 'Total Economic Loss', value: Number(p.econ_budg_total_cuts ?? 0), format: 'currency' },
    { label: 'NIH Cuts', value: Number(p.econ_budg_NIH_cuts ?? 0), format: 'currency' },
    { label: 'NSF Cuts', value: Number(p.econ_budg_NSF_cuts ?? 0), format: 'currency' },
    { label: 'Jobs Lost', value: Number(p.jobs_budg_total_cuts ?? 0), format: 'number' },
  ],
  sections: (p) => {
    const sections = []

    // NIH vs NSF top-level comparison
    const nihVal = Number(p.econ_budg_NIH_cuts ?? 0)
    const nsfVal = Number(p.econ_budg_NSF_cuts ?? 0)
    if (nihVal > 0 || nsfVal > 0) {
      sections.push({
        title: 'Agency Breakdown',
        rows: [
          { key: 'NIH', name: 'National Institutes of Health', value: nihVal, format: 'currency' as const },
          { key: 'NSF', name: 'National Science Foundation', value: nsfVal, format: 'currency' as const },
        ],
      })
    }

    // NSF directorate breakdown
    const nsfRows = NSF_DIRECTORATES
      .map((d) => ({
        key: d.key,
        name: d.name,
        value: Number(p[`econ_budg_${d.key}_cuts`] ?? 0),
        format: 'currency' as const,
      }))
      .filter((r) => r.value > 0)

    if (nsfRows.length > 0) {
      sections.push({ title: 'NSF Directorate Breakdown', rows: nsfRows })
    }

    return sections
  },
}

const renderTooltip = (p: TileProps, geoLevel: LossGeoLevel) => {
  const { locationLine, politicianHtml } = buildTooltipHeader(p, geoLevel)
  const totalEcon = (p.econ_budg_total_cuts as number) ?? 0
  const nihEcon = (p.econ_budg_NIH_cuts as number) ?? 0
  const nsfEcon = (p.econ_budg_NSF_cuts as number) ?? 0
  const jobLoss = (p.jobs_budg_NIH_cuts as number) ?? 0

  return (
    `<div class="font-semibold">${locationLine}</div>` +
    politicianHtml +
    `<div class="mt-1">Total Economic Loss: ${formatCurrency(totalEcon)}</div>` +
    (jobLoss > 0 ? `<div>Jobs Lost: ${jobLoss < 10 ? '&lt;10' : jobLoss.toLocaleString()}</div>` : '') +
    `<div class="mt-1 text-[11px] text-gray-300">` +
    `NIH: ${formatCurrency(nihEcon)} · NSF: ${formatCurrency(nsfEcon)}` +
    `</div>` +
    `<div class="mt-1 text-[11px] text-gray-400 italic">Click for details</div>`
  )
}

export default function FY27Map({ initialLat, initialLng, initialZoom }: {
  initialLat?: number | undefined
  initialLng?: number | undefined
  initialZoom?: number | undefined
}) {
  return (
    <ChoroplethMap
      geoLevels={FY27_GEO_LEVELS}
      defaultLevel="districts"
      colorProperty={FY27_COLOR_PROPERTY}
      colorLUT={LUT_MAGMA_INV}
      layerId="fy27-mvt"
      useMagma
      renderTooltip={renderTooltip}
      drawerConfig={drawerConfig}
      fiscalYear="fy27"
      initialLat={initialLat}
      initialLng={initialLng}
      initialZoom={initialZoom}
    />
  )
}
