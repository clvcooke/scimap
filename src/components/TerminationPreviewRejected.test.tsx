import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

async function renderAt(url: string) {
  vi.resetModules()
  window.history.replaceState(null, '', url)
  const fetchSpy = vi.spyOn(globalThis, 'fetch')
  const { TerminationPreviewBanner } = await import('./TerminationPreviewBanner')
  const { TerminationReleaseProvider } = await import('./TerminationReleaseProvider')
  render(
    <>
      <TerminationPreviewBanner />
      <TerminationReleaseProvider>
        <p>Loaded</p>
      </TerminationReleaseProvider>
    </>,
  )
  return {
    fetchSpy,
    banner: screen.getByRole('complementary', { name: 'Termination dataset preview' }),
  }
}

it('shows a rejected ID as text, explains the allowed characters and links to the newest dataset without loading data', async () => {
  const { banner, fetchSpy } = await renderAt(
    `/grants?release=${encodeURIComponent('<img src=x onerror=alert(1)>')}`,
  )
  expect(banner).toHaveTextContent(
    'preview dataset ID is not valid, so it was not loaded: <img src=x onerror=alert(1)>.',
  )
  expect(banner.querySelector('img')).toBeNull()
  expect(banner).toHaveTextContent(
    'starts with a letter or number and otherwise uses only letters, numbers, periods (.), underscores (_) and hyphens (-)',
  )
  expect(within(banner).getByRole('link', { name: 'Open the newest dataset' })).toHaveAttribute(
    'href',
    'https://terminations-candidate.scimap.pages.dev/grants',
  )
  expect(screen.getAllByRole('alert')).toHaveLength(1)
  expect(screen.getByRole('alert')).toHaveTextContent('preview dataset ID is not valid')
  expect(screen.queryByText('Loaded')).toBeNull()
  expect(screen.queryByRole('status')).toBeNull()
  await new Promise((resolve) => setTimeout(resolve, 0))
  expect(fetchSpy).not.toHaveBeenCalled()
})

it('shows every value of an ambiguous override and labels an empty one', async () => {
  const { banner, fetchSpy } = await renderAt('/grants?release=one&release=')
  expect(banner).toHaveTextContent(
    'This link has more than one preview dataset ID, so none was loaded: one, (empty).',
  )
  expect(fetchSpy).not.toHaveBeenCalled()
})
