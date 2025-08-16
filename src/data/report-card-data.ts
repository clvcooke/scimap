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
    budg_NIH_cuts_job_loss: number;
    budg_NIA_cuts: number;
    budg_NIAID_cuts: number;
    budg_NCI_cuts: number;
    budg_NIH_cuts: number;
    budg_NIA_cuts_econ_loss: number;
    budg_NIA_cuts_job_loss: number;
    budg_NIAID_cuts_econ_loss: number;
    budg_NIAID_cuts_job_loss: number;
    budg_NCI_cuts_econ_loss: number;
    budg_NCI_cuts_job_loss: number;
    budg_NIH_cuts_econ_loss: number;
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
    budg_NIH_cuts_econ_loss: number,
    budg_NIH_cuts_job_loss: number,
    budg_NIA_cuts_econ_loss: number,
    budg_NCI_cuts_econ_loss: number,
    budg_NIAID_cuts_econ_loss: number,
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
    CD119FP: string;
}

export function getAvailableDistricts() {
    const districtsByState: {
        [state: string]: string[];
    } = {};
    Object.keys(reportCardData).forEach(key => {
        // @ts-expect-error: district data is dynamically generated
        const districtData = reportCardData[key] as DistrictData;
        const state = districtData.state;
        const districtId = districtData.CD119FP;
        if (!districtsByState[state]) {
            districtsByState[state] = [];
        }
        districtsByState[state].push(districtId);
    });
    return districtsByState;
}


export function getStateNameToCodeMapping(): Record<string, string> {
    const mapping: Record<string, string> = {};
    Object.values(reportCardData).forEach((districtData: DistrictData) => {
        mapping[districtData.state] = districtData.state_code;
    });
    return mapping;
}


export function getReportCardData({
                                      stateCode,
                                      districtId
                                  }: {
    stateCode: string;
    districtId?: string;
}): (DistrictData & {
    processedRepName?: string;
    processedJuniorSenator: string;
    processedSeniorSenator: string;
    country_bounds: Bounds;
}) | null {
    if (districtId) {
        const key = `${stateCode}-${districtId}`;
        // @ts-expect-error: district data is dynamically generated
        const districtData = reportCardData[key] as DistrictData || null;
        if (!districtData) {
            return null;
        }
        const rep = getHouseRep(key);
        const senators = getSenators(stateCode);
        const repName = processPoliticianName(rep?.name, rep?.party);

        return {
            ...districtData,
            processedRepName: repName,
            processedJuniorSenator: processPoliticianName(senators.junior.name, senators.junior.party),
            processedSeniorSenator: processPoliticianName(senators.senior.name, senators.senior.party),
            country_bounds: {
                min_lat: 24.396308,
                max_lat: 49.384358,
                min_lng: -125.0,
                max_lng: -66.93457,
            }
        };
    } else {
        // Aggregate data across all districts in the state
        const stateDistricts = Object.keys(reportCardData).filter(key => key.startsWith(`${stateCode}-`));

        if (stateDistricts.length === 0) {
            return null;
        }

        // Get a representative district for bounds and basic info
        const firstDistrictKey = stateDistricts[0];
        // @ts-expect-error: district data is dynamically generated
        const firstDistrictData = reportCardData[firstDistrictKey] as DistrictData;

        // Aggregate all numeric values across districts
        const aggregatedData: Partial<DistrictData> = {
            state: firstDistrictData.state,
            state_code: firstDistrictData.state_code,
            state_bounds: firstDistrictData.state_bounds,
            terminated_loss: 0,
            terminated_loss_noself: 0,
            terminated_econ_loss: 0,
            terminated_job_loss: 0,
            terminated_econ_loss_noself: 0,
            terminated_job_loss_noself: 0,
            IDC_loss: 0,
            IDC_econ_loss: 0,
            IDC_job_loss: 0,
            budg_NIH_cuts_econ_loss: 0,
            budg_NIH_cuts_job_loss: 0,
            budg_NIA_cuts_econ_loss: 0,
            budg_NCI_cuts_econ_loss: 0,
            budg_NIAID_cuts_econ_loss: 0,
            grant_funds: 0,
            grant_funds_econ: 0,
            overlap_loss: 0,
            overlap_econ_loss: 0,
            overlap_job_loss: 0,
            overlap_loss_noself: 0,
            overlap_econ_loss_noself: 0,
            overlap_job_loss_noself: 0,
            combined_loss: 0,
            combined_econ_loss: 0,
            combined_job_loss: 0,
            combined_loss_noself: 0,
            terminated_loss_log: 0,
            terminated_loss_noself_log: 0,
            terminated_econ_loss_log: 0,
            terminated_job_loss_log: 0,
            terminated_econ_loss_noself_log: 0,
            terminated_job_loss_noself_log: 0,
            IDC_loss_log: 0,
            IDC_econ_loss_log: 0,
            IDC_job_loss_log: 0,
            grant_funds_log: 0,
            grant_funds_econ_log: 0,
            combined_loss_log: 0,
            combined_econ_loss_log: 0,
            combined_job_loss_log: 0,
            combined_loss_noself_log: 0,
        };

        // Map to accumulate institution data across districts
        const institutionMap = new Map<string, TopImpact>();

        // Sum values across all districts in the state
        stateDistricts.forEach(key => {
            // @ts-expect-error: district data is dynamically generated
            const districtData = reportCardData[key] as DistrictData;

            // Sum all numeric fields
            Object.keys(aggregatedData).forEach(field => {
                if (typeof aggregatedData[field as keyof typeof aggregatedData] === 'number' &&
                    typeof districtData[field as keyof DistrictData] === 'number') {
                    (aggregatedData as any)[field] += districtData[field as keyof DistrictData];
                }
            });

            // Aggregate institution data
            districtData.top_five_impact.forEach(institution => {
                const existing = institutionMap.get(institution.org_name);
                if (existing) {
                    existing.budg_NIH_cuts_job_loss += institution.budg_NIH_cuts_job_loss;
                    existing.budg_NIA_cuts += institution.budg_NIA_cuts;
                    existing.budg_NIAID_cuts += institution.budg_NIAID_cuts;
                    existing.budg_NCI_cuts += institution.budg_NCI_cuts;
                    existing.budg_NIH_cuts += institution.budg_NIH_cuts;
                    existing.budg_NIA_cuts_econ_loss += institution.budg_NIA_cuts_econ_loss;
                    existing.budg_NIA_cuts_job_loss += institution.budg_NIA_cuts_job_loss;
                    existing.budg_NIAID_cuts_econ_loss += institution.budg_NIAID_cuts_econ_loss;
                    existing.budg_NIAID_cuts_job_loss += institution.budg_NIAID_cuts_job_loss;
                    existing.budg_NCI_cuts_econ_loss += institution.budg_NCI_cuts_econ_loss;
                    existing.budg_NCI_cuts_job_loss += institution.budg_NCI_cuts_job_loss;
                    existing.budg_NIH_cuts_econ_loss += institution.budg_NIH_cuts_econ_loss;
                } else {
                    institutionMap.set(institution.org_name, {...institution});
                }
            });
        });

        // Get top 5 institutions by total NIH cuts (you can change this metric if needed)
        const topFiveInstitutions = Array.from(institutionMap.values())
            .sort((a, b) => b.budg_NIH_cuts - a.budg_NIH_cuts)
            .slice(0, 5);

        const senators = getSenators(stateCode);

        return {
            ...(aggregatedData as DistrictData),
            GEOID: 0, // State-level, no specific GEOID
            district_bounds: firstDistrictData.state_bounds, // Use state bounds as district bounds
            top_five_impact: topFiveInstitutions,
            CD119FP: '00', // State-level indicator
            processedJuniorSenator: processPoliticianName(senators.junior.name, senators.junior.party),
            processedSeniorSenator: processPoliticianName(senators.senior.name, senators.senior.party),
            country_bounds: {
                min_lat: 24.396308,
                max_lat: 49.384358,
                min_lng: -125.0,
                max_lng: -66.93457,
            },
        };
    }
}