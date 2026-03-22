import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/methodology')({
  component: Methodology,
})

function Methodology() {
  return (
    <div className="flex w-full flex-col">
      {/* Hero Section */}
      <section className="relative w-full bg-brand-blue">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-20 md:flex-row md:items-center">
          <div className="w-full space-y-6 text-white md:w-2/3">
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">Methodology</h1>
            <p className="max-w-2xl text-lg leading-relaxed text-brand-yellow">
              Our approach to quantifying the impact of federal science funding cuts
            </p>
            <p className="max-w-3xl text-lg leading-relaxed text-gray-200">
              The Science & Community Impacts Mapping Project (SCIMaP) employs a rigorous,
              data-driven approach to estimate the geographic and economic effects of proposed
              federal research funding cuts. Our methodology relies on publicly available data,
              peer-reviewed economic models, and conservative estimation strategies.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full bg-white px-6 py-20">
        <div className="mx-auto flex max-w-4xl flex-col space-y-16">
          {/* Data Sources */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-brand-blue md:text-3xl">Data Sources</h2>
            <p className="text-lg text-gray-700">
              Our analysis integrates data from several authoritative sources:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="mr-4 mt-1.5 flex h-5 w-5 shrink-0 rounded-full bg-brand-yellow"></span>
                <p className="text-lg text-gray-700">
                  <strong className="text-brand-blue">Grant Watch Database:</strong> Primary source
                  for tracking cancelled, frozen, or at-risk NIH grants.
                </p>
              </li>
              <li className="flex items-start">
                <span className="mr-4 mt-1.5 flex h-5 w-5 shrink-0 rounded-full bg-brand-yellow"></span>
                <p className="text-lg text-gray-700">
                  <strong className="text-brand-blue">NIH RePORTER:</strong> Used for historical
                  funding baseline data and institutional grant portfolios.
                </p>
              </li>
              <li className="flex items-start">
                <span className="mr-4 mt-1.5 flex h-5 w-5 shrink-0 rounded-full bg-brand-yellow"></span>
                <p className="text-lg text-gray-700">
                  <strong className="text-brand-blue">US Census Bureau:</strong> Demographic and
                  geographic data for mapping impacts to congressional districts.
                </p>
              </li>
              <li className="flex items-start">
                <span className="mr-4 mt-1.5 flex h-5 w-5 shrink-0 rounded-full bg-brand-yellow"></span>
                <p className="text-lg text-gray-700">
                  <strong className="text-brand-blue">United for Medical Research (UMR):</strong>{' '}
                  Economic multiplier data based on their 2024-2025 impact report.
                </p>
              </li>
            </ul>
          </div>

          <hr className="border-t border-gray-200" />

          {/* Spatial Analysis & Geographic Mapping */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-brand-blue md:text-3xl">
              Spatial Analysis & Geographic Mapping
            </h2>
            <p className="text-lg text-gray-700">Our geographic analysis methodology includes:</p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="mr-4 mt-1.5 flex h-5 w-5 shrink-0 rounded-full bg-brand-yellow"></span>
                <p className="text-lg text-gray-700">
                  Geocoding grant recipient addresses to county and ZIP code levels
                </p>
              </li>
              <li className="flex items-start">
                <span className="mr-4 mt-1.5 flex h-5 w-5 shrink-0 rounded-full bg-brand-yellow"></span>
                <p className="text-lg text-gray-700">
                  Aggregating impacts at multiple geographic scales (county, congressional district,
                  state)
                </p>
              </li>
              <li className="flex items-start">
                <span className="mr-4 mt-1.5 flex h-5 w-5 shrink-0 rounded-full bg-brand-yellow"></span>
                <p className="text-lg text-gray-700">
                  Mapping funding distribution patterns and identifying regional disparities
                </p>
              </li>
              <li className="flex items-start">
                <span className="mr-4 mt-1.5 flex h-5 w-5 shrink-0 rounded-full bg-brand-yellow"></span>
                <p className="text-lg text-gray-700">
                  Analyzing urban-rural differences in research funding and impact
                </p>
              </li>
            </ul>
          </div>

          <hr className="border-t border-gray-200" />

          {/* Transparency & Validation */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-brand-blue md:text-3xl">
              Transparency & Validation
            </h2>
            <p className="text-lg text-gray-700">
              We maintain rigorous standards for transparency and accuracy:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="mr-4 mt-1.5 flex h-5 w-5 shrink-0 rounded-full bg-brand-yellow"></span>
                <p className="text-lg text-gray-700">
                  All data sources are publicly available and documented
                </p>
              </li>
              <li className="flex items-start">
                <span className="mr-4 mt-1.5 flex h-5 w-5 shrink-0 rounded-full bg-brand-yellow"></span>
                <p className="text-lg text-gray-700">
                  Economic models and multipliers are based on peer-reviewed research
                </p>
              </li>
              <li className="flex items-start">
                <span className="mr-4 mt-1.5 flex h-5 w-5 shrink-0 rounded-full bg-brand-yellow"></span>
                <p className="text-lg text-gray-700">
                  Assumptions and limitations are clearly stated
                </p>
              </li>
              <li className="flex items-start">
                <span className="mr-4 mt-1.5 flex h-5 w-5 shrink-0 rounded-full bg-brand-yellow"></span>
                <p className="text-lg text-gray-700">
                  Results are validated against independent estimates where available
                </p>
              </li>
              <li className="flex items-start">
                <span className="mr-4 mt-1.5 flex h-5 w-5 shrink-0 rounded-full bg-brand-yellow"></span>
                <p className="text-lg text-gray-700">
                  Methods and calculations are open to peer review
                </p>
              </li>
            </ul>
          </div>

          <hr className="border-t border-gray-200" />

          {/* Limitations & Considerations */}
          <div className="rounded-xl border border-brand-yellow bg-white p-8 shadow-sm md:p-10">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-brand-blue md:text-3xl">
                Limitations & Considerations
              </h2>
              <p className="text-lg text-gray-700">
                Like all analytical approaches, our methodology has inherent limitations:
              </p>
              <div className="space-y-4 pl-4 text-lg text-gray-700 md:pl-8">
                <p>
                  Economic multipliers are estimates based on historical data and may not capture
                  unique local conditions
                </p>
                <p>
                  Our analysis focuses on quantifiable economic impacts and does not capture all
                  social benefits of research
                </p>
                <p>Funding cut impacts may take time to fully materialize as grants phase out</p>
                <p>
                  Geographic assignment relies on institutional addresses, which may not reflect all
                  project locations
                </p>
                <p>
                  Long-term innovation impacts and scientific discovery effects are difficult to
                  quantify
                </p>
              </div>
            </div>
          </div>

          {/* Contact Box */}
          <div className="rounded-xl bg-[#eef5f9] p-8 text-center italic md:p-10">
            <p className="text-lg text-gray-700">
              For detailed technical documentation, data sources, and calculation methods, please
              contact our research team at{' '}
              <a
                href="mailto:contact@scienceimpacts.org"
                className="font-medium text-brand-blue hover:underline"
              >
                contact@scienceimpacts.org
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
