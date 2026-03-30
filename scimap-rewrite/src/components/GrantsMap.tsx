import { useState, useMemo, useCallback } from 'react'
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
import ChoroplethMap from './ChoroplethMap'
import GrantsOverlay from './GrantsOverlay'

const renderTooltip = (p: TileProps, geoLevel: LossGeoLevel) => {
  const { locationLine, politicianHtml } = buildTooltipHeader(p, geoLevel)
  const econLoss = (p.combined_econ_loss as number) ?? 0
  const jobLoss = (p.combined_job_loss as number) ?? 0
  const currentLoss = (p.terminated_econ_loss as number) ?? 0
  const futureLoss = (p.IDC_econ_loss as number) ?? 0

  return (
    `<div class="font-semibold">${locationLine}</div>` +
    politicianHtml +
    `<div>Total Loss: ${formatCurrency(econLoss)}</div>` +
    (jobLoss > 10 ? `<div>Jobs Lost: ${jobLoss.toLocaleString()}</div>` : '') +
    `<div class="mt-1 text-gray-300 text-[11px]">Current: ${formatCurrency(currentLoss)} · Future: ${formatCurrency(futureLoss)}/yr</div>`
  )
}

export default function GrantsMap() {
  const [overlayGrants, setOverlayGrants] = useState<GrantTermination[]>([])
  const [showOverlay, setShowOverlay] = useState(false)

  const clusterLayer = useMemo(
    () =>
      new IconClusterLayer({
        data: GRANT_LOSSES,
        getPosition: (d: GrantTermination) => [d.lon, d.lat],
        getSize: 50,
        iconAtlas: '/location-icon-atlas-v7.png',
        iconMapping: '/location-icon-mapping.json',
        getColor: () => [0, 255, 0, 100],
        id: 'icon-cluster',
        sizeScale: 40,
        pickable: true,
      }),
    [],
  )

  const onClick = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: any) => {
      let grants: GrantTermination[] = event.objects
      if (!grants?.length && event.object?.terminated_num) {
        grants = [event.object]
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
      extraLayers={[clusterLayer]}
      onMapClick={onClick}
      controllerDisabled={showOverlay}
    >
      <GrantsOverlay
        grants={overlayGrants}
        open={showOverlay}
        onClose={() => setShowOverlay(false)}
      />
    </ChoroplethMap>
  )
}
