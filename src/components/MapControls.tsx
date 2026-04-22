import { Plus, Minus, LocateFixed } from 'lucide-react'
import type { INITIAL_VIEW_STATE } from '@/lib/map-config'

type ViewState = typeof INITIAL_VIEW_STATE
type SetViewState = React.Dispatch<React.SetStateAction<ViewState>>

const btnBase =
  'flex size-8 items-center justify-center bg-white shadow-md transition-colors hover:bg-gray-100 active:bg-gray-200'

export default function MapControls({
  setViewState,
  onGeolocate,
}: {
  setViewState: SetViewState
  onGeolocate?: (lat: number, lng: number) => void
}) {
  return (
    <div className="absolute bottom-2 left-2 z-10 flex flex-col gap-1 md:bottom-4 md:left-4">
      <button
        onClick={() => setViewState((vs) => ({ ...vs, zoom: vs.zoom + 1 }))}
        className={`${btnBase} rounded-t-lg`}
        aria-label="Zoom in"
      >
        <Plus className="size-4" />
      </button>
      <button
        onClick={() => setViewState((vs) => ({ ...vs, zoom: Math.max(vs.zoom - 1, 1) }))}
        className={btnBase}
        aria-label="Zoom out"
      >
        <Minus className="size-4" />
      </button>
      <button
        data-tour="map-locate"
        onClick={() => {
          navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords
            setViewState((prev) => ({
              ...prev,
              longitude,
              latitude,
              zoom: 10,
            }))
            onGeolocate?.(latitude, longitude)
          })
        }}
        className={`${btnBase} rounded-b-lg`}
        aria-label="Zoom to my location"
      >
        <LocateFixed className="size-4" />
      </button>
    </div>
  )
}
