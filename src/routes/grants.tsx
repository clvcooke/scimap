import { createFileRoute } from '@tanstack/react-router'
import GrantsMap from '../components/GrantsMap'
import { validateMapSearch, useScrollToMap } from '@/lib/map-search-params'
import { getPage } from '@/lib/content'
import { MapAboutSection } from '@/components/MapAboutSection'
import { MapHeader } from '@/components/MapHeader'
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
      <div className="flex h-[calc(100dvh-57px)] flex-col md:h-[calc(100dvh-65px)]">
        <MapHeader page={PAGE} />
        <div ref={mapRef} className="relative w-full flex-1 min-h-0 scroll-mt-16">
          <GrantsMap initialLat={lat} initialLng={lng} initialZoom={zoom} />
        </div>
      </div>
      <MapAttribution />
      <MapAboutSection page={PAGE} />
    </>
  )
}
