import type { PageContent } from '@/lib/content'
import { InlineMarkdown } from './InlineMarkdown'

export function MapAboutSection({ page }: { page: PageContent }) {
  const a = page.attrs
  const sources: string[] = a.data_sources ?? []

  return (
    <section className="w-full bg-gray-50 px-3 py-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-7xl rounded-xl border border-gray-200 bg-white px-4 py-5 shadow-sm md:px-8 md:py-7">
        <h3 className="text-lg font-semibold text-gray-900">{a.heading}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-gray-600">
          <InlineMarkdown>{a.description}</InlineMarkdown>
        </p>
        {sources.length > 0 && (
          <div className="mt-4 flex flex-wrap items-baseline gap-2 text-sm">
            <span className="font-medium text-gray-500">Data Sources</span>
            <span className="text-gray-300">|</span>
            {sources.map((source, i) => (
              <span key={source} className="flex items-baseline gap-2">
                {i > 0 && <span className="text-gray-300">&middot;</span>}
                <span className="text-gray-600 [&_a]:text-brand-blue [&_a]:underline [&_a]:hover:text-brand-blue-light">
                  <InlineMarkdown>{source}</InlineMarkdown>
                </span>
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
