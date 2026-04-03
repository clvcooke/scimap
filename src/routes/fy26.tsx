import { createFileRoute } from '@tanstack/react-router'
import FY26Map from '../components/FY26Map'

export const Route = createFileRoute('/fy26')({
  component: FY26Route,
})

function FY26Route() {
  return (
    <>
      <div className="relative w-full min-h-[calc(100vh-140px)]">
        <FY26Map />
      </div>

      <section className="w-full bg-gray-50 px-3 py-6 md:px-6 md:py-10">
        <div className="mx-auto max-w-7xl rounded-xl border border-gray-200 bg-white px-4 py-5 shadow-sm md:px-8 md:py-7">
          <h3 className="text-lg font-semibold text-gray-900">About This Data</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-gray-600">
            This map shows the projected economic impact of the White House FY2026 NIH budget
            proposal, including losses to cancer research (NCI), aging research (NIA), and
            infectious disease research (NIAID) across every congressional district and state.
          </p>
          <div className="mt-4 flex flex-wrap items-baseline gap-2 text-sm">
            <span className="font-medium text-gray-500">Data Sources</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-600">NIH RePORTER</span>
            <span className="text-gray-300">&middot;</span>
            <span className="text-gray-600">Congressional Budget Office</span>
          </div>
        </div>
      </section>
    </>
  )
}
