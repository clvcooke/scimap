export const ANALYTICS_ACTIONS = {
    action: 'Action',
    pageView: 'Page View',
}


export const JOBS_LOST = 153712.58056788
export const ECONOMIC_LOSS = 13834132249.184;

export const formattedJobs = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short'
}).format(JOBS_LOST);

export const formattedCost = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short'
}).format(ECONOMIC_LOSS);