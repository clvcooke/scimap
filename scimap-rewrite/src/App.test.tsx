import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { RouterProvider, createMemoryHistory, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

describe('App routing', () => {
  it('renders the header and initial tab', async () => {
    // Create a memory history for testing
    const memoryHistory = createMemoryHistory({
      initialEntries: ['/'],
    })

    // Create router instance
    const router = createRouter({
      routeTree,
      history: memoryHistory,
    })

    render(<RouterProvider router={router} />)

    // Verify header
    await waitFor(() => {
      expect(screen.getByText('Science & Community Impacts Mapping Project')).toBeInTheDocument()
    })

    // Verify initial tab content
    expect(screen.getByText('Cancelled and Frozen Grants')).toBeInTheDocument()
  })
})
