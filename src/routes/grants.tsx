import { createFileRoute } from '@tanstack/react-router'
import GrantsMap from '../components/GrantsMap'
import { validateMapSearch, useScrollToTop } from '@/lib/map-search-params'
import { getPage } from '@/lib/content'
import { MapHeader } from '@/components/MapHeader'
import MapAttribution from '@/components/MapAttribution'
import MapFocusOverlay from '@/components/MapFocusOverlay'
import MapZipSearch from '@/components/MapZipSearch'
import type { MapAboutContent } from '@/components/ChoroplethMap'

export const Route = createFileRoute('/grants')({
  component: GrantsRoute,
  validateSearch: validateMapSearch,
})

const PAGE = getPage('map-grants')
const ABOUT: MapAboutContent = { heading: PAGE.attrs.heading, description: PAGE.attrs.description, dataSources: PAGE.attrs.data_sources }

function GrantsRoute() {
  const { lat, lng, zoom } = Route.useSearch()
  useScrollToTop(lat, lng)

  return (
    <>
      <div className="flex h-[calc(100dvh-57px)] flex-col md:h-[calc(100dvh-65px)]">
        <MapHeader page={PAGE} />
        <div key={`${lat}-${lng}-${zoom}`} className="relative w-full flex-1 min-h-0">
          <GrantsMap initialLat={lat} initialLng={lng} initialZoom={zoom} aboutContent={ABOUT} />
          <MapFocusOverlay />
        </div>
      </div>
      <MapZipSearch mapRoute="/grants" />
      <MapAttribution />
    </>
  )
}
