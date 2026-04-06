import { createFileRoute } from '@tanstack/react-router'
import ReportCard from '@/components/ReportCard'
import { getReportCardData } from '@/lib/report-card-data'

interface ScorecardSearch {
  stateCode?: string
  districtId?: string
}

export const Route = createFileRoute('/scorecard')({
  component: ScorecardRoute,
  validateSearch: (search: Record<string, unknown>): ScorecardSearch => ({
    stateCode: typeof search.stateCode === 'string' ? search.stateCode : undefined,
    districtId: typeof search.districtId === 'string' ? search.districtId : undefined,
  }),
})

function ScorecardRoute() {
  const { stateCode, districtId } = Route.useSearch()

  if (!stateCode || !districtId) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">SCIMaP Scorecard</h1>
        <p className="mt-2 text-gray-500">
          Select a congressional district on the{' '}
          <a href="/fy26" className="text-blue-600 underline">
            FY26 Budget Impact map
          </a>{' '}
          to generate a scorecard.
        </p>
      </div>
    )
  }

  const data = getReportCardData(stateCode, districtId)

  if (!data) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">District Not Found</h1>
        <p className="mt-2 text-gray-500">
          No data found for {stateCode}-{districtId}. Try selecting a different district from the{' '}
          <a href="/fy26" className="text-blue-600 underline">
            FY26 Budget Impact map
          </a>
          .
        </p>
      </div>
    )
  }

  return <ReportCard data={data} />
}
