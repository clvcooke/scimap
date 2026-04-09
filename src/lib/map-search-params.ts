import { useEffect } from 'react'

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
 * On mount, if lat/lng are present, scrolls to the top of the page
 * so the header and explainer text are visible.
 */
export function useScrollToTop(lat?: number, lng?: number) {
  useEffect(() => {
    if (lat != null && lng != null) {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
