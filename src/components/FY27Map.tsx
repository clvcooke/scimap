import { formatCurrency } from '@/lib/constants'
import { FY27_GEO_LEVELS, FY27_COLOR_PROPERTY } from '@/lib/fy27-map-config'
import { FY27_SLOTS } from '@/lib/card-stats'
import {
  LUT_MAGMA_INV,
  buildTooltipHeader,
  type LossGeoLevel,
  type TileProps,
} from '@/lib/map-shared'
import ChoroplethMap from './ChoroplethMap'

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
    (jobLoss > 10 ? `<div>Jobs Lost: ${jobLoss.toLocaleString()}</div>` : '') +
    `<div class="mt-1 text-[11px] text-gray-300">` +
    `NIH: ${formatCurrency(nihEcon)} · NSF: ${formatCurrency(nsfEcon)}` +
    `</div>`
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
      initialLat={initialLat}
      initialLng={initialLng}
      initialZoom={initialZoom}
      exportTitle="FY27 Budget Impact"
      exportSubtitle="Projected NIH & NSF Funding Cuts by Region"
      exportFilename="scimap-fy27-budget.png"
      exportExtraSlots={FY27_SLOTS}
    />
  )
}
