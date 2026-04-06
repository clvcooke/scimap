import { useEffect, useRef } from 'react'

export interface MapSearchParams {
  lat?: number | undefined
  lng?: number | undefined
  zoom?: number | undefined
  showLocation?: boolean | undefined
}

export function validateMapSearch(search: Record<string, unknown>): MapSearchParams {
  return {
    lat: search.lat ? Number(search.lat) : undefined,
    lng: search.lng ? Number(search.lng) : undefined,
    zoom: search.zoom ? Number(search.zoom) : undefined,
    showLocation: search.showLocation === false ? false : undefined,
  }
}

/**
 * Returns a ref to attach to the map container div.
 * On mount, if lat/lng are present, scrolls the element into view
 * accounting for the sticky header.
 */
export function useScrollToMap(lat?: number, lng?: number) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (lat != null && lng != null && ref.current) {
      ref.current.scrollIntoView({ behavior: 'instant' })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return ref
}
