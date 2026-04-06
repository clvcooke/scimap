import { createFileRoute } from '@tanstack/react-router'
import FY27Map from '../components/FY27Map'
import { validateMapSearch, useScrollToMap } from '@/lib/map-search-params'
import { getPage } from '@/lib/content'
import { MapAboutSection } from '@/components/MapAboutSection'
import { MapHeader } from '@/components/MapHeader'
import MapAttribution from '@/components/MapAttribution'
import MapFocusOverlay from '@/components/MapFocusOverlay'

export const Route = createFileRoute('/fy27')({
  component: FY27Route,
  validateSearch: validateMapSearch,
})

const PAGE = getPage('map-fy27')

function FY27Route() {
  const { lat, lng, zoom } = Route.useSearch()
  const mapRef = useScrollToMap(lat, lng)

  return (
    <>
      <div className="flex h-[calc(100dvh-57px)] flex-col md:h-[calc(100dvh-65px)]">
        <MapHeader page={PAGE} />
        <div ref={mapRef} className="relative w-full flex-1 min-h-0 scroll-mt-16">
          <FY27Map initialLat={lat} initialLng={lng} initialZoom={zoom} />
          <MapFocusOverlay />
        </div>
      </div>
      <MapAttribution />
      <MapAboutSection page={PAGE} />
    </>
  )
}
