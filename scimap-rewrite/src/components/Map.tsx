import { useState, useMemo } from 'react'
import { Map } from 'react-map-gl/maplibre'
import DeckGL from '@deck.gl/react'
import { MVTLayer } from '@deck.gl/geo-layers'
import { scaleLinear, type ScaleLinear } from 'd3-scale'
import { interpolateOrRd } from 'd3-scale-chromatic'
import 'maplibre-gl/dist/maplibre-gl.css'

const domain = 'https://data.scienceimpacts.org'
const TILE_VERSION_NUMBER = '2025-06-12'
const totalTilesCounties = `${domain}/tiles_counties_total_v${TILE_VERSION_NUMBER}-v2/{z}/{x}/{y}.pbf`

const ALPHA_COLOR = 200
const COUNTY_DOMAIN: [number, number] = [0, 25_000_000]

// In deck.gl 9, MapViewState type might not be directly exported or needed like this
interface ViewState {
  longitude: number
  latitude: number
  zoom: number
  pitch?: number
  bearing?: number
}

type TileProperties = Record<string, number>;

function generateMapLayer({
  tileLink,
  uniqueProperty,
  colorScale,
  colorProperties,
}: {
  tileLink: string
  uniqueProperty: string
  colorScale: ScaleLinear<number, number>
  colorProperties: string[]
}) {
  return new MVTLayer({
    id: 'xyz-mvt',
    data: [tileLink],
    binary: true,
    getLineColor: [255, 255, 255, ALPHA_COLOR / 3],
    lineWidthMinPixels: 1,
    pickable: true,
    uniqueIdProperty: uniqueProperty,
    maxZoom: 7,
    // @ts-expect-error deck.gl types are complex
    getFillColor: (feature: { id: string; properties: TileProperties }) => {
      const value = Math.log(
        colorProperties
          .map((p) => feature.properties[p] ?? 0)
          .reduce((previous, current) => previous + current, 0),
      )

      const colorString = interpolateOrRd(colorScale(value))

      let rgbValues
      if (colorString.startsWith('rgb')) {
        rgbValues = colorString
          .slice(4, -1)
          .split(',')
          .map((str) => parseInt(str.trim(), 10))
      } else {
        const hex = colorString.slice(1) // Remove #
        rgbValues = [
          parseInt(hex.slice(0, 2), 16),
          parseInt(hex.slice(2, 4), 16),
          parseInt(hex.slice(4, 6), 16),
        ]
      }
      return [...rgbValues, ALPHA_COLOR] // Add alpha channel
    },
  })
}

export default function SCIMap() {
  const [viewState, setViewState] = useState<ViewState>({
    longitude: -98.5795, // Approximate center longitude of the USA
    latitude: 39.8283, // Approximate center latitude of the USA
    zoom: 3.5, // Adjust the zoom level to fit the continental USA
  })

  const colorScale = useMemo(() => {
    const lower = COUNTY_DOMAIN[0] > 1 ? Math.log(COUNTY_DOMAIN[0]) : 0
    const upper = Math.log(COUNTY_DOMAIN[1])
    return scaleLinear().domain([lower, upper]).range([0, 1]).clamp(true)
  }, [])

  const mapLayer = useMemo(() => {
    return generateMapLayer({
      tileLink: totalTilesCounties,
      uniqueProperty: 'FIPS',
      colorScale,
      colorProperties: ['combined_econ_loss'],
    })
  }, [colorScale])

  return (
    <div className="absolute inset-0 w-full h-full">
      <DeckGL
        viewState={viewState}
        onViewStateChange={({ viewState: newViewState }) => {
          setViewState(newViewState as ViewState)
        }}
        controller={true}
        layers={[mapLayer]}
        getCursor={({ isDragging }) => (isDragging ? 'grabbing' : 'grab')}
      >
        <Map mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" />
      </DeckGL>
    </div>
  )
}
