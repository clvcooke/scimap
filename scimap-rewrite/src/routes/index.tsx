import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#003366] w-full relative">
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
              <Button className="bg-[#FFB81C] hover:bg-[#e6a619] text-[#003366] font-bold text-lg px-8 py-6 rounded-md">
                View the Map
              </Button>
              <Button
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 hover:text-white font-bold text-lg px-8 py-6 rounded-md bg-transparent"
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
          <h2 className="text-3xl font-bold text-[#003366]">What&apos;s At Stake</h2>

          <div className="text-xl text-gray-700 leading-relaxed space-y-6">
            <p>
              Federal investment in science and research drives innovation, creates jobs, and
              supports critical infrastructure in communities across the United States.
            </p>
            <p>
              The proposed <strong className="text-[#003366]">FY2026 Budget</strong> cuts would
              reduce funding to the National Institutes of Health (NIH) and other key agencies by up
              to <strong className="text-[#003366]">22%</strong>.
            </p>
            <p>
              Additionally, caps on <strong className="text-[#003366]">Indirect Costs (15%)</strong>{' '}
              will severely restrict the ability of universities and research institutions to
              maintain facilities and support staff, leading to cancelled projects and hiring
              freezes.
            </p>
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
