import { createFileRoute } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import {
  Database,
  TrendingUp,
  MapPin,
  Train,
  BarChart3,
  Scissors,
  AlertTriangle,
  Building,
  History,
  Mail,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { MarkdownBody } from '@/components/MarkdownBody'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'
import { getPage, getUpdates } from '@/lib/content'
import { InlineMarkdown } from '@/components/InlineMarkdown'

export const Route = createFileRoute('/methodology')({
  component: MethodologyPage,
})

/* ── Data ──────────────────────────────────────────────────────────── */

const M = getPage('methodology')
const SOURCE_DATA = getPage('about-source-data')
const UPDATES = getUpdates()

/* ── Tiny helpers ────────────────────────────────────────────────── */

function Section({
  bg,
  children,
}: {
  bg: 'white' | 'neutral'
  children: ReactNode
}) {
  return (
    <section
      className={`w-full px-6 py-8 md:py-10 ${bg === 'neutral' ? 'bg-neutral-50' : 'bg-white'}`}
    >
      <div className="mx-auto max-w-4xl">{children}</div>
    </section>
  )
}

function SectionHeading({
  icon: Icon,
  iconBg = 'bg-brand-blue/10',
  iconColor = 'text-brand-blue',
  children,
}: {
  icon: LucideIcon
  iconBg?: string
  iconColor?: string
  children: ReactNode
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}
      >
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <h2 className="text-2xl font-bold text-brand-blue">{children}</h2>
    </div>
  )
}

function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4 text-lg leading-relaxed text-gray-700">
      {children}
    </div>
  )
}

function ProseBlock({ items }: { items: string[] }) {
  return (
    <Prose>
      {items.map((item, i) => (
        <p key={i}>
          <InlineMarkdown>{item}</InlineMarkdown>
        </p>
      ))}
    </Prose>
  )
}

/* ── Page ─────────────────────────────────────────────────────────── */

function MethodologyPage() {
  const a = M.attrs
  return (
    <div className="flex w-full flex-1 flex-col">
      {/* Hero */}
      <section className="relative w-full overflow-hidden bg-brand-blue px-6 py-14 md:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-brand-sky blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-brand-orange blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold leading-tight text-white md:text-5xl">
            {a.hero_title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-gray-200 md:text-xl">
            {a.hero_subtitle}
          </p>
        </div>
      </section>

      {/* Tabs */}
      <Tabs defaultValue="methodology" className="flex w-full flex-1 flex-col gap-0">
        <div className="w-full bg-white px-6">
          <div className="mx-auto max-w-4xl">
            <div className="-mb-px border-b border-gray-200">
              <TabsList
                variant="line"
                className="h-10 w-full justify-start gap-0"
              >
                <TabsTrigger
                  value="methodology"
                  className="h-10 gap-2 rounded-none px-2 text-xs font-semibold text-gray-500 hover:text-gray-700 data-active:text-brand-blue after:bg-brand-blue sm:px-4 sm:text-sm"
                >
                  Methodology
                </TabsTrigger>
                <TabsTrigger
                  value="source-data"
                  className="h-10 gap-2 rounded-none px-2 text-xs font-semibold text-gray-500 hover:text-gray-700 data-active:text-brand-blue after:bg-brand-blue sm:px-4 sm:text-sm"
                >
                  <Database className="hidden h-4 w-4 sm:block" />
                  Source Data
                </TabsTrigger>
                <TabsTrigger
                  value="updates"
                  className="h-10 gap-2 rounded-none px-2 text-xs font-semibold text-gray-500 hover:text-gray-700 data-active:text-brand-blue after:bg-brand-blue sm:px-4 sm:text-sm"
                >
                  <History className="hidden h-4 w-4 sm:block" />
                  Updates
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        </div>

        {/* ── Methodology ──────────────────────────────────────────── */}
        <TabsContent value="methodology" className="flex-1">
          {/* Overview */}
          <Section bg="white">
            <h2 className="text-2xl font-bold text-brand-blue">Overview</h2>
            <p className="mt-3 text-lg leading-relaxed text-gray-700">
              <InlineMarkdown>{a.overview}</InlineMarkdown>
            </p>
          </Section>

          {/* Geolocating Grants */}
          <Section bg="neutral">
            <SectionHeading icon={MapPin}>Geolocating Grants</SectionHeading>
            <p className="mb-4 text-lg leading-relaxed text-gray-700">
              <InlineMarkdown>{a.geolocating_intro}</InlineMarkdown>
            </p>
            <ProseBlock items={a.geolocating_details ?? []} />
          </Section>

          {/* Economic Multiplier */}
          <Section bg="white">
            <SectionHeading icon={TrendingUp}>Economic Multiplier</SectionHeading>
            <p className="mb-4 text-lg leading-relaxed text-gray-700">
              <InlineMarkdown>{a.economic_multiplier_intro}</InlineMarkdown>
            </p>
            <ProseBlock items={a.economic_multiplier_details ?? []} />
          </Section>

          {/* Commuter Flows */}
          <Section bg="neutral">
            <SectionHeading icon={Train}>Commuter Flows</SectionHeading>
            <p className="mb-4 text-lg leading-relaxed text-gray-700">
              <InlineMarkdown>{a.commuter_flows_intro}</InlineMarkdown>
            </p>
            <ProseBlock items={a.commuter_flows_details ?? []} />
          </Section>

          {/* Baseline */}
          <Section bg="white">
            <SectionHeading icon={BarChart3}>Baseline</SectionHeading>
            <p className="mb-4 text-lg leading-relaxed text-gray-700">
              <InlineMarkdown>{a.baseline_intro}</InlineMarkdown>
            </p>
            <ProseBlock items={a.baseline_details ?? []} />
          </Section>

          {/* FY2027 Budget Cuts */}
          <Section bg="neutral">
            <SectionHeading icon={Scissors}>FY2027 Budget Cuts</SectionHeading>
            <p className="mb-4 text-lg leading-relaxed text-gray-700">
              <InlineMarkdown>{a.fy2027_intro}</InlineMarkdown>
            </p>
            <ProseBlock items={a.fy2027_details ?? []} />
          </Section>

          {/* Disrupted Grants */}
          <Section bg="white">
            <SectionHeading icon={AlertTriangle}>Disrupted Grants</SectionHeading>
            <p className="mb-4 text-lg leading-relaxed text-gray-700">
              <InlineMarkdown>{a.disrupted_intro}</InlineMarkdown>
            </p>
            <ProseBlock items={a.disrupted_details ?? []} />
          </Section>

          {/* Research Infrastructure (Indirect Costs) */}
          <Section bg="neutral">
            <SectionHeading icon={Building}>Research Infrastructure (Indirect Costs)</SectionHeading>
            <p className="mb-4 text-lg leading-relaxed text-gray-700">
              <InlineMarkdown>{a.indirect_costs_intro}</InlineMarkdown>
            </p>
            <ProseBlock items={a.indirect_costs_details ?? []} />
          </Section>

          {/* Data Sources */}
          <Section bg="white">
            <SectionHeading icon={Database}>Data Sources</SectionHeading>
            <ul className="space-y-3">
              {(a.data_sources ?? []).map(
                (source: { name: string; url: string }) => (
                  <li key={source.name} className="flex items-start">
                    <span className="mr-3 mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-orange" />
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg text-brand-blue underline decoration-brand-blue/30 hover:decoration-brand-blue"
                    >
                      {source.name}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </Section>

        </TabsContent>

        {/* ── Source Data ──────────────────────────────────────────── */}
        <TabsContent value="source-data" className="flex-1 text-base">
          <div className="w-full px-6 py-8 md:py-10">
            <div className="mx-auto max-w-4xl">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8">
                <h2 className="text-xl font-bold text-gray-900">
                  {SOURCE_DATA.attrs.title}
                </h2>

                <MarkdownBody className="mt-4 leading-relaxed [&_a]:text-brand-blue [&_a]:underline [&_a]:hover:text-brand-blue-light">
                  {SOURCE_DATA.body}
                </MarkdownBody>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Updates ──────────────────────────────────────────────── */}
        <TabsContent value="updates" className="flex-1">
          <Section bg="white">
            <SectionHeading icon={History}>Updates</SectionHeading>
            {a.updates_intro && (
              <p className="mb-4 text-lg leading-relaxed text-gray-700">
                <InlineMarkdown>{a.updates_intro}</InlineMarkdown>
              </p>
            )}
            {a.updates_signup_url && (
              <a
                href={a.updates_signup_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-3 inline-flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 text-base font-semibold text-white shadow-sm transition hover:bg-brand-blue/90"
              >
                <Mail className="h-4 w-4" />
                {a.updates_signup_cta ?? 'Sign up for email updates'}
              </a>
            )}
            {a.updates_signup_text && (
              <p className="mb-8 text-sm leading-relaxed text-gray-600">
                <InlineMarkdown>{a.updates_signup_text}</InlineMarkdown>
              </p>
            )}
            <ol className="relative space-y-6 border-l-2 border-brand-blue/20 pl-6">
              {UPDATES.map((u, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[31px] top-2 h-3 w-3 rounded-full bg-brand-orange ring-4 ring-white" />
                  <div className="text-sm font-semibold uppercase tracking-wide text-brand-blue">
                    {u.date}
                  </div>
                  {u.title && (
                    <div className="mt-1 text-lg font-bold text-gray-900">
                      {u.title}
                    </div>
                  )}
                  <p className="mt-1 text-lg leading-relaxed text-gray-700">
                    <InlineMarkdown>{u.body}</InlineMarkdown>
                  </p>
                </li>
              ))}
            </ol>
          </Section>
        </TabsContent>
      </Tabs>
    </div>
  )
}
