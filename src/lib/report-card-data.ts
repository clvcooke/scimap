import reportCardDataFy26 from '@/data/report_card_info_fy26.json'
import reportCardDataFy27 from '@/data/report_card_info_fy27.json'
import stateReportCardDataFy27 from '@/data/state_report_card_info_fy27.json'
import { getHouseRep, getSenatorsList, formatPoliticianName } from './legislature'

interface Bounds {
  min_lng: number
  min_lat: number
  max_lng: number
  max_lat: number
}

export interface TopImpact {
  org_name: string
  budg_NIH_cuts_econ_loss: number
  budg_NIH_cuts_job_loss: number
  budg_NIA_cuts_econ_loss: number
  budg_NCI_cuts_econ_loss: number
  budg_NIAID_cuts_econ_loss: number
}

export interface ReportCardDistrict {
  district_bounds: Bounds
  state_bounds: Bounds
  top_five_impact: TopImpact[]
  state: string
  state_code: string
  GEOID: number
  CD119FP: string
  budg_NIH_cuts_econ_loss: number
  budg_NIH_cuts_job_loss: number
  budg_NSF_cuts_econ_loss?: number
  budg_total_cuts_econ_loss?: number
  budg_NIA_cuts_econ_loss: number
  budg_NCI_cuts_econ_loss: number
  budg_NIAID_cuts_econ_loss: number
}

export interface ReportCardData extends ReportCardDistrict {
  representativeName: string | null
  juniorSenator: string
  seniorSenator: string
}

export type FiscalYear = 'fy26' | 'fy27'

const dataByFy: Record<FiscalYear, Record<string, ReportCardDistrict>> = {
  fy26: reportCardDataFy26 as Record<string, ReportCardDistrict>,
  fy27: reportCardDataFy27 as Record<string, ReportCardDistrict>,
}

export function getReportCardData(
  stateCode: string,
  districtId: string,
  fiscalYear: FiscalYear = 'fy26',
): ReportCardData | null {
  const data = dataByFy[fiscalYear]
  const key = `${stateCode}-${districtId}`
  const district = data[key]
  if (!district) return null

  const rep = getHouseRep(key)
  const senators = getSenatorsList(stateCode)

  return {
    ...district,
    representativeName: rep ? formatPoliticianName(rep.name, rep.party) : null,
    juniorSenator: senators[0]
      ? formatPoliticianName(senators[0].name, senators[0].party)
      : 'N/A',
    seniorSenator: senators[1]
      ? formatPoliticianName(senators[1].name, senators[1].party)
      : 'N/A',
  }
}

export function getAvailableDistricts(fiscalYear: FiscalYear = 'fy26'): Record<string, string[]> {
  const data = dataByFy[fiscalYear]
  const result: Record<string, string[]> = {}
  for (const [, v] of Object.entries(data)) {
    const state = v.state
    if (!result[state]) result[state] = []
    result[state].push(v.CD119FP)
  }
  return result
}

// ── State-level report cards ──────────────────────────────────────────

export interface StateReportCardEntry {
  state: string
  state_code: string
  state_bounds: Bounds
  budg_NIH_cuts_econ_loss: number
  budg_NIH_cuts_job_loss: number
  budg_NSF_cuts_econ_loss: number
  budg_total_cuts_econ_loss: number
  budg_NIA_cuts_econ_loss: number
  budg_NCI_cuts_econ_loss: number
  budg_NIAID_cuts_econ_loss: number
  top_five_impact: TopImpact[]
}

export interface StateReportCardData extends StateReportCardEntry {
  juniorSenator: string
  seniorSenator: string
}

// FY26 state data isn't generated yet; only FY27 has state-level cards.
const stateDataByFy: Partial<Record<FiscalYear, Record<string, StateReportCardEntry>>> = {
  fy27: stateReportCardDataFy27 as Record<string, StateReportCardEntry>,
}

export function getStateReportCardData(
  stateCode: string,
  fiscalYear: FiscalYear = 'fy27',
): StateReportCardData | null {
  const data = stateDataByFy[fiscalYear]
  const entry = data?.[stateCode]
  if (!entry) return null

  const senators = getSenatorsList(stateCode)
  return {
    ...entry,
    juniorSenator: senators[0]
      ? formatPoliticianName(senators[0].name, senators[0].party)
      : 'N/A',
    seniorSenator: senators[1]
      ? formatPoliticianName(senators[1].name, senators[1].party)
      : 'N/A',
  }
}
