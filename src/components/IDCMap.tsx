import { formatCurrency } from '@/lib/constants'
import { IDC_GEO_LEVELS, IDC_COLOR_PROPERTY } from '@/lib/idc-map-config'
import {
  LUT_OR_RD,
  buildTooltipHeader,
  type LossGeoLevel,
  type TileProps,
} from '@/lib/map-shared'
import type { BudgetDrawerConfig } from './BudgetDrawer'
import ChoroplethMap from './ChoroplethMap'

const drawerConfig: BudgetDrawerConfig = {
  stats: (p) => [
    { label: 'IDC Economic Loss', value: Number(p.IDC_econ_loss ?? 0), format: 'currency' },
    { label: 'IDC Funding Loss', value: Number(p.IDC_loss ?? 0), format: 'currency' },
    { label: 'Jobs at Risk', value: Number(p.IDC_job_loss ?? 0), format: 'number' },
  ],
  sections: (p) => {
    const idcEcon = Number(p.IDC_econ_loss ?? 0)
    const termEcon = Number(p.terminated_econ_loss ?? 0)

    const sections = []

    if (idcEcon > 0 || termEcon > 0) {
      sections.push({
        title: 'Impact Breakdown',
        rows: [
          { key: 'IDC', name: 'Indirect Cost Recovery Loss (recurring, annual)', value: idcEcon, format: 'currency' as const },
          { key: 'Terminated', name: 'Terminated Grant Economic Loss', value: termEcon, format: 'currency' as const },
        ],
      })
    }

    const idcJobs = Number(p.IDC_job_loss ?? 0)
    const termJobs = Number(p.terminated_job_loss ?? 0)
    if (idcJobs > 0 || termJobs > 0) {
      sections.push({
        title: 'Jobs at Risk',
        rows: [
          { key: 'IDC', name: 'Jobs at risk from IDC changes', value: idcJobs, format: 'number' as const },
          { key: 'Terminated', name: 'Jobs lost from terminated grants', value: termJobs, format: 'number' as const },
        ],
      })
    }

    return sections
  },
}

const renderTooltip = (p: TileProps, geoLevel: LossGeoLevel) => {
  const { locationLine, politicianHtml } = buildTooltipHeader(p, geoLevel)
  const econLoss = (p.IDC_econ_loss as number) ?? 0
  const jobLoss = (p.IDC_job_loss as number) ?? 0
  const idcLoss = (p.IDC_loss as number) ?? 0

  return (
    `<div class="font-semibold">${locationLine}</div>` +
    politicianHtml +
    `<div class="mt-1">Economic Loss: ${formatCurrency(econLoss)}/yr</div>` +
    (jobLoss > 0 ? `<div>Jobs at Risk: ${jobLoss < 10 ? '&lt;10' : jobLoss.toLocaleString()}</div>` : '') +
    `<div class="mt-1 text-[11px] text-gray-300">IDC Funding Loss: ${formatCurrency(idcLoss)}/yr</div>` +
    `<div class="mt-1 text-[11px] text-gray-400 italic">Click for details</div>`
  )
}

export default function IDCMap() {
  return (
    <ChoroplethMap
      geoLevels={IDC_GEO_LEVELS}
      defaultLevel="counties"
      colorProperty={IDC_COLOR_PROPERTY}
      colorLUT={LUT_OR_RD}
      colorScheme="orrd"
      layerId="idc-mvt"
      renderTooltip={renderTooltip}
      drawerConfig={drawerConfig}
    />
  )
}
