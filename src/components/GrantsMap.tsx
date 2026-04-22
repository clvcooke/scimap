import { useState, useMemo, useCallback } from 'react'
import type { PickingInfo, Position } from '@deck.gl/core'
import { formatCurrency, formatNumber } from '@/lib/constants'
import { GRANTS_GEO_LEVELS, GRANTS_COLOR_PROPERTIES, GRANTS_JOB_PROPERTIES, GRANTS_AGENCY_DOMAINS } from '@/lib/grants-map-config'
import {
  LUT_OR_RD,
  buildTooltipHeader,
  DEFAULT_AGENCY_FILTER,
  type AgencyFilter,
  type LossGeoLevel,
  type TileProps,
} from '@/lib/map-shared'
import IconClusterLayer from '@/layers/icon-cluster-layer'
import { GRANT_LOSSES, type GrantTermination } from '@/data/grant-losses'
import ChoroplethMap, { type MapAboutContent } from './ChoroplethMap'
import GrantsOverlay from './GrantsOverlay'
import { Switch } from '@/components/ui/switch'
import AgencyFilterControl from './AgencyFilterControl'
import { Events, track } from '@/lib/analytics'

const AGENCY_LABELS: Record<AgencyFilter, string> = {
  both: 'Economic Loss',
  nih: 'NIH Economic Loss',
  nsf: 'NSF Economic Loss',
}

function buildRenderTooltip(agencyFilter: AgencyFilter) {
  const econProp = GRANTS_COLOR_PROPERTIES[agencyFilter]
  const jobProp = GRANTS_JOB_PROPERTIES[agencyFilter]
  return (p: TileProps, geoLevel: LossGeoLevel) => {
    const { locationLine, politicianHtml } = buildTooltipHeader(p, geoLevel)
    const econLoss = Number(p[econProp] ?? 0)
    const jobLoss = Number(p[jobProp] ?? 0)

    return (
      `<div class="font-semibold">${locationLine}</div>` +
      politicianHtml +
      `<div>${AGENCY_LABELS[agencyFilter]}: ${formatCurrency(econLoss)}</div>` +
      `<div>Jobs Lost: ${formatNumber(jobLoss)}</div>`
    )
  }
}

const getGrantPosition = (d: GrantTermination): Position => [d.lon, d.lat, 0]

export default function GrantsMap({ initialLat, initialLng, initialZoom, aboutContent }: {
  initialLat?: number | undefined
  initialLng?: number | undefined
  initialZoom?: number | undefined
  aboutContent?: MapAboutContent
}) {
  const [overlayGrants, setOverlayGrants] = useState<GrantTermination[]>([])
  const [showOverlay, setShowOverlay] = useState(false)
  const [showBubbles, setShowBubbles] = useState(true)
  const [agencyFilter, setAgencyFilter] = useState<AgencyFilter>(DEFAULT_AGENCY_FILTER)
  const [geoLevel, setGeoLevel] = useState<LossGeoLevel>('counties')

  const colorProperty = GRANTS_COLOR_PROPERTIES[agencyFilter]
  const colorScaleDomain = GRANTS_AGENCY_DOMAINS[agencyFilter][geoLevel]
  const renderTooltip = useMemo(() => buildRenderTooltip(agencyFilter), [agencyFilter])

  const filteredGrants = useMemo(() => {
    if (agencyFilter === 'both') return GRANT_LOSSES
    return GRANT_LOSSES.filter((g) => g.agency === agencyFilter || g.agency === 'both')
  }, [agencyFilter])

  const clusterLayer = useMemo(
    () =>
      new IconClusterLayer<GrantTermination>({
        data: filteredGrants,
        getPosition: getGrantPosition,
        getSize: 50,
        iconAtlas: '/location-icon-atlas-v7.png',
        iconMapping: '/location-icon-mapping.json',
        getColor: () => [0, 255, 0, 100],
        id: 'icon-cluster',
        sizeScale: 40,
        pickable: true,
        visible: showBubbles,
      }),
    [showBubbles, filteredGrants],
  )

  const onClick = useCallback(
    (info: PickingInfo<GrantTermination, { objects?: GrantTermination[] }>) => {
      let grants = info.objects
      if (!grants?.length && info.object?.terminated_num) {
        grants = [info.object]
      }
      if (grants?.length) {
        setOverlayGrants(grants)
        setShowOverlay(true)
      }
    },
    [],
  )

  return (
    <ChoroplethMap
      geoLevels={GRANTS_GEO_LEVELS}
      defaultLevel="counties"
      colorProperty={colorProperty}
      colorScaleDomain={colorScaleDomain}
      colorLUT={LUT_OR_RD}
      layerId="grants-mvt"
      mapType="grants"
      renderTooltip={renderTooltip}
      initialLat={initialLat}
      initialLng={initialLng}
      initialZoom={initialZoom}
      extraLayers={[clusterLayer]}
      onMapClick={showBubbles ? onClick : null}
      controllerDisabled={showOverlay}
      colorScheme="orrd"
      aboutContent={aboutContent}
      onGeoLevelChange={setGeoLevel as (level: string) => void}
      extraControls={
        <div className="flex flex-col gap-2">
          <AgencyFilterControl
            value={agencyFilter}
            onValueChange={(v) => {
              track(Events.MAP_AGENCY_FILTER_CHANGED, { map_type: 'grants', agency: v })
              setAgencyFilter(v)
            }}
          />
          <div className="flex items-center gap-2">
            <Switch id="show-grants" checked={showBubbles} onCheckedChange={setShowBubbles} />
            <label htmlFor="show-grants" className="text-xs font-medium text-gray-700 cursor-pointer">Show grants</label>
          </div>
        </div>
      }
    >
      <GrantsOverlay
        grants={overlayGrants}
        open={showOverlay}
        onClose={() => setShowOverlay(false)}
        agencyFilter={agencyFilter}
      />
    </ChoroplethMap>
  )
}
