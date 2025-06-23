import {TOTAL_IDC_JOB_LOSS, TOTAL_IDC_LOSS, TOTAL_TERM_JOB_LOSS, TOTAL_TERM_LOSS} from "./data/state-losses.ts";

export const ANALYTICS_ACTIONS = {
    action: 'Action',
    experiment: "Experiment",
    pageView: 'Page View',
    consent: 'Consent',
    layer: 'Layer',
    condition: 'Condition',
    readReport: 'Read Report',
    downloadReport: 'Download Report',
}


export const NUMBER_FORMATTER = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short'
});

export const NUMBER_FORMATTER_LONG = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'long'
});

export const formattedJobs = NUMBER_FORMATTER.format(TOTAL_IDC_JOB_LOSS);
export const formattedTermJobs = NUMBER_FORMATTER.format(TOTAL_TERM_JOB_LOSS);
export const formattedCost = NUMBER_FORMATTER.format(TOTAL_IDC_LOSS);
export const formattedTermCost = NUMBER_FORMATTER.format(TOTAL_TERM_LOSS)

export const REACT_APP_PUBLIC_POSTHOG_KEY= "phc_7xCOByPPLiPt1qyRf23Ga7ra7qPrAv6NkIkCn4lkZUH"
export const REACT_APP_PUBLIC_POSTHOG_HOST= "https://posthog.scienceimpacts.org"

export type Condition = 'IDC' | 'GRANTS' | 'IDC_GRANTS' | null;

export type BaseLayer = "IDC" | "TERM" | "TOTAL" | "BLANK" | null;
export type Overlay = "GRANTS" | "BLANK" | null;

export const STATE_LAYER_LINK = "https://data.scienceimpacts.org/tiles_states_budget_v1/{z}/{x}/{y}.pbf"