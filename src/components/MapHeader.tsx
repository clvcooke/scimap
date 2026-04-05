import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { PageContent } from '@/lib/content'

export function MapHeader({ page }: { page: PageContent }) {
  const { title, blurb } = page.attrs
  const [open, setOpen] = useState(false)

  if (!title && !blurb) return null

  return (
    <div className="w-full bg-brand-blue px-4 py-4 md:px-6 md:py-5">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          {title && (
            <h1 className="text-xl font-bold text-white md:text-2xl">{title}</h1>
          )}
          {blurb && (
            <button
              onClick={() => setOpen(!open)}
              className="shrink-0 rounded-full p-1 text-white/70 transition-colors hover:text-white"
              aria-label={open ? 'Collapse description' : 'Expand description'}
            >
              <ChevronDown className={`size-5 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
        {blurb && (
          <p className={`mt-1 max-w-3xl text-sm leading-relaxed text-gray-200 md:text-base ${open ? 'block' : 'hidden'}`}>
            {blurb}
          </p>
        )}
      </div>
    </div>
  )
}
