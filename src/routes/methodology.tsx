import { createFileRoute } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import {
  Database,
  TrendingUp,
  Users,
  MapPin,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { getPage } from '@/lib/content'
import { InlineMarkdown } from '@/components/InlineMarkdown'

export const Route = createFileRoute('/methodology')({
  component: MethodologyPage,
})

/* ── Data ──────────────────────────────────────────────────────────── */

const M = getPage('methodology')

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

function Intro({ children }: { children: ReactNode }) {
  return (
    <p className="mb-5 text-lg leading-relaxed text-gray-700">{children}</p>
  )
}

function BulletList({
  items,
  dotColor = 'bg-brand-orange',
  textColor = 'text-gray-700',
}: {
  items: (string | { name: string; desc: string })[]
  dotColor?: string
  textColor?: string
}) {
  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const key = typeof item === 'string' ? item : item.name
        return (
          <li key={key} className="flex items-start">
            <span
              className={`mr-3 mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotColor}`}
            />
            <p className={textColor}>
              {typeof item === 'string' ? (
                item
              ) : (
                <>
                  <strong className="text-brand-blue">{item.name}:</strong>{' '}
                  {item.desc}
                </>
              )}
            </p>
          </li>
        )
      })}
    </ul>
  )
}

/* ── Page ─────────────────────────────────────────────────────────── */

function MethodologyPage() {
  const a = M.attrs
  return (
    <div className="flex w-full flex-col">
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

      {/* Overview */}
      <Section bg="white">
        <h2 className="text-2xl font-bold text-brand-blue">Overview</h2>
        <p className="mt-3 text-lg leading-relaxed text-gray-700">
          {a.overview}
        </p>
      </Section>

      {/* Data Sources */}
      <Section bg="neutral">
        <SectionHeading icon={Database}>Data Sources</SectionHeading>
        <Intro>{a.data_sources_intro}</Intro>
        <BulletList items={a.data_sources ?? []} />
      </Section>

      {/* Economic Impact Modeling */}
      <Section bg="white">
        <SectionHeading icon={TrendingUp}>
          Economic Impact Modeling
        </SectionHeading>
        <Intro>{a.economic_intro}</Intro>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(a.economic_effects ?? []).map(
            (item: { title: string; desc: string }) => (
              <div
                key={item.title}
                className="rounded-xl border border-gray-200 bg-neutral-50 p-5"
              >
                <h3 className="font-bold text-brand-blue">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                  {item.desc}
                </p>
              </div>
            ),
          )}
        </div>
        {a.economic_callout && (
          <div className="mt-5 rounded-lg border-l-4 border-brand-sky bg-brand-sky/10 px-5 py-3">
            <p className="text-gray-700">
              <InlineMarkdown>{a.economic_callout}</InlineMarkdown>
            </p>
          </div>
        )}
      </Section>

      {/* Job Impact Calculations */}
      <Section bg="neutral">
        <SectionHeading icon={Users}>Job Impact Calculations</SectionHeading>
        <Intro>{a.jobs_intro}</Intro>
        <BulletList items={a.job_impacts ?? []} />
      </Section>

      {/* Spatial Analysis */}
      <Section bg="white">
        <SectionHeading icon={MapPin}>
          Spatial Analysis &amp; Geographic Mapping
        </SectionHeading>
        <Intro>{a.spatial_intro}</Intro>
        <BulletList items={a.spatial_items ?? []} />
      </Section>


      {/* Limitations */}
      <Section bg="neutral">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-2xl font-bold text-amber-900">
              Limitations &amp; Considerations
            </h2>
          </div>
          <p className="mb-5 leading-relaxed text-amber-800">
            {a.limitations_intro}
          </p>
          <BulletList
            items={a.limitations ?? []}
            dotColor="bg-amber-400"
            textColor="text-amber-900"
          />
      </Section>
    </div>
  )
}
