import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TerminationReleaseDetails } from './TerminationReleaseProvider'
import { ReleaseContext } from '@/lib/termination-release-context'
import type { TerminationRelease } from '@/lib/termination-release'

function renderDetails(warnings: string[]) {
  const release = {
    manifestUrl: 'https://example.test/manifest.json',
    downloads: [],
    manifest: {
      reporting_week: '2026-10-23',
      as_of: '2026-10-26',
      sources: {
        freshness: {
          'nih_v3_terminations.csv': { latest_event_on_or_before_as_of: '2026-10-20' },
          'nsf_terminations.csv': { latest_event_on_or_before_as_of: '2026-05-13' },
        },
      },
      release_validation: { warnings },
    },
  } as unknown as TerminationRelease
  return render(
    <ReleaseContext.Provider value={release}>
      <TerminationReleaseDetails />
    </ReleaseContext.Provider>,
  )
}
describe('public release details', () => {
  it('deduplicates technical Guam warnings into public coverage copy and labels event dates', () => {
    renderDetails([
      'counties 66010 (Guam) is in the table but on no map tile ($211,390.66 current economic loss)',
      'states GU (GU) is in the table but on no map tile ($211,390.66 current economic loss)',
    ])
    expect(
      screen.getAllByText(
        'Guam appears in tables and downloads but not on the state or county maps.',
      ),
    ).toHaveLength(1)
    expect(screen.queryByText(/66010/)).not.toBeInTheDocument()
    expect(
      screen.getByText(/Latest recorded grant event:.*NIH 2026-10-20.*NSF 2026-05-13/),
    ).toBeInTheDocument()
    expect(screen.getByText(/Data through:/)).toHaveTextContent('2026-10-26')
  })
  it('acknowledges other coverage warnings without publishing raw diagnostics', () => {
    renderDetails(['internal-validator diagnostic 123'])
    expect(screen.getByText(/Some areas have limited map coverage/)).toBeInTheDocument()
    expect(screen.queryByText(/internal-validator/)).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Release information' })).toHaveAttribute(
      'href',
      'https://example.test/manifest.json',
    )
  })
})
