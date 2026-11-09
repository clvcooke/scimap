import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from '@/routeTree.gen'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

it('links to the embedding tool after sharing and provides a direct return to Take Action', async () => {
  vi.stubGlobal('IntersectionObserver', class {
    observe = vi.fn()
    disconnect = vi.fn()
  })
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: ['/take-action'] }) })
  render(<RouterProvider router={router} />)
  const heading = await screen.findByRole('heading', { name: 'Bring SCIMaP to your website' })
  const sharing = screen.getByRole('heading', { name: 'Share with Friends, Family, and Followers' })
  expect(sharing.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  expect(screen.queryByRole('textbox', { name: 'Embed HTML' })).not.toBeInTheDocument()

  const link = screen.getByRole('link', { name: 'Embed a SCIMaP map' })
  expect(new URL(link.getAttribute('href')!, 'https://scienceimpacts.org').pathname).toBe('/embed')
  fireEvent.click(link)
  await screen.findByRole('heading', { name: 'Embed a SCIMaP map' })
  expect(router.state.location.pathname).toBe('/embed')

  const back = screen.getByRole('link', { name: 'Back to Take Action' })
  expect(back).toHaveAttribute('href', '/take-action')
  fireEvent.click(back)
  await screen.findByRole('heading', { name: 'Take Action' })
  expect(router.state.location.pathname).toBe('/take-action')
})
