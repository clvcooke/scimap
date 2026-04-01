import { createFileRoute } from '@tanstack/react-router'
import { Mail, Newspaper, ArrowUpRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { getPage } from '@/lib/content'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

const PAGE = getPage('contact')

const ICONS: Record<string, LucideIcon> = {
  mail: Mail,
  newspaper: Newspaper,
}

const ICON_STYLES: Record<string, { bg: string; color: string }> = {
  mail: { bg: 'bg-brand-blue/10', color: 'text-brand-blue' },
  newspaper: { bg: 'bg-brand-sky/15', color: 'text-brand-sky' },
}

function ContactPage() {
  const a = PAGE.attrs
  const contacts = a.contacts ?? []

  return (
    <div className="flex w-full flex-col">
      {/* Header */}
      <section className="w-full bg-brand-blue px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold leading-tight text-white md:text-5xl">
            {a.hero_title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-200 md:text-xl">
            {a.hero_subtitle}
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="w-full bg-white px-6 py-20 md:py-24">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
          {contacts.map(
            (card: {
              heading: string
              icon: string
              description: string
              email: string
            }) => {
              const Icon = ICONS[card.icon] ?? Mail
              const style = ICON_STYLES[card.icon] ?? ICON_STYLES.mail
              return (
                <div
                  key={card.heading}
                  className="group rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md md:p-10"
                >
                  <div
                    className={`mb-6 flex h-14 w-14 items-center justify-center rounded-lg ${style.bg}`}
                  >
                    <Icon className={`h-7 w-7 ${style.color}`} />
                  </div>
                  <h2 className="text-2xl font-bold text-brand-blue">
                    {card.heading}
                  </h2>
                  <p className="mt-3 leading-relaxed text-gray-600">
                    {card.description}
                  </p>
                  <a
                    href={`mailto:${card.email}`}
                    className="mt-6 inline-flex items-center gap-2 text-lg font-semibold text-brand-blue transition-colors hover:text-brand-blue-light"
                  >
                    {card.email}
                    <ArrowUpRight className="h-5 w-5" />
                  </a>
                </div>
              )
            },
          )}
        </div>
      </section>
    </div>
  )
}
