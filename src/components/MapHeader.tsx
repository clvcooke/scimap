import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { LayoutGrid, ChevronDown } from 'lucide-react'
import type { PageContent } from '@/lib/content'

export function MapHeader({ page }: { page: PageContent }) {
  const { title, blurb } = page.attrs
  const [expanded, setExpanded] = useState(false)

  if (!title && !blurb) return null

  return (
    <div className="w-full bg-brand-blue px-4 py-2 md:px-6 md:py-2.5">
      <div className="mx-auto flex max-w-7xl items-center gap-3">
        {title && (
          <h1 className="min-w-0 flex-1 truncate text-base font-bold text-white md:flex-none md:shrink-0 md:overflow-visible md:whitespace-normal md:text-lg">
            {title}
          </h1>
        )}
        {blurb && (
          <>
            <span className="hidden text-white/30 md:inline">|</span>
            <p className="hidden min-w-0 text-xs leading-snug text-gray-200 md:block md:text-sm">
              {blurb}
            </p>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white/15 text-white transition-colors hover:bg-white/25 md:hidden"
              aria-label={expanded ? 'Hide description' : 'Show description'}
              aria-expanded={expanded}
            >
              <ChevronDown className={`size-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>
          </>
        )}
        <Link
          to="/maps"
          className="flex shrink-0 items-center gap-1.5 rounded-md bg-white/15 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-white/25 md:ml-auto md:text-sm"
        >
          <LayoutGrid className="size-3.5 md:size-4" />
          <span className="hidden sm:inline">All Maps</span>
        </Link>
      </div>
      {blurb && expanded && (
        <p className="mx-auto mt-2 max-w-7xl text-xs leading-snug text-gray-200 md:hidden">
          {blurb}
        </p>
      )}
    </div>
  )
}
