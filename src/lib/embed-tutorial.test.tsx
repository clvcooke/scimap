import { afterEach, expect, it } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from '@/routeTree.gen'

async function renderTutorial() {
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: ['/embed?map=grants'] }) })
  await act(async () => { render(<RouterProvider router={router} />) })
}

afterEach(cleanup)

it('updates generated HTML and the local preview for all header/footer combinations', async () => {
  await renderTutorial()
  const header = await screen.findByRole('switch', { name: 'Include header' })
  const footer = screen.getByRole('switch', { name: 'Include footer' })
  const code = screen.getByRole('textbox', { name: 'Embed HTML' }) as HTMLTextAreaElement
  fireEvent.click(screen.getByRole('button', { name: 'Load live preview' }))
  let previousFrame = screen.getByTitle('SCIMaP grant terminations')
  let previousSrc = previousFrame.getAttribute('src')

  for (const [showHeader, showFooter] of [[true, true], [false, true], [false, false], [true, false], [true, true]]) {
    if (header.getAttribute('aria-checked') !== String(showHeader)) fireEvent.click(header)
    if (footer.getAttribute('aria-checked') !== String(showFooter)) fireEvent.click(footer)
    const markup = document.createElement('div')
    markup.innerHTML = code.value
    const url = new URL(markup.querySelector('iframe')!.getAttribute('src')!)
    expect(url.origin).toBe('https://scienceimpacts.org')
    expect(url.searchParams.get('embedHeader')).toBe(String(showHeader))
    expect(url.searchParams.get('embedFooter')).toBe(String(showFooter))
    const frame = screen.getByTitle('SCIMaP grant terminations')
    expect(frame).toHaveAttribute('src', url.pathname + url.search)
    if (previousSrc !== frame.getAttribute('src')) {
      expect(frame).not.toBe(previousFrame)
      expect(previousFrame.isConnected).toBe(false)
    }
    expect(screen.getByRole('button', { name: 'Hide preview' })).toBeInTheDocument()
    previousFrame = frame
    previousSrc = frame.getAttribute('src')
    expect(code.value).not.toContain('Credit:')
  }
})

it('allows clear/retype but rejects non-positive, fractional and unsafe heights', async () => {
  await renderTutorial()
  const input = await screen.findByRole('spinbutton', { name: 'Height in pixels' }) as HTMLInputElement
  const code = screen.getByRole('textbox', { name: 'Embed HTML' }) as HTMLTextAreaElement

  fireEvent.change(input, { target: { value: '' } })
  expect(input.value).toBe('')
  expect(code.value).toContain('height="500"')

  for (const value of ['7', '70', '700']) {
    fireEvent.change(input, { target: { value } })
    expect(input.value).toBe(value)
  }
  expect(code.value).toContain('height="700"')

  fireEvent.change(input, { target: { value: '2000' } })
  expect(code.value).toContain('height="1600"')

  for (const value of ['-1', '-500', '0', '0.5', '500.5', '9007199254740992']) {
    fireEvent.change(input, { target: { value } })
    expect(input.value).toBe('2000')
    expect(code.value).toContain('height="1600"')
  }

  fireEvent.change(input, { target: { value: '' } })
  expect(input.value).toBe('')
  fireEvent.change(input, { target: { value: '600' } })
  expect(input.value).toBe('600')
  expect(code.value).toContain('height="600"')
})
