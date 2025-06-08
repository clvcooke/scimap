import STATE_LOSSES_DATA from "./state_total_losses.json"

export const STATE_LOSSES: {
                                 [key: string]: {
                                     idc_loss: number,
                                     term_loss: number,
                                     idc_job_loss: number,
                                     term_job_loss: number,
                                     state_code: string,
                                 }
                             } = STATE_LOSSES_DATA["STATE_LOSSES"]

export const TOTAL_IDC_JOB_LOSS = Object.values(STATE_LOSSES).reduce((acc, state) => acc + state.idc_job_loss, 0);

export const TOTAL_TERM_JOB_LOSS = Object.values(STATE_LOSSES).reduce((acc, state) => acc + state.term_job_loss, 0);
export const TOTAL_IDC_LOSS = Object.values(STATE_LOSSES).reduce((acc, state) => acc + state.idc_loss, 0);
export const TOTAL_TERM_LOSS = Object.values(STATE_LOSSES).reduce((acc, state) => acc + state.term_loss, 0);

export const STATE_ARRAY = Object.keys(STATE_LOSSES);