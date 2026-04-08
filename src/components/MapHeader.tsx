import type { PageContent } from '@/lib/content'

export function MapHeader({ page }: { page: PageContent }) {
  const { title, blurb } = page.attrs

  if (!title && !blurb) return null

  return (
    <div className="w-full bg-brand-blue px-4 py-2 md:px-6 md:py-2.5">
      <div className="mx-auto flex max-w-7xl items-center gap-3">
        {title && (
          <h1 className="shrink-0 text-base font-bold text-white md:text-lg">{title}</h1>
        )}
        {blurb && (
          <>
            <span className="text-white/30">|</span>
            <p className="min-w-0 text-xs leading-snug text-gray-200 md:text-sm">
              {blurb}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
