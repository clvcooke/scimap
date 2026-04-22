import { formatCurrency, formatNumber } from '@/lib/constants'
import { IDC_GEO_LEVELS, IDC_COLOR_PROPERTY } from '@/lib/idc-map-config'
import {
  LUT_OR_RD,
  buildTooltipHeader,
  type LossGeoLevel,
  type TileProps,
} from '@/lib/map-shared'
import type { BudgetDrawerConfig } from './BudgetDrawer'
import ChoroplethMap, { type MapAboutContent } from './ChoroplethMap'

const drawerConfig: BudgetDrawerConfig = {
  stats: (p) => [
    { label: 'Economic Loss', value: Number(p.IDC_econ_loss ?? 0), format: 'currency' },
    { label: 'Funding Loss', value: Number(p.IDC_loss ?? 0), format: 'currency' },
    { label: 'Jobs at Risk', value: Number(p.IDC_job_loss ?? 0), format: 'number' },
  ],
  sections: (p) => {
    const idcEcon = Number(p.IDC_econ_loss ?? 0)
    const idcJobs = Number(p.IDC_job_loss ?? 0)

    const sections = []

    if (idcEcon > 0) {
      sections.push({
        title: 'Impact Breakdown',
        rows: [
          { key: 'Annual', name: 'Economic Loss', value: idcEcon, format: 'currency' as const },
        ],
      })
    }

    if (idcJobs > 0) {
      sections.push({
        title: 'Jobs at Risk',
        rows: [
          { key: 'Annual', name: 'Job Loss', value: idcJobs, format: 'number' as const },
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
    `<div>Jobs at Risk: ${formatNumber(jobLoss)}</div>` +
    `<div class="mt-1 text-[11px] text-gray-300">Funding Loss: ${formatCurrency(idcLoss)}/yr</div>` +
    `<div class="mt-1 text-[11px] text-gray-400 italic">Click for details</div>`
  )
}

export default function IDCMap({ aboutContent }: { aboutContent?: MapAboutContent }) {
  return (
    <ChoroplethMap
      geoLevels={IDC_GEO_LEVELS}
      defaultLevel="counties"
      colorProperty={IDC_COLOR_PROPERTY}
      colorLUT={LUT_OR_RD}
      colorScheme="orrd"
      layerId="idc-mvt"
      mapType="idc"
      renderTooltip={renderTooltip}
      drawerConfig={drawerConfig}
      aboutContent={aboutContent}
    />
  )
}
