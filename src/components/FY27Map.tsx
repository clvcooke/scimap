import { useState, useMemo } from 'react'
import { formatCurrency } from '@/lib/constants'
import { FY27_GEO_LEVELS, FY27_COLOR_PROPERTIES, FY27_AGENCY_DOMAINS } from '@/lib/fy27-map-config'
import {
  LUT_MAGMA_INV,
  NSF_DIRECTORATES,
  buildTooltipHeader,
  type AgencyFilter,
  type LossGeoLevel,
  type TileProps,
} from '@/lib/map-shared'
import type { BudgetDrawerConfig } from './BudgetDrawer'
import ChoroplethMap, { type MapAboutContent } from './ChoroplethMap'
import AgencyFilterControl from './AgencyFilterControl'

function buildDrawerConfig(agencyFilter: AgencyFilter): BudgetDrawerConfig {
  return {
    stats: (p) => {
      const stats = []
      if (agencyFilter === 'both') {
        stats.push({ label: 'Total Economic Loss', value: Number(p.econ_budg_total_cuts ?? 0), format: 'currency' as const })
        stats.push({ label: 'NIH Cuts', value: Number(p.econ_budg_NIH_cuts ?? 0), format: 'currency' as const })
        stats.push({ label: 'NSF Cuts', value: Number(p.econ_budg_NSF_cuts ?? 0), format: 'currency' as const })
        stats.push({ label: 'Jobs Lost', value: Number(p.jobs_budg_total_cuts ?? 0), format: 'number' as const })
      } else if (agencyFilter === 'nih') {
        stats.push({ label: 'NIH Economic Loss', value: Number(p.econ_budg_NIH_cuts ?? 0), format: 'currency' as const })
        stats.push({ label: 'Jobs Lost', value: Number(p.jobs_budg_NIH_cuts ?? 0), format: 'number' as const })
      } else {
        stats.push({ label: 'NSF Economic Loss', value: Number(p.econ_budg_NSF_cuts ?? 0), format: 'currency' as const })
        stats.push({ label: 'Jobs Lost', value: Number(p.jobs_budg_NSF_cuts ?? 0), format: 'number' as const })
      }
      return stats
    },
    sections: (p) => {
      const sections = []

      if (agencyFilter === 'both') {
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
      }

      if (agencyFilter !== 'nih') {
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
      }

      return sections
    },
  }
}

function buildRenderTooltip(agencyFilter: AgencyFilter) {
  return (p: TileProps, geoLevel: LossGeoLevel) => {
    const { locationLine, politicianHtml } = buildTooltipHeader(p, geoLevel)

    if (agencyFilter === 'nih') {
      const nihEcon = Number(p.econ_budg_NIH_cuts ?? 0)
      const jobLoss = Number(p.jobs_budg_NIH_cuts ?? 0)
      return (
        `<div class="font-semibold">${locationLine}</div>` +
        politicianHtml +
        `<div class="mt-1">NIH Economic Loss: ${formatCurrency(nihEcon)}</div>` +
        (jobLoss > 0 ? `<div>Jobs Lost: ${jobLoss < 10 ? '&lt;10' : jobLoss.toLocaleString()}</div>` : '') +
        `<div class="mt-1 text-[11px] text-gray-400 italic">Click for details</div>`
      )
    }

    if (agencyFilter === 'nsf') {
      const nsfEcon = Number(p.econ_budg_NSF_cuts ?? 0)
      const jobLoss = Number(p.jobs_budg_NSF_cuts ?? 0)
      return (
        `<div class="font-semibold">${locationLine}</div>` +
        politicianHtml +
        `<div class="mt-1">NSF Economic Loss: ${formatCurrency(nsfEcon)}</div>` +
        (jobLoss > 0 ? `<div>Jobs Lost: ${jobLoss < 10 ? '&lt;10' : jobLoss.toLocaleString()}</div>` : '') +
        `<div class="mt-1 text-[11px] text-gray-400 italic">Click for details</div>`
      )
    }

    const totalEcon = Number(p.econ_budg_total_cuts ?? 0)
    const nihEcon = Number(p.econ_budg_NIH_cuts ?? 0)
    const nsfEcon = Number(p.econ_budg_NSF_cuts ?? 0)
    const jobLoss = Number(p.jobs_budg_total_cuts ?? 0)
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
}

export default function FY27Map({ initialLat, initialLng, initialZoom, aboutContent }: {
  initialLat?: number | undefined
  initialLng?: number | undefined
  initialZoom?: number | undefined
  aboutContent?: MapAboutContent
}) {
  const [agencyFilter, setAgencyFilter] = useState<AgencyFilter>('nih')
  const [geoLevel, setGeoLevel] = useState<LossGeoLevel>('districts')

  const colorProperty = FY27_COLOR_PROPERTIES[agencyFilter]
  const colorScaleDomain = FY27_AGENCY_DOMAINS[agencyFilter][geoLevel]
  const drawerConfig = useMemo(() => buildDrawerConfig(agencyFilter), [agencyFilter])
  const renderTooltip = useMemo(() => buildRenderTooltip(agencyFilter), [agencyFilter])

  return (
    <ChoroplethMap
      geoLevels={FY27_GEO_LEVELS}
      defaultLevel="districts"
      colorProperty={colorProperty}
      colorScaleDomain={colorScaleDomain}
      colorLUT={LUT_MAGMA_INV}
      layerId="fy27-mvt"
      useMagma
      renderTooltip={renderTooltip}
      drawerConfig={drawerConfig}
      fiscalYear="fy27"
      initialLat={initialLat}
      initialLng={initialLng}
      initialZoom={initialZoom}
      aboutContent={aboutContent}
      onGeoLevelChange={setGeoLevel as (level: string) => void}
      extraControls={
        <AgencyFilterControl value={agencyFilter} onValueChange={setAgencyFilter} />
      }
    />
  )
}
