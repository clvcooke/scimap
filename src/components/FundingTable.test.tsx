import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import * as csv from '@/lib/csv'
import FundingTable from './FundingTable'

vi.mock('@/data/table_counties.json', () => {
  const funding = { nih_econ_impact: 100, nih_raw_funding: 50, nih_jobs: 20, nsf_econ_impact: 100, nsf_raw_funding: 50, total_econ_impact: 200, total_raw_funding: 100 }
  return { default: [
    { ...funding, id: '01001', name: 'Autauga County', pop_2024: 61464 },
    { ...funding, id: '66010', name: 'Guam', pop_2024: null },
    { ...funding, id: '38007', name: 'Billings County', pop_2024: 1000 },
  ] }
})

vi.mock('@/data/table_states.json', () => ({ default: [
  { id: 'AL', name: 'Alabama', pop_2024: 5157699, nih_econ_impact: 100, nih_raw_funding: 50, nih_jobs: 20, nsf_econ_impact: 100, nsf_raw_funding: 50, total_econ_impact: 200, total_raw_funding: 100 },
] }))

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

it('only shows the population note for a tab with missing values', () => {
  render(<FundingTable />)
  expect(screen.getByText(/Not available means/)).toBeInTheDocument()
  fireEvent.click(screen.getByRole('tab', { name: 'State' }))
  expect(screen.queryByText(/Not available means/)).not.toBeInTheDocument()
})

it('labels missing populations honestly, sorts them last and exports them as blank', () => {
  const download = vi.spyOn(csv, 'downloadCsv').mockImplementation(() => undefined)
  render(<FundingTable />)
  const missingRow = screen.getByText('Guam, GU').closest('tr')!
  expect(within(missingRow).getByText('Not available')).toBeInTheDocument()
  expect(within(missingRow).queryByText('<10')).not.toBeInTheDocument()

  const population = screen.getByRole('columnheader', { name: 'Population' })
  for (const first of ['Autauga County, AL', 'Billings County, ND']) {
    fireEvent.click(population)
    const rows = screen.getAllByRole('row').slice(2)
    expect(rows[0]).toHaveTextContent(first)
    expect(rows.at(-1)).toHaveTextContent('Guam, GU')
  }

  fireEvent.click(screen.getByRole('button', { name: /Download CSV/ }))
  expect(download).toHaveBeenCalledOnce()
  const exported = download.mock.calls[0][0]
  expect(exported.split('\r\n').find((line) => line.startsWith('66010,'))).toMatch(/,$/)
  expect(exported).not.toContain('null')
})
