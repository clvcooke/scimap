import { createFileRoute } from '@tanstack/react-router'
import SCIMap from '../components/Map'
import FundingTable from '../components/FundingTable'
import { validateMapSearch, useScrollToMap } from '@/lib/map-search-params'

export const Route = createFileRoute('/map')({
  component: MapRoute,
  validateSearch: validateMapSearch,
})

function MapRoute() {
  const { lat, lng, zoom } = Route.useSearch()
  const mapRef = useScrollToMap(lat, lng)

  return (
    <>
      <div ref={mapRef} className="relative w-full min-h-[calc(100vh-140px)] scroll-mt-16">
        <SCIMap initialLat={lat} initialLng={lng} initialZoom={zoom} />
      </div>
      <FundingTable />

      <section className="w-full bg-gray-50 px-3 py-6 md:px-6 md:py-10">
        <div className="mx-auto max-w-7xl rounded-xl border border-gray-200 bg-white px-4 py-5 shadow-sm md:px-8 md:py-7">
          <h3 className="text-lg font-semibold text-gray-900">About This Data</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-gray-600">
            This map displays the baseline distribution of federal research funding before recent
            cuts, providing context for understanding the magnitude and geographic spread of impacts.
          </p>
          <div className="mt-4 flex flex-wrap items-baseline gap-2 text-sm">
            <span className="font-medium text-gray-500">Data Sources</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-600">NIH RePORTER</span>
            <span className="text-gray-300">&middot;</span>
            <span className="text-gray-600">NSF Awards Database</span>
            <span className="text-gray-300">&middot;</span>
            <span className="text-gray-600">USASpending.gov</span>
          </div>
        </div>
      </section>
    </>
  )
}
