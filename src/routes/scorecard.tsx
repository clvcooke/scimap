import { createFileRoute } from '@tanstack/react-router'
import ReportCard from '@/components/ReportCard'
import { getReportCardData, type FiscalYear } from '@/lib/report-card-data'

const VALID_FY = new Set<FiscalYear>(['fy26', 'fy27'])

interface ScorecardSearch {
  stateCode?: string | undefined
  districtId?: string | undefined
  fiscalYear?: FiscalYear | undefined
}

export const Route = createFileRoute('/scorecard')({
  component: ScorecardRoute,
  validateSearch: (search: Record<string, unknown>): ScorecardSearch => ({
    stateCode: typeof search.stateCode === 'string' ? search.stateCode : undefined,
    districtId: typeof search.districtId === 'string' ? search.districtId : undefined,
    fiscalYear:
      typeof search.fiscalYear === 'string' && VALID_FY.has(search.fiscalYear as FiscalYear)
        ? (search.fiscalYear as FiscalYear)
        : undefined,
  }),
})

function ScorecardRoute() {
  const { stateCode, districtId, fiscalYear = 'fy26' } = Route.useSearch()
  const fyLabel = fiscalYear === 'fy27' ? 'FY27' : 'FY26'
  const mapRoute = fiscalYear === 'fy27' ? '/fy27' : '/fy26'

  if (!stateCode || !districtId) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">SCIMaP Scorecard</h1>
        <p className="mt-2 text-gray-500">
          Select a congressional district on the{' '}
          <a href={mapRoute} className="text-blue-600 underline">
            {fyLabel} Budget Impact map
          </a>{' '}
          to generate a scorecard.
        </p>
      </div>
    )
  }

  const data = getReportCardData(stateCode, districtId, fiscalYear)

  if (!data) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">District Not Found</h1>
        <p className="mt-2 text-gray-500">
          No data found for {stateCode}-{districtId}. Try selecting a different district from the{' '}
          <a href={mapRoute} className="text-blue-600 underline">
            {fyLabel} Budget Impact map
          </a>
          .
        </p>
      </div>
    )
  }

  return <ReportCard data={data} fiscalYear={fiscalYear} />
}
