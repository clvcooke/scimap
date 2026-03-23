import { createFileRoute } from '@tanstack/react-router'
import { Mail, Newspaper, ArrowUpRight } from 'lucide-react'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
  return (
    <div className="flex w-full flex-col">
      {/* Header */}
      <section className="w-full bg-brand-blue px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold leading-tight text-white md:text-5xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-200 md:text-xl">
            Have questions about our research, data, or how to use SciMap? We&apos;re here to help.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="w-full bg-white px-6 py-20 md:py-24">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
          {/* General Inquiries */}
          <div className="group rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md md:p-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-brand-blue/10">
              <Mail className="h-7 w-7 text-brand-blue" />
            </div>
            <h2 className="text-2xl font-bold text-brand-blue">General Inquiries</h2>
            <p className="mt-3 leading-relaxed text-gray-600">
              Questions about our data, methodology, partnerships, or how to use SCIMaP for your
              research and advocacy work.
            </p>
            <a
              href="mailto:contact@scienceimpacts.org"
              className="mt-6 inline-flex items-center gap-2 text-lg font-semibold text-brand-blue transition-colors hover:text-brand-blue-light"
            >
              contact@scienceimpacts.org
              <ArrowUpRight className="h-5 w-5" />
            </a>
          </div>

          {/* Press & Media */}
          <div className="group rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md md:p-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-brand-sky/15">
              <Newspaper className="h-7 w-7 text-brand-sky" />
            </div>
            <h2 className="text-2xl font-bold text-brand-blue">Press & Media</h2>
            <p className="mt-3 leading-relaxed text-gray-600">
              Media inquiries, interview requests, data citations, and press-related questions about
              our research findings.
            </p>
            <a
              href="mailto:press@scienceimpacts.org"
              className="mt-6 inline-flex items-center gap-2 text-lg font-semibold text-brand-blue transition-colors hover:text-brand-blue-light"
            >
              press@scienceimpacts.org
              <ArrowUpRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
