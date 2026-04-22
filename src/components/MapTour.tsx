import { useEffect } from 'react'
import introJs from 'intro.js'
import 'intro.js/introjs.css'

const TOUR_SEEN_KEY = 'scimap:map-tour-seen'

interface MapTourProps {
  onTourActiveChange?: (active: boolean) => void
}

export default function MapTour({ onTourActiveChange }: MapTourProps = {}) {
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
              'Toggle between states, counties, congressional districts, and cities — plus any map-specific data filters shown here.',
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
              'Click any region on the map to open a detailed breakdown of projected impacts on local economies and jobs.',
          },
          {
            element: share as HTMLElement,
            title: 'Share what you find',
            intro:
              'Copy the link or post to social media.',
          },
        ],
      })

      const markSeen = () => localStorage.setItem(TOUR_SEEN_KEY, '1')
      const finish = () => {
        markSeen()
        onTourActiveChange?.(false)
      }
      intro.oncomplete(finish)
      intro.onexit(finish)
      onTourActiveChange?.(true)
      void intro.start()
    }, 500)

    return () => window.clearTimeout(timer)
  }, [onTourActiveChange])

  return null
}
