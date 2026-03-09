import { createFileRoute } from '@tanstack/react-router'
import SCIMap from '../components/Map'

export const Route = createFileRoute('/map')({
  component: MapRoute,
})

function MapRoute() {
  return (
    <div className="flex-1 relative w-full h-full min-h-[calc(100vh-140px)]">
      <SCIMap />
    </div>
  )
}
