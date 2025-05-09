import {TOTAL_JOB_LOSS, TOTAL_LOSS} from "./data/state-losses.ts";

export const ANALYTICS_ACTIONS = {
    action: 'Action',
    experiment: "Experiment",
    pageView: 'Page View',
    consent: 'Consent',
    layer: 'Layer',
    condition: 'Condition',
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

export const REACT_APP_PUBLIC_POSTHOG_KEY= "phc_7xCOByPPLiPt1qyRf23Ga7ra7qPrAv6NkIkCn4lkZUH"
export const REACT_APP_PUBLIC_POSTHOG_HOST= "https://us.i.posthog.com"

export type Condition = 'IDC' | 'GRANTS' | 'IDC_GRANTS' | null;

export type BaseLayer = "IDC" | "TERM" | "TOTAL" | "BLANK" | null;
export type Overlay = "GRANTS" | "BLANK" | null;