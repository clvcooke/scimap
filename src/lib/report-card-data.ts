import reportCardData from '@/data/report_card_info.json'
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
  budg_NIA_cuts_econ_loss: number
  budg_NCI_cuts_econ_loss: number
  budg_NIAID_cuts_econ_loss: number
}

export interface ReportCardData extends ReportCardDistrict {
  representativeName: string | null
  juniorSenator: string
  seniorSenator: string
}

const data = reportCardData as Record<string, ReportCardDistrict>

export function getReportCardData(
  stateCode: string,
  districtId: string,
): ReportCardData | null {
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

export function getAvailableDistricts(): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  for (const [, v] of Object.entries(data)) {
    const state = v.state
    if (!result[state]) result[state] = []
    result[state].push(v.CD119FP)
  }
  return result
}
