import {TOTAL_JOB_LOSS, TOTAL_LOSS} from "./data/state-losses.ts";

export const ANALYTICS_ACTIONS = {
    action: 'Action',
    pageView: 'Page View',
    consent: 'Consent',
}


export const JOBS_LOST = TOTAL_JOB_LOSS
export const ECONOMIC_LOSS = TOTAL_LOSS;

export const formattedJobs = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short'
}).format(JOBS_LOST);

export const formattedCost = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short'
}).format(ECONOMIC_LOSS);