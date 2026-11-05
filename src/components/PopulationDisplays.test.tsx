import type { ReactNode } from 'react'
import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import type { TileProps } from '@/lib/map-shared'
import SCIMap from './Map'
import DetailDrawer from './DetailDrawer'
import MobileInfoCard from './MobileInfoCard'
import BudgetDrawer from './BudgetDrawer'

const sample = vi.hoisted(() => ({ props: {} as TileProps }))
vi.mock('@/hooks/use-mobile', () => ({ useIsMobile: () => false }))
vi.mock('@/lib/analytics', () => ({ track: vi.fn(), Events: {}, buildGeographyEventProps: () => ({}) }))
vi.mock('./ChoroplethMap', () => ({
  default: ({ renderTooltip }: { renderTooltip: (props: TileProps, level: 'counties') => string }) => (
    <div dangerouslySetInnerHTML={{ __html: renderTooltip(sample.props, 'counties') }} />
  ),
}))
vi.mock('@base-ui/react/drawer', () => {
  const Part = ({ children }: { children?: ReactNode }) => <div>{children}</div>
  return { DrawerPreview: Object.fromEntries(['Root', 'Portal', 'Backdrop', 'Viewport', 'Popup', 'Content', 'Title', 'Close'].map((key) => [key, Part])) }
})

afterEach(cleanup)

it.each([
  { name: 'Guam', state: 'GU', FIPS: '66010', pop_2024: 0 },
  { name: 'San Juan Municipio', state: 'PR', FIPS: '72127' },
])('shows unavailable population in the tooltip for $name', (props) => {
  sample.props = props as TileProps
  render(<SCIMap />)
  expect(screen.getByText('Population: Not available')).toBeInTheDocument()
})

it.each(['Guam', 'San Juan Municipio'])('shows unavailable population in all cards for %s', (name) => {
  const feature = { id: name, properties: { pop_2024: 0, NIH_tot_econ_impact: 1000 } }
  const close = vi.fn()
  const detail = render(<DetailDrawer feature={feature} perCapita={false} onClose={close} />)
  expect(screen.getByText('Population: Not available')).toBeInTheDocument()
  detail.unmount()

  const mobile = render(<MobileInfoCard feature={feature} geoLabel="County" perCapita onClose={close} onSeeMore={close} />)
  expect(screen.getByText('Pop: Not available')).toBeInTheDocument()
  expect(screen.getByText('Per Cap: Not available')).toBeInTheDocument()
  mobile.unmount()

  render(<BudgetDrawer props={{ name, state: name === 'Guam' ? 'GU' : 'PR', FIPS: name === 'Guam' ? '66010' : '72127' }} geoLevel="counties" config={{ stats: () => [], sections: () => [] }} onClose={close} />)
  expect(screen.getByText('Population: Not available')).toBeInTheDocument()
})
