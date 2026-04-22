import { createFileRoute } from '@tanstack/react-router'
import ReportCard from '@/components/ReportCard'
import StateReportCard from '@/components/StateReportCard'
import {
  getReportCardData,
  getStateReportCardData,
  type FiscalYear,
} from '@/lib/report-card-data'

const VALID_FY = new Set<FiscalYear>(['fy26', 'fy27'])

interface ScorecardSearch {
  stateCode?: string | undefined
  districtId?: string | undefined
  fiscalYear?: FiscalYear | undefined
  chromeless?: boolean | undefined
}

export const Route = createFileRoute('/scorecard')({
  component: ScorecardRoute,
  // NB: TanStack Router parses search values as JSON, so `districtId=21`
  // arrives here as the number 21 (not "21"). Coerce numeric ids back to
  // zero-padded 2-digit strings so downstream lookups match.
  validateSearch: (search: Record<string, unknown>): ScorecardSearch => ({
    stateCode: typeof search.stateCode === 'string' ? search.stateCode : undefined,
    districtId:
      typeof search.districtId === 'string'
        ? search.districtId
        : typeof search.districtId === 'number'
          ? String(search.districtId).padStart(2, '0')
          : undefined,
    fiscalYear:
      typeof search.fiscalYear === 'string' && VALID_FY.has(search.fiscalYear as FiscalYear)
        ? (search.fiscalYear as FiscalYear)
        : undefined,
    chromeless: search.chromeless === true || search.chromeless === 'true' ? true : undefined,
  }),
})

function ScorecardRoute() {
  const { stateCode, districtId, fiscalYear = 'fy26' } = Route.useSearch()
  const fyLabel = fiscalYear === 'fy27' ? 'FY27' : 'FY26'
  const mapRoute = fiscalYear === 'fy27' ? '/fy27' : '/fy26'

  if (!stateCode) {
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

  // State-only scorecard (no districtId). Only FY27 has state-level data today.
  if (!districtId) {
    const stateData = getStateReportCardData(stateCode, fiscalYear)
    if (!stateData) {
      return (
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">State Scorecard Unavailable</h1>
          <p className="mt-2 text-gray-500">
            No {fyLabel} state-level data for {stateCode}. Pick a district on the{' '}
            <a href={mapRoute} className="text-blue-600 underline">
              {fyLabel} Budget Impact map
            </a>{' '}
            instead.
          </p>
        </div>
      )
    }
    return <StateReportCard data={stateData} fiscalYear={fiscalYear} />
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
