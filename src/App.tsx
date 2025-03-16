import {useCallback, useMemo, useState} from 'react'
import './App.css'

import { Map } from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import 'maplibre-gl/dist/maplibre-gl.css';
import {MVTLayer} from '@deck.gl/geo-layers';
import {PickingInfo} from '@deck.gl/core';
import {HoverInfo, TileProperties} from "./components/HoverInfoComponent.tsx";

function App() {
    const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
    const [hoveredFeatureId, setHoveredFeatureId] = useState<any | null>(null);

    const layer = useMemo(() => new MVTLayer({
        id: 'xyz-mvt',
        data: [
            `https://pub-68b2412877cd4500a55733977f95cc9f.r2.dev/tiles_simple_v1/{z}/{x}/{y}.pbf`,
        ],
        binary: true, // Try setting this to true
        getLineColor: [192, 192, 192],
        lineWidthMinPixels: 1,
        pickable: true,
        getFillColor: (feature: { id: string, properties: TileProperties }) => {
            const population = feature.properties.econ_loss_25k;

            // Normalize the population to a 0-1 range
            const normalizedPopulation = population / 1000000; // Assuming a max population of 1 million for scaling

            // Convert the normalized value to a color (e.g., red for high, green for low)
            // Use a heatmap color scheme (red for high, blue for low)
            let red = normalizedPopulation * 255;
            let green = 0;
            let blue = (1 - normalizedPopulation) * 255;
            let color = [red, green, blue];
            // Ensure values are within the valid range (0-255)
            red = Math.max(0, Math.min(255, red));
            green = Math.max(0, Math.min(255, green));
            blue = Math.max(0, Math.min(255, blue));
            if (hoveredFeatureId === feature.properties.FIPS) {
                console.log("FIPS");
                color = [255, 255, 255]; // Highlight color (white in this case)
            } else {
                console.log("not FIPS", feature.properties.FIPS, hoveredFeatureId);
            }

            return [...color, 100]; // Adding some transparency

        },

        onHover: info => {
            if (info?.object?.properties) {
                setHoverInfo({
                    properties: info.object.properties as TileProperties,
                    x: info.x,
                    y: info.y,
                })
            } else {
                setHoverInfo(null);
            }
            setHoveredFeatureId(info.object ? info.object.properties.FIPS : null);
        }

    }), [hoveredFeatureId]);
    console.log(hoveredFeatureId);
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
            <Map mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json" />
        </DeckGL>
    );
}

export default App
