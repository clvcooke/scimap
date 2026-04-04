import { createFileRoute } from '@tanstack/react-router'
import FY27Map from '../components/FY27Map'
import { validateMapSearch, useScrollToMap } from '@/lib/map-search-params'
import { getPage } from '@/lib/content'
import { MapAboutSection } from '@/components/MapAboutSection'
import MapAttribution from '@/components/MapAttribution'

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
      <div ref={mapRef} className="relative w-full min-h-[calc(100vh-140px)] scroll-mt-16">
        <FY27Map initialLat={lat} initialLng={lng} initialZoom={zoom} />
      </div>
      <MapAttribution />
      <MapAboutSection page={PAGE} />
    </>
  )
}
