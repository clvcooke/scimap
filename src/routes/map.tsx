import { createFileRoute } from '@tanstack/react-router'
import SCIMap from '../components/Map'
import FundingTable from '../components/FundingTable'
import { validateMapSearch, useScrollToMap } from '@/lib/map-search-params'
import { getPage } from '@/lib/content'
import { MapAboutSection } from '@/components/MapAboutSection'
import { MapHeader } from '@/components/MapHeader'
import MapAttribution from '@/components/MapAttribution'

export const Route = createFileRoute('/map')({
  component: MapRoute,
  validateSearch: validateMapSearch,
})

const PAGE = getPage('map-baseline')

function MapRoute() {
  const { lat, lng, zoom, showLocation } = Route.useSearch()
  const mapRef = useScrollToMap(lat, lng)

  return (
    <>
      <div className="flex h-[calc(100dvh-57px)] flex-col md:h-[calc(100dvh-65px)]">
        <MapHeader page={PAGE} />
        <div ref={mapRef} className="relative w-full flex-1 min-h-0 scroll-mt-16">
          <SCIMap initialLat={lat} initialLng={lng} initialZoom={zoom} displayLocation={showLocation !== false} />
        </div>
      </div>
      <MapAttribution />
      <FundingTable />
      <MapAboutSection page={PAGE} />
    </>
  )
}
