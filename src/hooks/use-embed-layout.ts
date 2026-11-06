import { useLocation } from '@tanstack/react-router'
import { getEmbedLayout } from '@/lib/embed'

export function useEmbedLayout() {
  // Read the raw URL: route validation can strip embed query parameters.
  useLocation()
  return getEmbedLayout(typeof window === 'undefined' ? '' : window.location.search)
}
