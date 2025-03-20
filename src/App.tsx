import {useCallback, useState} from 'react'
import './App.css'

import { Map } from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import 'maplibre-gl/dist/maplibre-gl.css';
import {MVTLayer} from '@deck.gl/geo-layers';
import {PickingInfo} from '@deck.gl/core';
import {HoverInfo, TileProperties} from "./components/HoverInfoComponent.tsx";
import { scaleLinear } from 'd3-scale';
import { interpolateOrRd } from 'd3-scale-chromatic';

const ALPHA_COLOR = 155;

function App() {
    const [hoveredFeatureId, setHoveredFeatureId] = useState<any | null>(null);

    // Define your data range based on your economic loss values
    const dataMin = 0;
    const dataMax = Math.asinh(10000000); // Adjust this based on your actual max value

    const colorScale = scaleLinear()
        .domain([dataMin, dataMax])
        .range([0, 1])
        .clamp(true); // Makes sure values outside the domain get mapped to the range boundaries


    const layer =  new MVTLayer({
        id: 'xyz-mvt',
        data: [
            `https://pub-68b2412877cd4500a55733977f95cc9f.r2.dev/tiles_simple_v1/{z}/{x}/{y}.pbf`,
        ],
        binary: true, // Try setting this to true
        getLineColor: [192, 192, 192],
        lineWidthMinPixels: 1,
        pickable: true,
        highlightedFeatureId: hoveredFeatureId,
        highlightColor: [127, 255, 212, ALPHA_COLOR],
        uniqueIdProperty: "FIPS",
        // @ts-expect-error comment
        getFillColor: (feature: { id: string, properties: TileProperties }) => {
            const value = Math.asinh(feature.properties.econ_loss_25k);
            const colorString = interpolateOrRd(colorScale(value));
            let rgbValues;
            if (colorString.startsWith('rgb')) {
                // Handle rgb format "rgb(255, 0, 0)"
                rgbValues = colorString.slice(4, -1).split(",").map(str => parseInt(str.trim(), 10));
            } else {
                // Handle hex format from discrete scales "#ff0000"
                const hex = colorString.slice(1); // Remove #
                rgbValues = [
                    parseInt(hex.slice(0, 2), 16),
                    parseInt(hex.slice(2, 4), 16),
                    parseInt(hex.slice(4, 6), 16)
                ];
            }
            return [...rgbValues, ALPHA_COLOR]; // Add alpha channel
        },
        onHover: info => {
            setHoveredFeatureId(info.object ? info.object.properties.FIPS : null);
        }
    });
    const getTooltip = useCallback(({object}: PickingInfo<HoverInfo>) => {
        if (object && object.properties) {
            const { county, econ_loss} = object.properties;
            return `County: ${county} \n Economic Loss: ${econ_loss}`;
        }
        return null;
    }, []);

    return (
        <DeckGL
            initialViewState={{
                longitude: -98.5795, // Approximate center longitude of the USA
                latitude: 39.8283,  // Approximate center latitude of the USA
                zoom: 3.5             // Adjust the zoom level to fit the continental USA
            }}
            controller
            layers={[layer]}
            getTooltip={getTooltip}
        >
            <Map mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" />
        </DeckGL>
    );
}

export default App
