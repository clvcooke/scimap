import { createFileRoute } from '@tanstack/react-router'
import { BookOpen, ExternalLink, Newspaper, BarChart3 } from 'lucide-react'
import IDCMap from '@/components/IDCMap'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'

export const Route = createFileRoute('/insights')({
  component: InsightsPage,
})

/* ── Data ──────────────────────────────────────────────────────────── */

interface Article {
  title: string
  url: string
  blurb: string
}

const ARTICLES: Article[] = [
  {
    title: 'Placeholder Article Title',
    url: '#',
    blurb:
      'This is a placeholder blurb for a research article. Replace with the actual description of the article and its key findings.',
  },
  {
    title: 'Another Research Article',
    url: '#',
    blurb:
      'Another placeholder description. Add a brief summary of the article content and why it matters.',
  },
  {
    title: 'Economic Ripple Effects of Federal Grant Freezes',
    url: '#',
    blurb:
      'Placeholder for an article examining how paused federal grants cascade through local economies, affecting suppliers, subcontractors, and small businesses near research institutions.',
  },
  {
    title: 'Rural Communities and the Science Funding Gap',
    url: '#',
    blurb:
      'Placeholder for an article exploring how rural areas experience disproportionate impacts when federal research dollars are reduced, and what that means for regional equity.',
  },
  {
    title: 'What Indirect Costs Actually Pay For',
    url: '#',
    blurb:
      'Placeholder for an explainer on how indirect cost recovery funds campus infrastructure, compliance offices, and shared labs — and what happens when that funding disappears.',
  },
  {
    title: 'Early-Career Researchers Bear the Brunt',
    url: '#',
    blurb:
      'Placeholder for an article on how funding disruptions disproportionately affect postdocs, graduate students, and junior faculty who lack the grant portfolios to weather cuts.',
  },
]

/* ── Page ──────────────────────────────────────────────────────────── */

function InsightsPage() {
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
                  className="h-10 gap-2 rounded-none px-4 text-sm font-semibold text-gray-500 hover:text-gray-700 data-active:text-brand-blue after:bg-brand-blue"
                >
                  <BookOpen className="h-4 w-4" />
                  Research
                </TabsTrigger>
                <TabsTrigger
                  value="substack"
                  className="h-10 gap-2 rounded-none px-4 text-sm font-semibold text-gray-500 hover:text-gray-700 data-active:text-brand-blue after:bg-brand-blue"
                >
                  <Newspaper className="h-4 w-4" />
                  Science Matters
                </TabsTrigger>
                <TabsTrigger
                  value="idc"
                  className="h-10 gap-2 rounded-none px-4 text-sm font-semibold text-gray-500 hover:text-gray-700 data-active:text-brand-blue after:bg-brand-blue"
                >
                  <BarChart3 className="h-4 w-4" />
                  IDC Analysis
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
                Articles and publications exploring the impacts of federal
                science funding changes on communities across the country.
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
                  Science Matters on Substack
                </h2>
                <p className="mt-2 leading-relaxed text-gray-500">
                  Follow Joshua Weitz's Substack newsletter for in-depth essays
                  on the intersection of science, policy, and society. Explore
                  critical perspectives on research funding, scientific
                  integrity, and the role of science in democratic governance.
                </p>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue-light"
                >
                  Read on Substack
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── IDC Analysis ─────────────────────────────────────────── */}
        <TabsContent value="idc" className="text-base">
          <div className="w-full px-6 py-8 md:py-10">
            <div className="mx-auto max-w-4xl">
              <p className="mb-6 leading-relaxed text-gray-600">
                An interactive look at Indirect Cost (IDC) rates and their role
                in sustaining research infrastructure across institutions
                nationwide.
              </p>

              <div className="relative h-[500px] md:h-[600px]">
                <IDCMap />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
