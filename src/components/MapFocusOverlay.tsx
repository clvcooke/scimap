import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Overlay that blocks map interaction until the user clicks on it.
 * Lets page scroll pass through the map area instead of being captured for zoom.
 * Deactivates on click inside, reactivates on Escape or click outside.
 */
export default function MapFocusOverlay() {
  const [active, setActive] = useState(true)
  const overlayRef = useRef<HTMLDivElement>(null)

  const deactivate = useCallback(() => setActive(false), [])
  const activate = useCallback(() => setActive(true), [])

  useEffect(() => {
    if (active) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') activate()
    }

    const handleClickOutside = (e: MouseEvent) => {
      const container = overlayRef.current?.parentElement
      if (container && !container.contains(e.target as Node)) {
        activate()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [active, activate])

  if (!active) return null

  return (
    <div
      ref={overlayRef}
      role="button"
      tabIndex={0}
      onClick={deactivate}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') deactivate() }}
      className="absolute inset-0 z-20 flex cursor-pointer items-center justify-center bg-black/5 transition-opacity"
    >
      <span className="rounded-lg bg-black/70 px-4 py-2 text-sm font-medium text-white shadow-lg">
        Click to interact with map
      </span>
    </div>
  )
}
