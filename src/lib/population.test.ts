import { expect, it } from 'vitest'
import { formatNumber, formatPopulation } from './constants'

it('distinguishes unknown populations from small job counts', () => {
  for (const missing of [undefined, null, '', 0, '0', -1, NaN, Infinity, 'NA']) {
    expect(formatPopulation(missing)).toBe('Not available')
  }
  expect(formatPopulation(61464)).toBe('61K')
  expect(formatPopulation('61464')).toBe('61K')
  expect(formatPopulation(5)).toBe('5')
  expect(formatNumber(5)).toBe('<10')
})
