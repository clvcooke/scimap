import { describe, expect, it } from 'vitest'
import {
  createChoroplethLayer,
  createLogColorScale,
  LUT_OR_RD,
  NO_DATA_FILL,
  NO_DATA_MESSAGE,
  isNoData,
  renderNoDataTooltip,
  type MapGeoConfig,
} from './map-shared'

const CONFIG: MapGeoConfig = {
  tileUrl: 'https://example.test/{z}/{x}/{y}.pbf',
  maxZoom: 7,
  uniqueIdProperty: 'state',
  label: 'States',
  domain: [1, 100],
}

function fillOf(properties: Record<string, number | string>) {
  const layer = createChoroplethLayer(CONFIG, createLogColorScale(CONFIG.domain), 'loss', LUT_OR_RD)
  const getFillColor = layer.props.getFillColor as (f: {
    properties: typeof properties
  }) => number[]
  return getFillColor({ properties })
}

describe('no-data territories', () => {
  it('reads the generator marker, including the float the tiles carry', () => {
    expect(isNoData({ no_data: 1 })).toBe(true)
    expect(isNoData({ no_data: 1.0 })).toBe(true)
    expect(isNoData({ loss: 0 })).toBe(false)
    expect(isNoData({})).toBe(false)
  })

  it('fills a no-data territory with the neutral color, not the $0 color', () => {
    const zero = fillOf({ state: 'MD', loss: 0 })
    expect(fillOf({ state: 'GU', no_data: 1 })).toEqual(NO_DATA_FILL)
    expect(zero).not.toEqual(NO_DATA_FILL)
    expect(fillOf({ state: 'VI', loss: 0 })).toEqual(zero)
  })

  it('names the territory in the tooltip and shows no amount', () => {
    const html = renderNoDataTooltip({ state: 'GU', state_code: 'GU', no_data: 1 }, 'states')
    expect(html).toContain('Guam')
    expect(html).toContain(NO_DATA_MESSAGE)
    expect(html).not.toContain('$')
  })
})
