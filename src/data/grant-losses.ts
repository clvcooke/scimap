import GRANT_LOSS_DATA from './terminated_grants.json';

export type GrantTermination = {
    // FIPS: number;
    // reporter_url: string;
    // award_remaining: number | null;
    // terminated_loss: number;
    // terminated_num: number;
    // termination_date: string | null;
    org_name: string;
    // project_title: string;
    // cancellation_source: string;
    lat: number;
    lon: number;
    terminated_loss: number;
    terminated_num: number;
    terminated_loss_noself: number;
    terminated_num_noself?: number;
}


// HACK BECAUSE WE WANT TO SPLIT THE GRANT DATA UP
const grant_losses_2: GrantTermination[] = GRANT_LOSS_DATA["GRANT_LOSSES"];

export const GRANT_LOSSES: GrantTermination[] = grant_losses_2.flatMap(grant => {
    if (grant.terminated_num > 1) {
        return Array(grant.terminated_num).fill({
            ...grant,
            terminated_loss: grant.terminated_loss / grant.terminated_num
        })
    } else {
        return grant;
    }
})
