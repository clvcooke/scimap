import GRANT_LOSS_DATA from './terminated_grants.json'

export interface GrantTermination {
  [key: string]: unknown
  org_name: string
  lat: number
  lon: number
  terminated_loss: number
  terminated_num: number
  terminated_loss_noself: number
  nih_loss: number
  nih_num: number
  nsf_loss: number
  nsf_num: number
}

export const GRANT_LOSSES: GrantTermination[] = GRANT_LOSS_DATA.GRANT_LOSSES as unknown as GrantTermination[]

export function expandGrants(grants: GrantTermination[], agency: 'nih' | 'nsf' | 'both'): GrantTermination[] {
  return grants.flatMap((grant) => {
    const num = agency === 'nih' ? grant.nih_num : agency === 'nsf' ? grant.nsf_num : grant.terminated_num
    const loss = agency === 'nih' ? grant.nih_loss : agency === 'nsf' ? grant.nsf_loss : grant.terminated_loss
    const n = Math.max(num, 1)
    if (n > 1) {
      return Array(n).fill({ ...grant, terminated_loss: loss / n }) as GrantTermination[]
    }
    return [{ ...grant, terminated_loss: loss }]
  })
}
