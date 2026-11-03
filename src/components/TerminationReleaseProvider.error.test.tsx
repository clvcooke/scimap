import { render, screen } from '@testing-library/react'
import { it, expect, vi } from 'vitest'
vi.mock('@/lib/termination-release', () => ({
  loadTerminationRelease: vi.fn().mockRejectedValue(new Error('Unavailable source')),
}))
import { TerminationReleaseProvider } from './TerminationReleaseProvider'

it('retains the caller map shell when release loading fails', async () => {
  render(<TerminationReleaseProvider fallback={(status) => <section><h1>Grant Terminations Map</h1>{status}</section>}><p>Loaded map</p></TerminationReleaseProvider>)
  expect(await screen.findByRole('alert')).toHaveTextContent('Termination data could not be loaded')
  expect(screen.getByRole('heading', {name:'Grant Terminations Map'})).toBeInTheDocument()
  expect(screen.queryByText('Loaded map')).not.toBeInTheDocument()
})
