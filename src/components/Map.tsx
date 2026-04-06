import { useState, useMemo, useCallback } from 'react'
import type { PickingInfo } from '@deck.gl/core'
import type { MjolnirGestureEvent } from 'mjolnir.js'
import { formatCurrency } from '@/lib/constants'
import type { GeoLevel } from '@/lib/constants'
import {
  GEO_LEVELS,
  createBaselineLayer,
  createColorScale,
} from '@/lib/map-config'
import type { TileProperties, SelectedFeature } from '@/lib/map-config'
import type { MapGeoConfig, TileProps } from '@/lib/map-shared'
import { useIsMobile } from '@/hooks/use-mobile'
import ChoroplethMap from './ChoroplethMap'
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
      if (name && state) return `${name}, ${state}`
      if (name) return name
      return `County ${tile.FIPS ?? ''}`
    }
    case 'districts': {
      const state = tile.state as unknown as string | undefined
      const geoid = String(tile.GEOID ?? '')
      const num = geoid.slice(-2)
      const distLabel = num === '00' ? 'At-Large' : `District ${parseInt(num, 10)}`
      return state ? `${state} ${distLabel}` : `District ${geoid}`
    }
    case 'cities': {
      const name = tile.CBSA_NAME as unknown as string | undefined
      return name ?? `City ${tile.CBSA_FIPS ?? ''}`
    }
    default:
      return String(tile.state ?? '')
  }
}

// --- Component ---

export default function SCIMap({ initialLat, initialLng, initialZoom, displayLocation = true }: {
  initialLat?: number | undefined
  initialLng?: number | undefined
  initialZoom?: number | undefined
  displayLocation?: boolean
}) {
  const [selectedFeature, setSelectedFeature] = useState<SelectedFeature | null>(null)
  const [previewFeature, setPreviewFeature] = useState<SelectedFeature | null>(null)
  const [currentGeoLevel, setCurrentGeoLevel] = useState<GeoLevel>('states')
  const isMobile = useIsMobile()

  const renderTooltip = useCallback(
    (p: TileProps, geoLevel: GeoLevel) => {
      const tile = p as TileProperties
      const impact = tile.NIH_tot_econ_impact ?? 0
      const pop = tile.pop_2024 ?? 0
      const displayName = getBaselineDisplayName(tile, geoLevel)
      return (
        `<div class="font-semibold">${displayName}</div>` +
        `<div>Economic Impact: ${formatCurrency(impact)}</div>` +
        `<div>Population: ${pop.toLocaleString()}</div>`
      )
    },
    [],
  )

  const layersFn = useCallback(
    (config: MapGeoConfig) => {
      const geoConfig = Object.values(GEO_LEVELS).find((g) => g.tileUrl === config.tileUrl) ?? GEO_LEVELS.states
      const colorScale = createColorScale(geoConfig, false)
      return [createBaselineLayer(geoConfig, false, colorScale)]
    },
    [],
  )

  const activeDomain = useMemo(() => {
    const cfg = BASELINE_GEO_LEVELS[currentGeoLevel]
    return cfg.domain
  }, [currentGeoLevel])

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
      defaultLevel="states"
      renderTooltip={renderTooltip}
      layers={layersFn}
      colorScaleDomain={activeDomain}
      onMapClick={handleClick}
      initialLat={initialLat}
      initialLng={initialLng}
      initialZoom={initialZoom}
      displayLocation={displayLocation}
      onGeoLevelChange={setCurrentGeoLevel}
    >
      {isMobile && previewFeature && (
        <MobileInfoCard
          feature={previewFeature}
          geoLabel={BASELINE_GEO_LEVELS[currentGeoLevel].label.replace(/s$/, '')}
          perCapita={false}
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
        onClose={() => setSelectedFeature(null)}
      />
    </ChoroplethMap>
  )
}
