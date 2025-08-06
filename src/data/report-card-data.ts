import {processPoliticianName} from "../utils/info.ts";
import {getHouseRep, getSenators} from "./legislature.ts";
import reportCardData from "./report_card_info.json"

/**
 * Represents the geographical bounding box with minimum and maximum latitude and longitude.
 */
interface Bounds {
    min_lng: number;
    min_lat: number;
    max_lng: number;
    max_lat: number;
}

export interface TopImpact {
    org_name: string;
    terminated_loss: number;
    terminated_econ_loss: number;
    terminated_job_loss: number;
    IDC_loss: number;
    IDC_econ_loss: number;
    IDC_job_loss: number;
}

/**
 * Represents the comprehensive data for a congressional district.
 */
type DistrictData = {
    district_bounds: Bounds;
    state_bounds: Bounds;
    top_five_impact: TopImpact[];
    state: string;
    state_code: string;
    GEOID: number;
    terminated_loss: number;
    terminated_loss_noself: number;
    terminated_econ_loss: number;
    terminated_job_loss: number;
    terminated_econ_loss_noself: number;
    terminated_job_loss_noself: number;
    IDC_loss: number;
    IDC_econ_loss: number;
    IDC_job_loss: number;
    grant_funds: number;
    grant_funds_econ: number;
    overlap_loss: number;
    overlap_econ_loss: number;
    overlap_job_loss: number;
    overlap_loss_noself: number;
    overlap_econ_loss_noself: number;
    overlap_job_loss_noself: number;
    combined_loss: number;
    combined_econ_loss: number;
    combined_job_loss: number;
    combined_loss_noself: number;
    terminated_loss_log: number;
    terminated_loss_noself_log: number;
    terminated_econ_loss_log: number;
    terminated_job_loss_log: number;
    terminated_econ_loss_noself_log: number;
    terminated_job_loss_noself_log: number;
    IDC_loss_log: number;
    IDC_econ_loss_log: number;
    IDC_job_loss_log: number;
    grant_funds_log: number;
    grant_funds_econ_log: number;
    combined_loss_log: number;
    combined_econ_loss_log: number;
    combined_job_loss_log: number;
    combined_loss_noself_log: number;
    rep_name: string;
    pol_party: string;
    CD118FP: string;
}

export function getAvailableDistricts() {
    const districtsByState: {
        [state: string]: string[];
    } = {};
    Object.keys(reportCardData).forEach(key => {
        // @ts-expect-error: district data is dynamically generated
        const districtData =  reportCardData[key] as DistrictData;
        const state = districtData.state;
        const districtId = districtData.CD118FP;
        if (!districtsByState[state]) {
            districtsByState[state] = [];
        }
        districtsByState[state].push(districtId);
    });
    return districtsByState;
}


export function getStateNameToCodeMapping(): Record<string, string> {
    const mapping: Record<string, string> = {};
    Object.values(reportCardData).forEach((districtData: any) => {
        mapping[districtData.state] = districtData.state_code;
    });
    return mapping;
}


export function getReportCardData({
                                      stateCode,
                                      districtId
                                  }: {
                                      stateCode: string;
                                      districtId: string;
                                  }
): DistrictData & {
    processedRepName: string;
    processedJuniorSenator: string;
    processedSeniorSenator: string;
} | null {
    const key = `${stateCode}-${districtId}`;
    // @ts-expect-error: district data is dynamically generated
    const districtData = reportCardData[key] as DistrictData || null;
    if (!districtData) {
        return null;
    }
    const rep = getHouseRep(key);
    const senators = getSenators(stateCode);
    const repName = processPoliticianName(rep.name, rep.party);

    return {
        ...districtData,
        processedRepName: repName,
        processedJuniorSenator: processPoliticianName(senators.junior.name, senators.junior.party),
        processedSeniorSenator: processPoliticianName(senators.senior.name, senators.senior.party),
    };
}