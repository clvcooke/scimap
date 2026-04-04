import { createFileRoute } from '@tanstack/react-router'
import GrantsMap from '../components/GrantsMap'
import { validateMapSearch, useScrollToMap } from '@/lib/map-search-params'
import { getPage } from '@/lib/content'
import { MapAboutSection } from '@/components/MapAboutSection'
import MapAttribution from '@/components/MapAttribution'

export const Route = createFileRoute('/grants')({
  component: GrantsRoute,
  validateSearch: validateMapSearch,
})

const PAGE = getPage('map-grants')

function GrantsRoute() {
  const { lat, lng, zoom } = Route.useSearch()
  const mapRef = useScrollToMap(lat, lng)

  return (
    <>
      <div ref={mapRef} className="relative w-full min-h-[calc(100vh-140px)] scroll-mt-16">
        <GrantsMap initialLat={lat} initialLng={lng} initialZoom={zoom} />
      </div>
      <MapAttribution />
      <MapAboutSection page={PAGE} />
    </>
  )
}
