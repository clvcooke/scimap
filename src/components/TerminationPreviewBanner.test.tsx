import { cleanup, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'

const loaders = vi.hoisted(() => {
  window.history.replaceState(null, '', '/grants?release=test-pinned')
  return { loadDefault: vi.fn(), loadPinned: vi.fn() }
})
vi.mock('@/lib/termination-release', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/termination-release')>()),
  loadTerminationRelease: loaders.loadDefault,
  loadTerminationReleaseById: loaders.loadPinned,
}))
import { TerminationPreviewBanner } from './TerminationPreviewBanner'
import { TerminationReleaseProvider } from './TerminationReleaseProvider'
import { useTerminationRelease } from '@/lib/termination-release-context'

function Consumer() {
  return <p>Loaded {useTerminationRelease().manifest.release_id}</p>
}

it('shows the entry URL pin and keeps both routes on it after client navigation drops the query', async () => {
  loaders.loadPinned.mockResolvedValue({ manifest: { release_id: 'test-pinned' } })
  render(
    <>
      <TerminationPreviewBanner />
      <TerminationReleaseProvider>
        <Consumer />
      </TerminationReleaseProvider>
    </>,
  )
  expect(
    screen.getByRole('complementary', { name: 'Termination dataset preview' }),
  ).toHaveTextContent('Previewing dataset test-pinned')
  expect(screen.getByRole('link', { name: 'Open default dataset' })).toHaveAttribute(
    'href',
    '/grants',
  )
  expect(await screen.findByText('Loaded test-pinned')).toBeInTheDocument()

  cleanup()
  window.history.pushState(null, '', '/maps')
  render(
    <TerminationReleaseProvider>
      <Consumer />
    </TerminationReleaseProvider>,
  )
  expect(await screen.findByText('Loaded test-pinned')).toBeInTheDocument()
  expect(loaders.loadPinned).toHaveBeenCalledExactlyOnceWith('test-pinned')
  expect(loaders.loadDefault).not.toHaveBeenCalled()
})
