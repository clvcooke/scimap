import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, MapPin } from 'lucide-react'

/**
 * Compact ZIP-code search bar for map pages.
 * Navigates to the given map route with lat/lng/zoom from the geocoded ZIP.
 */
export default function MapZipSearch({ mapRoute }: { mapRoute: string }) {
  const [zip, setZip] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSearch = async () => {
    const trimmed = zip.trim()
    if (!/^\d{5}$/.test(trimmed)) {
      setError('Please enter a valid 5-digit ZIP code')
      return
    }
    setError('')
    setLoading(true)

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${trimmed}&country=US&format=json&limit=1`,
      )
      const data: { lat: string; lon: string }[] = await res.json()
      if (!data.length) {
        setError('Could not find that ZIP code')
        return
      }
      const { lat, lon } = data[0]
      void navigate({
        to: mapRoute,
        search: { lat: parseFloat(lat), lng: parseFloat(lon), zoom: 8 },
      })
    } catch {
      setError('Geocoding failed — please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full bg-gray-50 px-3 py-4 md:px-6 md:py-6">
      <form
        className="mx-auto flex max-w-md flex-col items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          void handleSearch()
        }}
      >
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
          <MapPin className="size-4" />
          Zoom into your ZIP code
        </div>
        <div className="flex w-full">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            name="postal-code"
            maxLength={5}
            placeholder="ZIP Code"
            value={zip}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 5)
              setZip(val)
              setError('')
            }}
            className="w-full rounded-l-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-r-md bg-brand-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-blue-dark disabled:cursor-wait disabled:opacity-70"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : 'Go'}
          </button>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </form>
    </div>
  )
}
