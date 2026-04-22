import { createFileRoute } from '@tanstack/react-router'
import { ExternalLink, Megaphone, Newspaper } from 'lucide-react'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'
import { getNewsItems, getPressReleases } from '@/lib/content'
import { Events, track } from '@/lib/analytics'

export const Route = createFileRoute('/news')({
  component: NewsPage,
})

/* ── Data ──────────────────────────────────────────────────────────── */

const NEWS_ITEMS = getNewsItems()
const PRESS_RELEASES = getPressReleases()

/* ── Page ──────────────────────────────────────────────────────────── */

function NewsPage() {
  return (
    <div className="flex w-full flex-col bg-neutral-50">
      <Tabs defaultValue="in-the-news" className="w-full gap-0">
        <div className="w-full bg-white px-6 pt-6">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-2xl font-bold text-brand-blue">News</h1>
            <p className="mt-1 text-sm text-gray-500">
              Press releases and media coverage of SCIMaP
            </p>

            <div className="-mb-px mt-5 border-b border-gray-200">
              <TabsList
                variant="line"
                className="h-10 w-full justify-start gap-0"
              >
                <TabsTrigger
                  value="in-the-news"
                  className="h-10 gap-2 rounded-none px-4 text-sm font-semibold text-gray-500 hover:text-gray-700 data-active:text-brand-blue after:bg-brand-blue"
                >
                  <Newspaper className="h-4 w-4" />
                  SCIMaP in the News
                </TabsTrigger>
                <TabsTrigger
                  value="press"
                  className="h-10 gap-2 rounded-none px-4 text-sm font-semibold text-gray-500 hover:text-gray-700 data-active:text-brand-blue after:bg-brand-blue"
                >
                  <Megaphone className="h-4 w-4" />
                  Press Releases
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        </div>

        {/* ── SCIMaP in the News ──────────────────────────────────── */}
        <TabsContent value="in-the-news" className="text-base">
          <div className="w-full px-6 py-8 md:py-10">
            <div className="mx-auto max-w-4xl">
              <div className="space-y-4">
                {NEWS_ITEMS.map((item, i) => (
                  <a
                    key={`${item.title}-${i}`}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      track(Events.NEWS_ARTICLE_CLICKED, {
                        title: item.title,
                        url: item.url,
                        source: item.source,
                        type: 'news',
                      })
                    }
                     className="group flex overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:border-brand-blue/30 hover:shadow-md"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt=""
                        className="hidden w-36 shrink-0 bg-white object-contain p-2 sm:block"
                      />
                    )}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <span
                          className={`text-xs font-medium ${
                            item.isOngoing ? 'text-brand-blue' : 'text-gray-400'
                          }`}
                        >
                          {item.date}
                        </span>
                        <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                          {item.source}
                        </span>
                      </div>
                      <h3 className="mt-2 font-semibold text-gray-900 group-hover:text-brand-blue">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Press Releases ──────────────────────────────────────── */}
        <TabsContent value="press" className="text-base">
          <div className="w-full px-6 py-8 md:py-10">
            <div className="mx-auto max-w-4xl">
              <div className="space-y-4">
                {PRESS_RELEASES.map((pr) => (
                  <a
                    key={pr.title}
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      track(Events.NEWS_ARTICLE_CLICKED, {
                        title: pr.title,
                        url: pr.url,
                        type: 'press_release',
                      })
                    }
                    className="group flex overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:border-brand-blue/30 hover:shadow-md"
                  >
                    {pr.image && (
                      <img
                        src={pr.image}
                        alt=""
                        className="hidden w-36 shrink-0 bg-white object-contain p-2 sm:block"
                      />
                    )}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-xs font-medium text-gray-400">
                            {pr.date}
                          </span>
                          <h3 className="mt-1 font-semibold text-gray-900 group-hover:text-brand-blue">
                            {pr.title}
                          </h3>
                        </div>
                        <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-gray-300 transition-colors group-hover:text-brand-blue" />
                      </div>
                      <p className="mt-2 text-[15px] leading-relaxed text-gray-500">
                        {pr.summary}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
