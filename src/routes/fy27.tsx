import { createFileRoute } from '@tanstack/react-router'
import FY27Map from '../components/FY27Map'
import { validateMapSearch, useScrollToTop } from '@/lib/map-search-params'
import { getPage } from '@/lib/content'
import { MapAboutSection } from '@/components/MapAboutSection'
import { MapHeader } from '@/components/MapHeader'
import MapAttribution from '@/components/MapAttribution'
import MapFocusOverlay from '@/components/MapFocusOverlay'
import MapZipSearch from '@/components/MapZipSearch'

export const Route = createFileRoute('/fy27')({
  component: FY27Route,
  validateSearch: validateMapSearch,
})

const PAGE = getPage('map-fy27')

function FY27Route() {
  const { lat, lng, zoom } = Route.useSearch()
  useScrollToTop(lat, lng)

  return (
    <>
      <div className="flex h-[calc(100dvh-57px)] flex-col md:h-[calc(100dvh-65px)]">
        <MapHeader page={PAGE} />
        <div key={`${lat}-${lng}-${zoom}`} className="relative w-full flex-1 min-h-0">
          <FY27Map initialLat={lat} initialLng={lng} initialZoom={zoom} />
          <MapFocusOverlay />
        </div>
      </div>
      <MapZipSearch mapRoute="/fy27" />
      <MapAttribution />
      <MapAboutSection page={PAGE} />
    </>
  )
}
