import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Route } from './index'
import homepageContent from '@/content/homepage.json'

// Mock the SCIMap component since we're just testing the sidebar content here
vi.mock('@/components/Map', () => ({
  default: () => <div data-testid="mock-scimap">Mocked Map</div>
}))

describe('Index Route Component', () => {
  it('renders content from keystatic homepage.json', () => {
    // Need to render the component from the Route object
    const Component = Route.options.component
    if (!Component) throw new Error('Component not found')
    render(<Component />)

    // Check main title
    expect(screen.getByText(homepageContent.title)).toBeInTheDocument()

    // Check main description
    expect(screen.getByText(homepageContent.description)).toBeInTheDocument()

    // Check default tab content (Cancelled & Frozen)
    expect(screen.getByText(homepageContent.cancelledTabTitle)).toBeInTheDocument()
    expect(screen.getByText(homepageContent.cancelledTabDescription)).toBeInTheDocument()
  })
})
