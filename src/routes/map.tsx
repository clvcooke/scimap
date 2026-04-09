import { createFileRoute } from '@tanstack/react-router'
import SCIMap from '../components/Map'
import FundingTable from '../components/FundingTable'
import { validateMapSearch, useScrollToTop } from '@/lib/map-search-params'
import { getPage } from '@/lib/content'
import { MapAboutSection } from '@/components/MapAboutSection'
import { MapHeader } from '@/components/MapHeader'
import MapAttribution from '@/components/MapAttribution'
import MapFocusOverlay from '@/components/MapFocusOverlay'
import MapZipSearch from '@/components/MapZipSearch'

export const Route = createFileRoute('/map')({
  component: MapRoute,
  validateSearch: validateMapSearch,
})

const PAGE = getPage('map-baseline')

function MapRoute() {
  const { lat, lng, zoom, showLocation } = Route.useSearch()
  useScrollToTop(lat, lng)

  return (
    <>
      <div className="flex h-[calc(100dvh-57px)] flex-col md:h-[calc(100dvh-65px)]">
        <MapHeader page={PAGE} />
        <div key={`${lat}-${lng}-${zoom}`} className="relative w-full flex-1 min-h-0">
          <SCIMap initialLat={lat} initialLng={lng} initialZoom={zoom} displayLocation={showLocation !== false} />
          <MapFocusOverlay />
        </div>
      </div>
      <MapZipSearch mapRoute="/map" />
      <MapAttribution />
      <FundingTable />
      <MapAboutSection page={PAGE} />
    </>
  )
}
