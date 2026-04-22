import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, type ReactNode } from 'react'
import {
  Megaphone,
  Share2,
  MapPin,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { getPage } from '@/lib/content'
import { InlineMarkdown } from '@/components/InlineMarkdown'
import ShareMenu from '@/components/ShareMenu'
import { Events, track, setPersonProperties } from '@/lib/analytics'

export const Route = createFileRoute('/take-action')({
  component: TakeActionPage,
})

/* ── Data ──────────────────────────────────────────────────────────── */

const PAGE = getPage('take-action')

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

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start">
          <span className="mr-3 mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-orange" />
          <p className="text-gray-700">
            <InlineMarkdown>{item}</InlineMarkdown>
          </p>
        </li>
      ))}
    </ul>
  )
}

/* ── Page ─────────────────────────────────────────────────────────── */

function TakeActionPage() {
  const a = PAGE.attrs
  const contactRef = useRef<HTMLDivElement>(null)
  const sawContactRef = useRef(false)

  useEffect(() => {
    const el = contactRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5 && !sawContactRef.current) {
            sawContactRef.current = true
            track(Events.TAKE_ACTION_CONTACT_REPS_SEEN, {})
          }
        }
      },
      { threshold: [0.5] },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

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

      {/* Contact Your Representatives */}
      <Section bg="white">
        <div ref={contactRef}>
          <SectionHeading icon={Megaphone}>
            {a.contact_heading}
          </SectionHeading>
          <p className="mb-5 text-lg leading-relaxed text-gray-700 [&_a]:text-brand-blue [&_a]:underline [&_a]:hover:text-brand-sky">
            <InlineMarkdown>{a.contact_intro}</InlineMarkdown>
          </p>
          {a.contact_link && (
            <div className="mb-6">
              <a
                href={a.contact_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  track(Events.TAKE_ACTION_FIND_REPS_CLICKED, {})
                  setPersonProperties({ has_clicked_find_reps: true })
                }}
                className="inline-flex items-center gap-2 rounded-md bg-brand-blue px-5 py-3 text-base font-bold text-white transition-colors hover:bg-brand-blue-dark"
              >
                <MapPin className="size-4" />
                {a.contact_link_text ?? 'Find your representatives'}
              </a>
            </div>
          )}
          <BulletList items={a.talking_points ?? []} />
        </div>
      </Section>

      {/* Share */}
      <Section bg="neutral">
        <SectionHeading
          icon={Share2}
          iconBg="bg-brand-sky/15"
          iconColor="text-brand-sky"
        >
          {a.share_heading}
        </SectionHeading>
        <div className="mb-5 flex flex-wrap items-center gap-4">
          <p className="text-lg leading-relaxed text-gray-700">
            <InlineMarkdown>{a.share_intro}</InlineMarkdown>
          </p>
          <ShareMenu className="inline-flex" dropUp variant="full" pageType="take-action" />
        </div>
        {a.organizations && (
          <ul className="mb-6 space-y-2">
            {(a.organizations as { name: string; url: string }[]).map((org) => (
              <li key={org.name} className="flex items-start">
                <span className="mr-3 mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-sky" />
                <a
                  href={org.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    track(Events.TAKE_ACTION_ORG_CLICKED, { org_name: org.name, url: org.url })
                  }
                  className="text-lg text-brand-blue underline hover:text-brand-sky"
                >
                  {org.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  )
}
