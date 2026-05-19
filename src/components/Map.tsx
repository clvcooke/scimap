import { useState, useCallback } from 'react'
import type { PickingInfo } from '@deck.gl/core'
import type { MjolnirGestureEvent } from 'mjolnir.js'
import { formatCurrency, formatNumber, stateName } from '@/lib/constants'
import type { GeoLevel } from '@/lib/constants'
import {
  GEO_LEVELS,
  BASELINE_AGENCY_DOMAINS,
  createBaselineLayer,
  createColorScale,
  getBaselineValue,
  getNsfEconImpact,
  getNsfJobs,
} from '@/lib/map-config'
import type { TileProperties, SelectedFeature } from '@/lib/map-config'
import { DEFAULT_AGENCY_FILTER, type AgencyFilter, type MapGeoConfig, type TileProps } from '@/lib/map-shared'
import { useIsMobile } from '@/hooks/use-mobile'
import ChoroplethMap, { type MapAboutContent } from './ChoroplethMap'
import AgencyFilterControl from './AgencyFilterControl'
import DetailDrawer from './DetailDrawer'
import MobileInfoCard from './MobileInfoCard'

// --- Adapt baseline GEO_LEVELS to the MapGeoConfig shape expected by ChoroplethMap ---

const BASELINE_GEO_LEVELS = Object.fromEntries(
  Object.entries(GEO_LEVELS).map(([key, cfg]) => [
    key,
    { ...cfg, domain: cfg.totalDomain, altDomain: cfg.perCapitaDomain },
  ]),
) as unknown as Record<GeoLevel, MapGeoConfig>

// --- Display name helper ---

function getBaselineDisplayName(tile: TileProperties, geoLevel: GeoLevel): string {
  switch (geoLevel) {
    case 'counties': {
      const name = tile.name as unknown as string | undefined
      const state = tile.state as unknown as string | undefined
      if (name && name !== 'NA' && state) return `${name}, ${state}`
      if (name && name !== 'NA') return name
      if (state) return stateName(state)
      return `County ${tile.FIPS ?? ''}`
    }
    case 'districts': {
      const state = tile.state as unknown as string | undefined
      const geoid = String(tile.GEOID ?? '')
      const num = geoid.slice(-2)
      if (num === '98' && state && state !== 'DC') return stateName(state)
      const distLabel = num === '00' ? 'At-Large' : num === '98' ? 'No District' : `District ${parseInt(num, 10)}`
      return state ? `${state} ${distLabel}` : `District ${geoid}`
    }
    // case 'cities': {
    //   const name = tile.CBSA_NAME as unknown as string | undefined
    //   return name ?? `City ${tile.CBSA_FIPS ?? ''}`
    // }
    default:
      return stateName(String(tile.state ?? ''))
  }
}

// --- Component ---

export default function SCIMap({ initialLat, initialLng, initialZoom, displayLocation = true, aboutContent }: {
  initialLat?: number | undefined
  initialLng?: number | undefined
  initialZoom?: number | undefined
  displayLocation?: boolean
  aboutContent?: MapAboutContent
}) {
  const [selectedFeature, setSelectedFeature] = useState<SelectedFeature | null>(null)
  const [previewFeature, setPreviewFeature] = useState<SelectedFeature | null>(null)
  const [currentGeoLevel, setCurrentGeoLevel] = useState<GeoLevel>('counties')
  const [agencyFilter, setAgencyFilter] = useState<AgencyFilter>(DEFAULT_AGENCY_FILTER)
  const isMobile = useIsMobile()

  const renderTooltip = useCallback(
    (p: TileProps, geoLevel: GeoLevel) => {
      const tile = p as TileProperties
      const pop = tile.pop_2024 ?? 0
      const displayName = getBaselineDisplayName(tile, geoLevel)

      if (agencyFilter === 'nih') {
        const impact = tile.NIH_tot_econ_impact ?? 0
        const jobs = tile.NIH_tot_jobs ?? 0
        return (
          `<div class="font-semibold">${displayName}</div>` +
          `<div>NIH Economic Impact: ${formatCurrency(impact)}</div>` +
          `<div>Jobs Supported: ${formatNumber(jobs)}</div>` +
          (pop > 0 ? `<div>Population: ${formatNumber(pop)}</div>` : '') +
          `<div class="text-xs mt-1 opacity-75">Click for details</div>`
        )
      }

      if (agencyFilter === 'nsf') {
        const impact = getNsfEconImpact(tile)
        const jobs = getNsfJobs(tile)
        return (
          `<div class="font-semibold">${displayName}</div>` +
          `<div>NSF Economic Impact: ${formatCurrency(impact)}</div>` +
          (jobs > 0 ? `<div>Jobs Supported: ${formatNumber(jobs)}</div>` : '') +
          (pop > 0 ? `<div>Population: ${formatNumber(pop)}</div>` : '') +
          `<div class="text-xs mt-1 opacity-75">Click for details</div>`
        )
      }

      const impact = getBaselineValue(tile, 'both')
      const nihImpact = tile.NIH_tot_econ_impact ?? 0
      const nsfImpact = getNsfEconImpact(tile)
      const jobs = (tile.NIH_tot_jobs ?? 0) + getNsfJobs(tile)
      return (
        `<div class="font-semibold">${displayName}</div>` +
        `<div>Total Economic Impact: ${formatCurrency(impact)}</div>` +
        (jobs > 0 ? `<div>Jobs Supported: ${formatNumber(jobs)}</div>` : '') +
        (pop > 0 ? `<div>Population: ${formatNumber(pop)}</div>` : '') +
        `<div class="mt-1 text-[11px] text-gray-300">` +
        `NIH: ${formatCurrency(nihImpact)} · NSF: ${formatCurrency(nsfImpact)}` +
        `</div>` +
        `<div class="text-xs mt-1 opacity-75">Click for details</div>`
      )
    },
    [agencyFilter],
  )

  const activeDomain = BASELINE_AGENCY_DOMAINS[agencyFilter][currentGeoLevel]

  const layersFn = useCallback(
    (config: MapGeoConfig) => {
      const geoConfig = Object.values(GEO_LEVELS).find((g) => g.tileUrl === config.tileUrl) ?? GEO_LEVELS.states
      const colorScale = createColorScale(geoConfig, false, activeDomain)
      return [createBaselineLayer(geoConfig, false, colorScale, agencyFilter)]
    },
    [agencyFilter, activeDomain],
  )

  const handleClick = useCallback(
    (info: PickingInfo, _event: MjolnirGestureEvent) => {
      const tile = (info.object as { properties?: TileProperties } | undefined)?.properties
      if (!tile) {
        setSelectedFeature(null)
        setPreviewFeature(null)
        return
      }
      const id = getBaselineDisplayName(tile, currentGeoLevel)
      const feature = { id, properties: tile }

      if (isMobile) {
        requestAnimationFrame(() => setPreviewFeature(feature))
      } else {
        requestAnimationFrame(() => setSelectedFeature(feature))
      }
    },
    [currentGeoLevel, isMobile],
  )

  return (
    <ChoroplethMap<GeoLevel>
      geoLevels={BASELINE_GEO_LEVELS}
      defaultLevel="counties"
      renderTooltip={renderTooltip}
      layers={layersFn}
      colorScaleDomain={activeDomain}
      onMapClick={handleClick}
      initialLat={initialLat}
      initialLng={initialLng}
      initialZoom={initialZoom}
      displayLocation={displayLocation}
      onGeoLevelChange={setCurrentGeoLevel}
      aboutContent={aboutContent}
      extraControls={
        <AgencyFilterControl value={agencyFilter} onValueChange={setAgencyFilter} />
      }
    >
      {isMobile && previewFeature && (
        <MobileInfoCard
          feature={previewFeature}
          geoLabel={BASELINE_GEO_LEVELS[currentGeoLevel].label.replace(/s$/, '')}
          perCapita={false}
          agencyFilter={agencyFilter}
          onSeeMore={() => {
            setSelectedFeature(previewFeature)
            setPreviewFeature(null)
          }}
          onClose={() => setPreviewFeature(null)}
        />
      )}
      <DetailDrawer
        feature={selectedFeature}
        perCapita={false}
        agencyFilter={agencyFilter}
        onClose={() => setSelectedFeature(null)}
      />
    </ChoroplethMap>
  )
}
