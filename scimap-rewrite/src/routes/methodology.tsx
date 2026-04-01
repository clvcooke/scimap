import { createFileRoute } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import {
  Database,
  TrendingUp,
  Users,
  MapPin,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react'
import type { ReactNode } from 'react'

export const Route = createFileRoute('/methodology')({
  component: MethodologyPage,
})

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

/* ── Section data ────────────────────────────────────────────────── */

const DATA_SOURCES = [
  {
    name: 'NIH RePORTER',
    desc: 'Federal grant data from the National Institutes of Health, including award amounts, project details, and recipient institution information',
  },
  {
    name: 'NSF Awards Database',
    desc: 'National Science Foundation grant information spanning all scientific disciplines',
  },
  {
    name: 'USASpending.gov',
    desc: 'Federal spending data from multiple agencies supporting research and development',
  },
  {
    name: 'U.S. Census Bureau',
    desc: 'Economic and demographic data for regional analysis and impact modeling',
  },
  {
    name: 'Bureau of Economic Analysis (BEA)',
    desc: 'Regional economic multipliers and input-output data',
  },
]

const ECONOMIC_EFFECTS = [
  {
    title: 'Direct Effects',
    desc: 'Initial spending at research institutions, including salaries, equipment, and supplies',
  },
  {
    title: 'Indirect Effects',
    desc: 'Business-to-business transactions in the supply chain supporting research activities',
  },
  {
    title: 'Induced Effects',
    desc: 'Consumer spending from employees whose jobs depend on research funding',
  },
  {
    title: 'Regional Multipliers',
    desc: 'Location-specific multipliers based on BEA RIMS II (Regional Input-Output Modeling System) data',
  },
]

const JOB_IMPACTS = [
  {
    name: 'Direct Jobs',
    desc: 'Researchers, technicians, and staff directly employed on funded projects',
  },
  {
    name: 'Indirect Jobs',
    desc: 'Employment in supporting industries (suppliers, vendors, service providers)',
  },
  {
    name: 'Induced Jobs',
    desc: 'Jobs created by increased consumer spending from research-related employees',
  },
  {
    name: 'Regional Variation',
    desc: 'Job multipliers adjusted for local labor market conditions and industry composition',
  },
]

const SPATIAL_ITEMS = [
  'Geocoding grant recipient addresses to county and ZIP code levels',
  'Aggregating impacts at multiple geographic scales (county, congressional district, state)',
  'Mapping funding distribution patterns and identifying regional disparities',
  'Analyzing urban-rural differences in research funding and impact',
]

const TRANSPARENCY_ITEMS = [
  'All data sources are publicly available and documented',
  'Economic models and multipliers are based on peer-reviewed research',
  'Assumptions and limitations are clearly stated',
  'Results are validated against independent estimates where available',
  'Methods and calculations are open to peer review',
]

const LIMITATION_ITEMS = [
  'Economic multipliers are estimates based on historical data and may not capture unique local conditions',
  'Our analysis focuses on quantifiable economic impacts and does not capture all social benefits of research',
  'Funding cut impacts may take time to fully materialize as grants phase out',
  'Geographic assignment relies on institutional addresses, which may not reflect all project locations',
  'Long-term innovation impacts and scientific discovery effects are difficult to quantify',
]

/* ── Page ─────────────────────────────────────────────────────────── */

function MethodologyPage() {
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
            Methodology
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-gray-200 md:text-xl">
            How we track and analyze the impact of science funding cuts
          </p>
        </div>
      </section>

      {/* Overview */}
      <Section bg="white">
        <h2 className="text-2xl font-bold text-brand-blue">Overview</h2>
        <p className="mt-3 text-lg leading-relaxed text-gray-700">
          The Science &amp; Community Impact Mapping Project (SCIMaP) employs rigorous,
          data-driven methodologies to quantify the economic and social impacts of federal
          science funding cuts. Our approach combines multiple data sources, economic models,
          and spatial analysis to provide accurate, transparent assessments of funding impacts
          at national, state, and local levels.
        </p>
      </Section>

      {/* Data Sources */}
      <Section bg="neutral">
        <SectionHeading icon={Database}>Data Sources</SectionHeading>
        <Intro>
          Our analysis draws from multiple authoritative public data sources:
        </Intro>
        <BulletList items={DATA_SOURCES} />
      </Section>

      {/* Economic Impact Modeling */}
      <Section bg="white">
        <SectionHeading icon={TrendingUp}>
          Economic Impact Modeling
        </SectionHeading>
        <Intro>
          We employ established economic multiplier models to calculate the full economic
          impact of research funding:
        </Intro>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ECONOMIC_EFFECTS.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-gray-200 bg-neutral-50 p-5"
            >
              <h3 className="font-bold text-brand-blue">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-lg border-l-4 border-brand-sky bg-brand-sky/10 px-5 py-3">
          <p className="text-gray-700">
            Economic multipliers typically range from{' '}
            <strong className="text-brand-blue">1.5 to 2.5</strong>, meaning each dollar of
            research funding generates{' '}
            <strong className="text-brand-blue">$1.50 to $2.50</strong> in total economic
            activity.
          </p>
        </div>
      </Section>

      {/* Job Impact Calculations */}
      <Section bg="neutral">
        <SectionHeading icon={Users}>Job Impact Calculations</SectionHeading>
        <Intro>
          Employment impacts are calculated using industry-specific job multipliers that
          account for:
        </Intro>
        <BulletList items={JOB_IMPACTS} />
      </Section>

      {/* Spatial Analysis */}
      <Section bg="white">
        <SectionHeading icon={MapPin}>
          Spatial Analysis &amp; Geographic Mapping
        </SectionHeading>
        <Intro>Our geographic analysis methodology includes:</Intro>
        <BulletList items={SPATIAL_ITEMS} />
      </Section>

      {/* Transparency & Validation */}
      <Section bg="neutral">
        <SectionHeading icon={ShieldCheck}>
          Transparency &amp; Validation
        </SectionHeading>
        <Intro>
          We maintain rigorous standards for transparency and accuracy:
        </Intro>
        <BulletList items={TRANSPARENCY_ITEMS} />
      </Section>

      {/* Limitations */}
      <section className="w-full px-6 py-8 md:py-10">
        <div className="mx-auto max-w-4xl rounded-xl border border-amber-300 bg-amber-50 p-6 md:p-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-200">
              <AlertTriangle className="h-5 w-5 text-amber-700" />
            </div>
            <h2 className="text-2xl font-bold text-amber-900">
              Limitations &amp; Considerations
            </h2>
          </div>
          <p className="mb-5 leading-relaxed text-amber-800">
            Like all analytical approaches, our methodology has inherent limitations:
          </p>
          <BulletList
            items={LIMITATION_ITEMS}
            dotColor="bg-amber-400"
            textColor="text-amber-900"
          />
        </div>
      </section>
    </div>
  )
}
