import { useState, useMemo, useCallback } from 'react'
import type { PickingInfo, Position } from '@deck.gl/core'
import { formatCurrency, formatNumber } from '@/lib/constants'
import {
  GRANTS_GEO_LEVELS,
  GRANTS_COLOR_PROPERTIES,
  GRANTS_JOB_PROPERTIES,
  GRANTS_CURRENT_ECON_PROPERTIES,
  GRANTS_CURRENT_JOB_PROPERTIES,
  GRANTS_AGENCY_DOMAINS,
} from '@/lib/grants-map-config'
import {
  LUT_OR_RD,
  buildTooltipHeader,
  DEFAULT_AGENCY_FILTER,
  type AgencyFilter,
  type LossGeoLevel,
  type TileProps,
} from '@/lib/map-shared'
import IconClusterLayer from '@/layers/icon-cluster-layer'
import { GRANT_LOSSES, expandGrants, type GrantTermination } from '@/data/grant-losses'
import ChoroplethMap, { type MapAboutContent } from './ChoroplethMap'
import GrantsOverlay from './GrantsOverlay'
import { Switch } from '@/components/ui/switch'
import AgencyFilterControl from './AgencyFilterControl'
import { Events, track } from '@/lib/analytics'

const AGENCY_PREFIX: Record<AgencyFilter, string> = {
  both: '',
  nih: 'NIH ',
  nsf: 'NSF ',
}

function buildRenderTooltip(agencyFilter: AgencyFilter) {
  const cumEconProp = GRANTS_COLOR_PROPERTIES[agencyFilter]
  const cumJobProp = GRANTS_JOB_PROPERTIES[agencyFilter]
  const curEconProp = GRANTS_CURRENT_ECON_PROPERTIES[agencyFilter]
  const curJobProp = GRANTS_CURRENT_JOB_PROPERTIES[agencyFilter]
  const prefix = AGENCY_PREFIX[agencyFilter]
  return (p: TileProps, geoLevel: LossGeoLevel) => {
    const { locationLine, politicianHtml } = buildTooltipHeader(p, geoLevel)
    const cumEcon = Number(p[cumEconProp] ?? 0)
    const curEcon = Number(p[curEconProp] ?? 0)
    const cumJobs = Number(p[cumJobProp] ?? 0)
    const curJobs = Number(p[curJobProp] ?? 0)

    return (
      `<div class="font-semibold">${locationLine}</div>` +
      politicianHtml +
      `<div>${prefix}Cumulative Economic Loss: ${formatCurrency(cumEcon)}</div>` +
      `<div>${prefix}Current Economic Loss: ${formatCurrency(curEcon)}</div>` +
      `<div>${prefix}Cumulative Jobs Lost: ${formatNumber(cumJobs)}</div>` +
      `<div>${prefix}Current Jobs Lost: ${formatNumber(curJobs)}</div>`
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
    const filtered = agencyFilter === 'both'
      ? GRANT_LOSSES
      : agencyFilter === 'nih'
        ? GRANT_LOSSES.filter((g) => g.nih_loss > 0)
        : GRANT_LOSSES.filter((g) => g.nsf_loss > 0)
    return expandGrants(filtered, agencyFilter)
  }, [agencyFilter])

  const clusterLayer = useMemo(
    () =>
      new IconClusterLayer<GrantTermination>({
        data: filteredGrants,
        getPosition: getGrantPosition,
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
