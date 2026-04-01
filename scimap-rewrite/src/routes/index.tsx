import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="bg-brand-blue w-full relative">
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
          {/* Left: Content (60%) */}
          <div className="w-full md:w-3/5 text-white space-y-8">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Science & Community Impacts
              <br />
              Mapping Project
            </h1>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl">
              Understand how proposed federal funding cuts to research and science initiatives
              affect local communities, universities, and economic development across the nation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/map"
                className="inline-flex shrink-0 items-center justify-center bg-brand-orange hover:bg-brand-orange-hover text-brand-blue font-bold text-base px-6 py-3 h-auto rounded-md transition-all"
              >
                View the Map
              </Link>
              <Button
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 hover:text-white font-bold text-lg px-8 py-6 h-auto rounded-md bg-transparent"
              >
                Read the Report
              </Button>
            </div>
          </div>

          {/* Right: Placeholder Image (40%) */}
          <div className="w-full md:w-2/5 flex justify-center md:justify-end">
            <div className="w-full max-w-md aspect-square bg-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 overflow-hidden relative shadow-xl">
              <svg
                className="w-24 h-24 mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="font-medium">Thematic Image Placeholder</span>
              <span className="text-sm">(Grayscale Map/Science imagery)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Informational Section */}
      <section className="bg-white w-full py-20 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-10">
          <h2 className="text-3xl font-bold text-brand-blue">What&apos;s At Stake</h2>

          <div className="text-xl text-gray-700 leading-relaxed space-y-6">
            <p>
              Federal investment in science and research drives innovation, creates jobs, and
              supports critical infrastructure in communities across the United States.
            </p>
            <p>
              The proposed <strong className="text-brand-blue">FY2026 Budget</strong> cuts would
              reduce funding to the National Institutes of Health (NIH) and other key agencies by up
              to <strong className="text-brand-blue">22%</strong>.
            </p>
            <p>
              Additionally, caps on{' '}
              <strong className="text-brand-blue">Indirect Costs (15%)</strong> will severely
              restrict the ability of universities and research institutions to maintain facilities
              and support staff, leading to cancelled projects and hiring freezes.
            </p>
          </div>
        </div>
      </section>

      {/* Data Metrics Strip */}
      <section className="bg-brand-sky w-full py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center space-y-12">
          <h2 className="text-3xl font-bold text-white text-center">
            Current Nationwide Impact of NIH Grant Terminations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full text-center divide-y sm:divide-y-0 sm:divide-x divide-white/20">
            <div className="flex flex-col items-center justify-center space-y-2 pt-6 sm:pt-0">
              <span className="text-5xl font-bold text-white">$11B</span>
              <span className="text-lg text-white font-medium">Economic Loss</span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 pt-6 sm:pt-0">
              <span className="text-5xl font-bold text-white">49K</span>
              <span className="text-lg text-white font-medium">Jobs at Risk</span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 pt-6 sm:pt-0">
              <span className="text-5xl font-bold text-white">2.5K</span>
              <span className="text-lg text-white font-medium">Grants Cancelled</span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 pt-6 sm:pt-0">
              <span className="text-5xl font-bold text-white">50</span>
              <span className="text-lg text-white font-medium">States Affected</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map & ZIP Entry Section */}
      <section className="bg-brand-blue w-full py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          {/* Left Column (Input) - 40% */}
          <div className="w-full md:w-2/5 space-y-6">
            <h3 className="text-3xl font-bold text-white">See Impacts in Your Local Area</h3>
            <p className="text-lg text-gray-200 leading-relaxed">
              Enter your ZIP code to explore how specific funding cuts will affect jobs, research
              projects, and institutional resources in your community.
            </p>
            <div className="pt-4 flex w-full max-w-sm">
              <input
                type="text"
                placeholder="ZIP Code"
                className="w-full rounded-l-md border-0 px-4 py-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-orange text-lg font-medium"
              />
              <button className="bg-brand-orange hover:bg-brand-orange-hover text-brand-blue font-bold text-lg px-6 py-4 rounded-r-md transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
                Search <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>

          {/* Right Column (Visual) - 60% */}
          <div className="w-full md:w-3/5 flex justify-center md:justify-end">
            <div className="w-full max-w-2xl bg-brand-blue-dark rounded-2xl overflow-hidden shadow-2xl border border-brand-blue-light aspect-video flex flex-col items-center justify-center relative group cursor-pointer">
              <svg
                className="w-32 h-32 text-blue-400/30 group-hover:text-blue-400/50 transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-tr from-red-500/10 via-transparent to-blue-500/10 mix-blend-overlay"></div>
              <span className="mt-6 text-blue-200/70 font-medium text-lg tracking-wide uppercase">
                Interactive Map Preview
              </span>
              <span className="text-blue-300/50 text-sm mt-2">(Choropleth Heatmap Style)</span>
            </div>
          </div>
        </div>
      </section>

      {/* "Why This Matters" & "Who We Serve" (Dual Card Layout) */}
      <section className="bg-white w-full py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side (Context) */}
          <div className="space-y-8 pr-0 lg:pr-8">
            <h3 className="text-3xl font-bold text-brand-blue">Why This Matters</h3>
            <div className="text-gray-700 text-lg leading-relaxed space-y-6">
              <p>
                Federal investment in science drives innovation, creates jobs, saves lives, and
                improves quality of life for people across the country. Funding cuts harm research
                institutions, local economies, and people in red and blue states alike.
              </p>
              <p>
                SCIMaP transforms abstract policy decisions into visible community impacts that
                everyone can understand, so we can take action and make informed decisions to
                protect our communities.
              </p>
            </div>
            <div className="pt-4">
              <Button className="bg-brand-blue hover:bg-brand-blue-dark text-white font-bold text-lg px-8 py-6 h-auto rounded-md w-full sm:w-auto flex items-center gap-2">
                Read our Research Insights <span>&rarr;</span>
              </Button>
            </div>
          </div>

          {/* Right Side (The Card) */}
          <div className="bg-neutral-100 rounded-xl p-8 md:p-10 shadow-sm border border-gray-200 h-full">
            <h3 className="text-2xl font-bold text-brand-blue mb-8">Who We Serve</h3>
            <ul className="space-y-6">
              <li className="flex items-start">
                <span className="text-brand-orange text-2xl mr-4 leading-none">&bull;</span>
                <p className="text-gray-800 text-lg">
                  <strong className="text-brand-blue">Policy Makers:</strong> Data-driven insights
                  for informed decision making
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-brand-orange text-2xl mr-4 leading-none">&bull;</span>
                <p className="text-gray-800 text-lg">
                  <strong className="text-brand-blue">Journalists:</strong> Unbiased data and
                  visualizations for reporting
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-brand-orange text-2xl mr-4 leading-none">&bull;</span>
                <p className="text-gray-800 text-lg">
                  <strong className="text-brand-blue">Advocacy Groups:</strong> Evidence-based
                  resources for campaigns
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-brand-orange text-2xl mr-4 leading-none">&bull;</span>
                <p className="text-gray-800 text-lg">
                  <strong className="text-brand-blue">The Public:</strong> Clear understanding of
                  science funding&apos;s local impact
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Map Section (Commented out for now) */}
      {/*
      <section className="w-full h-[600px] bg-gray-100 relative">
        <SCIMap />
      </section>
      */}
    </div>
  )
}
