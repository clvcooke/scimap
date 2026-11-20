import { act, render, screen, cleanup } from '@testing-library/react'
import { it, expect, vi } from 'vitest'
import type { TerminationRelease } from '@/lib/termination-release'

const loading = vi.hoisted(() => ({ load: vi.fn() }))
vi.mock('@/lib/termination-release', () => ({ loadTerminationRelease: loading.load }))
import { TerminationReleaseProvider } from './TerminationReleaseProvider'
import { useTerminationRelease } from '@/lib/termination-release-context'

function Consumer() {
  return <p>{useTerminationRelease().manifest.release_id}</p>
}
it('shares a fixed session selection across consumers and route remounts, discarding unmounted consumers', async () => {
  let resolve: (release: TerminationRelease) => void = () => undefined
  loading.load.mockReturnValue(
    new Promise<TerminationRelease>((done) => {
      resolve = done
    }),
  )
  const first = render(
    <TerminationReleaseProvider
      fallback={(status) => (
        <>
          <h1>Grant Terminations Map</h1>
          {status}
        </>
      )}
    >
      <Consumer />
    </TerminationReleaseProvider>,
  )
  expect(screen.getByRole('status')).toHaveTextContent('Loading')
  expect(screen.getByRole('heading', { name: 'Grant Terminations Map' })).toBeInTheDocument()
  first.unmount()
  render(
    <TerminationReleaseProvider>
      <Consumer />
      <Consumer />
    </TerminationReleaseProvider>,
  )
  await act(async () => {
    resolve({ manifest: { release_id: 'session-a' } } as TerminationRelease)
  })
  expect(screen.getAllByText('session-a')).toHaveLength(2)
  expect(loading.load).toHaveBeenCalledTimes(1)
  cleanup()
  render(
    <TerminationReleaseProvider>
      <Consumer />
    </TerminationReleaseProvider>,
  )
  await act(async () => {
    await Promise.resolve()
  })
  expect(screen.getByText('session-a')).toBeInTheDocument()
  expect(loading.load).toHaveBeenCalledTimes(1)
})
