import { describe, expect, it } from 'vitest'
import { expandGrants, type GrantTermination } from '@/data/grant-losses'

const grant: GrantTermination = {
  org_name: 'Example University', lat: 1, lon: 2,
  terminated_loss: 100, terminated_num: 1, terminated_loss_noself: 100,
  nih_loss: 2e-10, nih_num: 0, nsf_loss: 100, nsf_num: 1,
}

describe('institution grant expansion', () => {
  it('does not show a restored NIH award as an active NIH grant', () => {
    expect(expandGrants([grant], 'nih')).toEqual([])
    expect(expandGrants([grant], 'nsf')).toHaveLength(1)
    expect(expandGrants([grant], 'both')).toHaveLength(1)
  })

  it('suppresses sub-half-cent residues even if the source count is positive', () => {
    expect(expandGrants([{ ...grant, terminated_loss: 2e-10 }], 'both')).toEqual([])
  })

  it('preserves real grant counts and allocates funding across their markers', () => {
    const points = expandGrants([{ ...grant, nih_loss: 8, nih_num: 2 }], 'nih')
    expect(points).toHaveLength(2)
    expect(points.reduce((sum, point) => sum + point.terminated_loss, 0)).toBe(8)
  })

  it('does not fabricate markers from invalid counts', () => {
    expect(expandGrants([{ ...grant, terminated_num: 0 }], 'both')).toEqual([])
    expect(expandGrants([{ ...grant, terminated_num: 1.5 }], 'both')).toEqual([])
  })
})
