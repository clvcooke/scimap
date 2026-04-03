import { formatCurrency } from '@/lib/constants'
import { FY26_GEO_LEVELS, FY26_COLOR_PROPERTY } from '@/lib/fy26-map-config'
import {
  LUT_MAGMA_INV,
  buildTooltipHeader,
  type LossGeoLevel,
  type TileProps,
} from '@/lib/map-shared'
import ChoroplethMap from './ChoroplethMap'

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
    `</div>`
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
      initialLat={initialLat}
      initialLng={initialLng}
      initialZoom={initialZoom}
    />
  )
}
