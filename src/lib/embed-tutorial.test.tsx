import { afterEach, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { Route } from '@/routes/embed'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

it('lets partners clear and retype the height without inserting a leading zero', async () => {
  vi.spyOn(Route, 'useSearch').mockReturnValue({ map: 'grants' })
  const Tutorial = Route.options.component!
  await act(async () => { render(<Tutorial />) })
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
})
