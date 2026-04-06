import { lazy, Suspense, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { BookOpen, ExternalLink, Newspaper, Archive, ChevronDown } from 'lucide-react'
import MapAttribution from '@/components/MapAttribution'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'
import { getArticles, getPage } from '@/lib/content'

const IDCMap = lazy(() => import('@/components/IDCMap'))
const FY26Map = lazy(() => import('@/components/FY26Map'))

export const Route = createFileRoute('/insights')({
  component: InsightsPage,
})

/* ── Data ──────────────────────────────────────────────────────────── */

const ARTICLES = getArticles()
const PAGE = getPage('insights')

/* ── Collapsible section ───────────────────────────────────────────── */

function CollapsibleSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center justify-between px-5 py-4 text-left text-lg font-semibold text-gray-900 hover:bg-gray-50"
      >
        {title}
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="border-t border-gray-200 px-5 py-5">{children}</div>}
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────────────── */

function InsightsPage() {
  const a = PAGE.attrs
  return (
    <div className="flex w-full flex-col bg-neutral-50">
      {/* Compact page header + tab bar — single band */}
      <Tabs defaultValue="research" className="w-full gap-0">
        <div className="w-full bg-white px-6 pt-6">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-2xl font-bold text-brand-blue">Insights</h1>
            <p className="mt-1 text-sm text-gray-500">
              Publications, analysis, and deeper dives into the data
            </p>

            <div className="-mb-px mt-5 border-b border-gray-200">
              <TabsList
                variant="line"
                className="h-10 w-full justify-start gap-0"
              >
                <TabsTrigger
                  value="research"
                  className="h-10 gap-2 rounded-none px-2 text-xs font-semibold text-gray-500 hover:text-gray-700 data-active:text-brand-blue after:bg-brand-blue sm:px-4 sm:text-sm"
                >
                  <BookOpen className="hidden h-4 w-4 sm:block" />
                  Research
                </TabsTrigger>
                <TabsTrigger
                  value="substack"
                  className="h-10 gap-2 rounded-none px-2 text-xs font-semibold text-gray-500 hover:text-gray-700 data-active:text-brand-blue after:bg-brand-blue sm:px-4 sm:text-sm"
                >
                  <Newspaper className="hidden h-4 w-4 sm:block" />
                  Science Matters
                </TabsTrigger>
                <TabsTrigger
                  value="archived"
                  className="h-10 gap-2 rounded-none px-2 text-xs font-semibold text-gray-500 hover:text-gray-700 data-active:text-brand-blue after:bg-brand-blue sm:px-4 sm:text-sm"
                >
                  <Archive className="hidden h-4 w-4 sm:block" />
                  Archived Maps
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        </div>

        {/* ── Research Insights ─────────────────────────────────────── */}
        <TabsContent value="research" className="text-base">
          <div className="w-full px-6 py-8 md:py-10">
            <div className="mx-auto max-w-4xl">
              <p className="mb-6 leading-relaxed text-gray-600">
                {a.research_intro}
              </p>

              <div className="space-y-4">
                {ARTICLES.map((article) => (
                  <a
                    key={article.title}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-brand-blue/30 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-gray-900 group-hover:text-brand-blue">
                        {article.title}
                      </h3>
                      <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-gray-300 transition-colors group-hover:text-brand-blue" />
                    </div>
                    <p className="mt-2 text-[15px] leading-relaxed text-gray-500">
                      {article.blurb}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Science Matters ──────────────────────────────────────── */}
        <TabsContent value="substack" className="text-base">
          <div className="w-full px-6 py-8 md:py-10">
            <div className="mx-auto max-w-4xl">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8">
                <h2 className="text-lg font-semibold text-gray-900">
                  {a.substack_heading}
                </h2>
                <p className="mt-2 leading-relaxed text-gray-500">
                  {a.substack_description}
                </p>
                <a
                  href={a.substack_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue-light"
                >
                  {a.substack_button_text}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Archived Maps ────────────────────────────────────────── */}
        <TabsContent value="archived" className="text-base">
          <div className="w-full px-6 py-8 md:py-10">
            <div className="mx-auto max-w-4xl space-y-4">
              <CollapsibleSection title="IDC Analysis">
                <p className="mb-6 leading-relaxed text-gray-600">
                  {a.idc_intro}
                </p>
                <div className="relative h-125 md:h-150">
                  <Suspense fallback={<div className="flex h-full items-center justify-center text-gray-400">Loading map…</div>}>
                    <IDCMap />
                  </Suspense>
                </div>
                <MapAttribution />
              </CollapsibleSection>

              <CollapsibleSection title="FY26 Budget Impact">
                <div className="relative h-125 md:h-150">
                  <Suspense fallback={<div className="flex h-full items-center justify-center text-gray-400">Loading map…</div>}>
                    <FY26Map />
                  </Suspense>
                </div>
                <MapAttribution />
              </CollapsibleSection>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
