import { formatCurrency } from '@/lib/constants'
import { IDC_GEO_LEVELS, IDC_COLOR_PROPERTY } from '@/lib/idc-map-config'
import { IDC_SLOTS } from '@/lib/card-stats'
import {
  LUT_OR_RD,
  buildTooltipHeader,
  type LossGeoLevel,
  type TileProps,
} from '@/lib/map-shared'
import ChoroplethMap from './ChoroplethMap'

const renderTooltip = (p: TileProps, geoLevel: LossGeoLevel) => {
  const { locationLine, politicianHtml } = buildTooltipHeader(p, geoLevel)
  const econLoss = (p.IDC_econ_loss as number) ?? 0
  const jobLoss = (p.IDC_job_loss as number) ?? 0
  const idcLoss = (p.IDC_loss as number) ?? 0

  return (
    `<div class="font-semibold">${locationLine}</div>` +
    politicianHtml +
    `<div class="mt-1">Economic Loss: ${formatCurrency(econLoss)}/yr</div>` +
    (jobLoss > 10 ? `<div>Jobs at Risk: ${jobLoss.toLocaleString()}</div>` : '') +
    `<div class="mt-1 text-[11px] text-gray-300">IDC Funding Loss: ${formatCurrency(idcLoss)}/yr</div>`
  )
}

export default function IDCMap() {
  return (
    <ChoroplethMap
      geoLevels={IDC_GEO_LEVELS}
      defaultLevel="states"
      colorProperty={IDC_COLOR_PROPERTY}
      colorLUT={LUT_OR_RD}
      layerId="idc-mvt"
      renderTooltip={renderTooltip}
      exportTitle="IDC Rate Analysis"
      exportSubtitle="Indirect Cost Recovery Impact on Research Funding"
      exportFilename="scimap-idc-analysis.png"
      exportExtraSlots={IDC_SLOTS}
    />
  )
}
