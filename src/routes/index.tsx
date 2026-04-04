import { useState, lazy, Suspense } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getPage } from '@/lib/content'
import { InlineMarkdown } from '@/components/InlineMarkdown'

const MapPreview = lazy(() => import('@/components/MapPreview'))

export const Route = createFileRoute('/')({
  component: Index,
})

const PAGE = getPage('home')

function Index() {
  const a = PAGE.attrs
  const metrics: { value: string; label: string }[] = a.metrics ?? []
  const whoItems: { name: string; desc: string }[] = a.who_items ?? []
  const [zip, setZip] = useState('')
  const [zipError, setZipError] = useState('')
  const [zipLoading, setZipLoading] = useState(false)
  const navigate = useNavigate()

  const handleZipSearch = async () => {
    const trimmed = zip.trim()
    if (!/^\d{5}$/.test(trimmed)) {
      setZipError('Please enter a valid 5-digit ZIP code')
      return
    }
    setZipError('')
    setZipLoading(true)

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${trimmed}&country=US&format=json&limit=1`,
      )
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data: { lat: string; lon: string }[] = await res.json()
      if (!data.length) {
        setZipError('Could not find that ZIP code')
        return
      }
      const { lat, lon } = data[0]
      void navigate({
        to: '/map',
        search: { lat: parseFloat(lat), lng: parseFloat(lon), zoom: 8 },
      })
    } catch {
      setZipError('Geocoding failed — please try again')
    } finally {
      setZipLoading(false)
    }
  }

  return (
    <div className="flex w-full flex-col">
      {/* Hero Section */}
      <section className="relative w-full bg-brand-blue">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-3 py-20 md:flex-row">
          {/* Left: Content (60%) */}
          <div className="w-full space-y-8 text-white md:w-3/5">
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              {a.hero_title}
            </h1>
            <p className="max-w-2xl text-xl font-semibold leading-snug text-white md:text-2xl">
              {a.hero_subheading}
            </p>
            <p className="max-w-2xl text-lg leading-relaxed text-gray-200 md:text-xl">
              {a.hero_subtitle}
            </p>
            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <Link
                to="/map"
                className="inline-flex h-auto shrink-0 items-center justify-center rounded-md bg-white px-6 py-3 text-base font-bold text-brand-blue transition-all hover:bg-gray-100"
              >
                {a.hero_cta_primary}
              </Link>
              <Button
                variant="outline"
                className="h-auto rounded-md border-2 border-white bg-transparent px-8 py-6 text-lg font-bold text-white hover:bg-white/10 hover:text-white"
              >
                {a.hero_cta_secondary}
              </Button>
            </div>
          </div>

          {/* Right: Placeholder Image (40%) */}
          <div className="flex w-full justify-center md:w-1/2 md:justify-end">
            <img
              src="/map-img.png"
              alt="Science map visualization"
              className="w-full max-w-xl rounded-lg object-cover shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Informational Section */}
      <section className="w-full bg-blue-50 px-6 py-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center space-y-10 text-center">
          <h2 className="text-3xl font-bold text-brand-blue">
            {a.stakes_heading}
          </h2>

          <div className="space-y-6 text-xl leading-relaxed text-gray-700">
            {(a.stakes_paragraphs ?? []).map((p: string, i: number) => (
              <p key={i}><InlineMarkdown>{p}</InlineMarkdown></p>
            ))}
          </div>
        </div>
      </section>

      {/* Data Metrics Strip */}
      <section className="w-full bg-brand-sky px-6 py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center space-y-12">
          <h2 className="text-center text-3xl font-bold text-white">
            {a.metrics_heading}
          </h2>
          <div className="grid w-full grid-cols-1 gap-8 divide-y text-center sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 divide-white/20">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="flex flex-col items-center justify-center space-y-2 pt-6 sm:pt-0"
              >
                <span className="text-5xl font-bold text-white">
                  {m.value}
                </span>
                <span className="text-lg font-medium text-white">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map & ZIP Entry Section */}
      <section className="w-full bg-brand-blue px-6 py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 md:flex-row">
          {/* Left Column (Input) - 40% */}
          <div className="w-full space-y-6 md:w-2/5">
            <h3 className="text-3xl font-bold text-white">{a.local_heading}</h3>
            <p className="text-lg leading-relaxed text-gray-200">
              {a.local_description}
            </p>
            <form
              className="flex w-full max-w-sm flex-col pt-4"
              onSubmit={(e) => {
                e.preventDefault()
                void handleZipSearch()
              }}
            >
              <div className="flex">
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  name="postal-code"
                  maxLength={5}
                  placeholder="ZIP Code"
                  value={zip}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 5)
                    setZip(val)
                    setZipError('')
                  }}
                  className="w-full rounded-l-md border-0 px-4 py-4 text-lg font-medium text-white ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-sky"
                />
                <button
                  type="submit"
                  disabled={zipLoading}
                  className="flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-r-md bg-white px-6 py-4 text-lg font-bold text-brand-blue transition-colors hover:bg-gray-100 disabled:cursor-wait disabled:opacity-70"
                >
                  {zipLoading ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <>Search <span aria-hidden="true">&rarr;</span></>
                  )}
                </button>
              </div>
              {zipError && (
                <p className="mt-2 text-sm text-red-300">{zipError}</p>
              )}
            </form>
          </div>

          {/* Right Column (Visual) - 60% */}
          <div className="flex w-full justify-center md:w-3/5 md:justify-end">
            <Link
              to="/map"
              search={{ lat: 39.8283, lng: -98.5795, zoom: 3.5, showLocation: false }}
              className="group relative block aspect-video w-full max-w-2xl overflow-hidden rounded-2xl border border-brand-blue-light shadow-2xl transition-shadow hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]"
            >
              <Suspense fallback={<div className="h-full w-full animate-pulse bg-brand-blue-dark" />}>
                <MapPreview />
              </Suspense>
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
              <span className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/90 px-5 py-2 text-sm font-bold text-brand-blue shadow transition-colors group-hover:bg-white">
                Explore the Map &rarr;
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* "Why This Matters" & "Who We Serve" (Dual Card Layout) */}
      <section className="w-full bg-white px-6 py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-16 lg:grid-cols-2">
          {/* Left Side (Context) */}
          <div className="space-y-8 pr-0 lg:pr-8">
            <h3 className="text-3xl font-bold text-brand-blue">
              {a.why_heading}
            </h3>
            <div className="space-y-6 text-lg leading-relaxed text-gray-700">
              {(a.why_paragraphs ?? []).map((p: string, i: number) => (
                <p key={i}><InlineMarkdown>{p}</InlineMarkdown></p>
              ))}
            </div>
            <div className="pt-4">
              <Link to="/insights">
                <Button className="flex h-auto w-full items-center gap-2 rounded-md bg-brand-blue px-8 py-6 text-lg font-bold text-white hover:bg-brand-blue-dark sm:w-auto">
                  {a.why_cta} <span>&rarr;</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side (The Card) */}
          <div className="h-full rounded-xl border border-gray-200 bg-neutral-100 p-8 shadow-sm md:p-10">
            <h3 className="mb-8 text-2xl font-bold text-brand-blue">
              {a.who_heading}
            </h3>
            <ul className="space-y-4">
              {whoItems.map((item) => (
                <li key={item.name} className="flex items-start">
                  <span className="mr-4 text-2xl leading-none text-brand-orange">
                    &bull;
                  </span>
                  <p className="text-lg text-gray-800">
                    <strong className="text-brand-blue">{item.name}:</strong>{' '}
                    {item.desc}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
