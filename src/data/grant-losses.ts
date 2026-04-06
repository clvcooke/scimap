import GRANT_LOSS_DATA from './terminated_grants.json'

export interface GrantTermination {
  [key: string]: unknown
  org_name: string
  lat: number
  lon: number
  terminated_loss: number
  terminated_num: number
  terminated_loss_noself: number
  terminated_num_noself?: number
}

const raw: GrantTermination[] = GRANT_LOSS_DATA.GRANT_LOSSES

export const GRANT_LOSSES: GrantTermination[] = raw.flatMap((grant) => {
  if (grant.terminated_num > 1) {
    return Array(grant.terminated_num).fill({
      ...grant,
      terminated_loss: grant.terminated_loss / grant.terminated_num,
    }) as GrantTermination[]
  }
  return grant
})
