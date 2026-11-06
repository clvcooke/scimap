import { afterEach, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { createMemoryHistory, createRoute, createRouter, RouterProvider } from '@tanstack/react-router'
import { Route } from '@/routes/__root'
import { MapHeader } from '@/components/MapHeader'
import MapAttribution from '@/components/MapAttribution'
import { getPage } from '@/lib/content'

const page = getPage('map-baseline')
const index = createRoute({
  getParentRoute: () => Route,
  path: '/',
  component: () => <><MapHeader page={page} /><p>Map and table content</p><MapAttribution /></>,
})
const routeTree = Route.addChildren([index])

afterEach(() => {
  cleanup()
  window.history.replaceState(null, '', '/')
})

async function renderLayout(query: string) {
  window.history.replaceState(null, '', '/' + query)
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: ['/' + query] }) })
  render(<RouterProvider router={router} />)
  await screen.findByText('Map and table content')
}

it.each([[true, true], [true, false], [false, true], [false, false]])('renders the internal credit only with header=%s and footer=%s both off', async (header, footer) => {
  await renderLayout(`?chromeless=true&embedHeader=${header}&embedFooter=${footer}`)
  expect(screen.queryByRole('banner') !== null).toBe(header)
  expect(screen.queryByRole('heading', { name: page.attrs.title! }) !== null).toBe(header)
  expect(screen.queryByText('Get in Touch') !== null).toBe(footer)
  expect(screen.queryByText(/Credit: Science and Community Impacts Mapping Project,/) !== null).toBe(!header && !footer)
  expect(screen.getByRole('link', { name: 'OpenStreetMap' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'CARTO' })).toBeInTheDocument()
})

it('keeps the full footer and map heading in legacy chromeless embeds', async () => {
  await renderLayout('?chromeless=true')
  expect(screen.queryByRole('banner')).not.toBeInTheDocument()
  expect(screen.getByRole('heading', { name: page.attrs.title! })).toBeInTheDocument()
  expect(screen.getByText('Get in Touch')).toBeInTheDocument()
  expect(screen.queryByText(/Credit:/)).not.toBeInTheDocument()
})

it('does not hide normal-site branding when embed flags lack chromeless mode', async () => {
  await renderLayout('?embedHeader=false&embedFooter=false')
  expect(screen.getByRole('banner')).toBeInTheDocument()
  expect(screen.getByText('Get in Touch')).toBeInTheDocument()
  expect(screen.queryByText(/Credit:/)).not.toBeInTheDocument()
})
