export const ANALYTICS_ACTIONS = {
    action: 'Action',
    pageView: 'Page View',
    consent: 'Consent',
}


export const JOBS_LOST = 196795.37706808883
export const ECONOMIC_LOSS = 17711583936.12799;

export const formattedJobs = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short'
}).format(JOBS_LOST);

export const formattedCost = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short'
}).format(ECONOMIC_LOSS);