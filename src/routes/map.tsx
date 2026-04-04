import { createFileRoute } from '@tanstack/react-router'
import SCIMap from '../components/Map'
import FundingTable from '../components/FundingTable'
import { validateMapSearch, useScrollToMap } from '@/lib/map-search-params'
import { getPage } from '@/lib/content'
import { MapAboutSection } from '@/components/MapAboutSection'

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
      <div ref={mapRef} className="relative w-full min-h-[calc(100vh-140px)] scroll-mt-16">
        <SCIMap initialLat={lat} initialLng={lng} initialZoom={zoom} displayLocation={showLocation !== false} />
      </div>
      <FundingTable />
      <MapAboutSection page={PAGE} />
    </>
  )
}
