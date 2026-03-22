import { createFileRoute } from '@tanstack/react-router'
import SCIMap from '../components/Map'
import FundingTable from '../components/FundingTable'

export const Route = createFileRoute('/map')({
  component: MapRoute,
})

function MapRoute() {
  return (
    <>
      <div className="relative w-full min-h-[calc(100vh-140px)]">
        <SCIMap />
      </div>
      <FundingTable />
    </>
  )
}
