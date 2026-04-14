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

      {/* Indirect Costs */}
      <Section bg="neutral">
        <SectionHeading icon={Building}>Indirect Costs</SectionHeading>
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
    </div>
  )
}
