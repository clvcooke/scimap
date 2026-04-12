import { useState, useMemo, useCallback } from 'react'
import type { PickingInfo, Position } from '@deck.gl/core'
import { formatCurrency } from '@/lib/constants'
import { GRANTS_GEO_LEVELS, GRANTS_COLOR_PROPERTY } from '@/lib/grants-map-config'
import {
  LUT_OR_RD,
  buildTooltipHeader,
  type LossGeoLevel,
  type TileProps,
} from '@/lib/map-shared'
import IconClusterLayer from '@/layers/icon-cluster-layer'
import { GRANT_LOSSES, type GrantTermination } from '@/data/grant-losses'
import ChoroplethMap, { type MapAboutContent } from './ChoroplethMap'
import GrantsOverlay from './GrantsOverlay'
import { Switch } from '@/components/ui/switch'

const renderTooltip = (p: TileProps, geoLevel: LossGeoLevel) => {
  const { locationLine, politicianHtml } = buildTooltipHeader(p, geoLevel)
  const econLoss = Number(p.terminated_econ_loss ?? 0)
  const jobLoss = Number(p.terminated_job_loss ?? 0)

  return (
    `<div class="font-semibold">${locationLine}</div>` +
    politicianHtml +
    `<div>Economic Loss: ${formatCurrency(econLoss)}</div>` +
    (jobLoss > 0 ? `<div>Jobs Lost: ${jobLoss < 10 ? '&lt;10' : jobLoss.toLocaleString()}</div>` : '')
  )
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

  const clusterLayer = useMemo(
    () =>
      new IconClusterLayer<GrantTermination>({
        data: GRANT_LOSSES,
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
    [showBubbles],
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
      colorProperty={GRANTS_COLOR_PROPERTY}
      colorLUT={LUT_OR_RD}
      layerId="grants-mvt"
      renderTooltip={renderTooltip}
      initialLat={initialLat}
      initialLng={initialLng}
      initialZoom={initialZoom}
      extraLayers={[clusterLayer]}
      onMapClick={showBubbles ? onClick : null}
      controllerDisabled={showOverlay}
      colorScheme="orrd"
      aboutContent={aboutContent}
      extraControls={
        <div className="flex items-center gap-2">
          <Switch id="show-grants" checked={showBubbles} onCheckedChange={setShowBubbles} />
          <label htmlFor="show-grants" className="text-xs font-medium text-gray-700 cursor-pointer">Show grants</label>
        </div>
      }
    >
      <GrantsOverlay
        grants={overlayGrants}
        open={showOverlay}
        onClose={() => setShowOverlay(false)}
      />
    </ChoroplethMap>
  )
}
