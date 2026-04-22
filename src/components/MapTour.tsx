import { useEffect } from 'react'
import introJs from 'intro.js'
import 'intro.js/introjs.css'

const TOUR_SEEN_KEY = 'scimap:map-tour-seen'

export default function MapTour() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem(TOUR_SEEN_KEY)) return

    const timer = window.setTimeout(() => {
      const toggles = document.querySelector('[data-tour="map-toggles"]')
      const locate = document.querySelector('[data-tour="map-locate"]')
      const canvas = document.querySelector('[data-tour="map-canvas"]')
      const share = document.querySelector('[data-tour="map-share"]')
      if (!toggles || !locate || !canvas || !share) return

      const intro = introJs()
      intro.setOptions({
        showBullets: true,
        showProgress: false,
        exitOnOverlayClick: false,
        scrollToElement: true,
        scrollTo: 'tooltip',
        nextLabel: 'Next',
        prevLabel: 'Back',
        doneLabel: 'Got it',
        steps: [
          {
            element: toggles as HTMLElement,
            title: 'Switch geography and filters',
            intro:
              'Toggle between states, counties, congressional districts, and cities — plus any map-specific filters shown here.',
          },
          {
            element: locate as HTMLElement,
            title: 'Jump to your location',
            intro: 'Zoom the map to where you are with one click.',
          },
          {
            element: canvas as HTMLElement,
            title: 'Open region details',
            intro:
              'Click any region on the map to open a detailed breakdown of projected funding cuts, jobs lost, and economic impact.',
          },
          {
            element: share as HTMLElement,
            title: 'Share what you find',
            intro:
              'Copy the link or post to social — the URL preserves your current view so others land on the same spot.',
          },
        ],
      })

      const markSeen = () => localStorage.setItem(TOUR_SEEN_KEY, '1')
      intro.oncomplete(markSeen)
      intro.onexit(markSeen)
      void intro.start()
    }, 500)

    return () => window.clearTimeout(timer)
  }, [])

  return null
}
