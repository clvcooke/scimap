import {useCallback, useEffect, useState} from 'react'
import {IconGps} from '@tabler/icons-react';

import {Map} from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import 'maplibre-gl/dist/maplibre-gl.css';
import {MVTLayer} from '@deck.gl/geo-layers';
import {scaleLinear} from 'd3-scale';
import {interpolateOrRd,} from 'd3-scale-chromatic';
import {HoverInfo, HoverInfoComponent} from "./HoverInfoComponent.tsx";
import {ActionIcon, useMantineTheme} from "@mantine/core";
import {MapViewState, FlyToInterpolator} from '@deck.gl/core';


const ALPHA_COLOR = 200;

function LossMap() {
    const [hoveredFeatureId, setHoveredFeatureId] = useState<number | null>(null);
    const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
    const [viewState, setViewState] = useState<MapViewState>({
        longitude: -98.5795, // Approximate center longitude of the USA
        latitude: 39.8283,  // Approximate center latitude of the USA
        zoom: 3.5             // Adjust the zoom level to fit the continental USA
    })

    // Define your data range based on your economic loss values
    const dataMin = 0;
    const dataMax = Math.log(1000000); // Adjust this based on your actual max value

    const colorScale = scaleLinear()
        .domain([dataMin, dataMax])
        .range([0, 1])
        .clamp(true); // Makes sure values outside the domain get mapped to the range boundaries
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

    useEffect(() => {
        if (userLocation) {
            localStorage.setItem("USER_LOCATION", JSON.stringify(userLocation));
        }
    }, [userLocation])

    const layer = new MVTLayer({
        id: 'xyz-mvt',
        data: [
            `https://pub-68b2412877cd4500a55733977f95cc9f.r2.dev/tiles_simple_v1/{z}/{x}/{y}.pbf`,
        ],
        binary: true, // Try setting this to true
        getLineColor: [192, 192, 192, ALPHA_COLOR / 2],
        lineWidthMinPixels: 1,
        pickable: true,
        highlightedFeatureId: hoveredFeatureId,
        highlightColor: [127, 255, 212, ALPHA_COLOR],
        uniqueIdProperty: "FIPS",
        // @ts-expect-error comment
        getFillColor: (feature: { id: string, properties: TileProperties }) => {
            const value = Math.log(feature.properties.econ_loss_25k);
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
            if (info.object) {
                setHoveredFeatureId(info.object.properties.FIPS);
                setHoverInfo(
                    {
                        properties: info.object.properties,
                        x: info.x,
                        y: info.y,
                    }
                )
            } else {
                setHoverInfo(null);
                setHoveredFeatureId(null);
            }
        }
    });

    const theme = useMantineTheme();

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    setUserLocation([position.coords.longitude, position.coords.latitude]);
                    flyTo([position.coords.longitude, position.coords.latitude]);
                },
                error => {
                    console.error("Error getting location:", error);
                    alert("Error getting location. Please allow location access or center of USA.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser. Please select a state.");
        }
    };

    const flyTo = useCallback((location: [number, number] | null) => {
        if (!location) {
            return;
        }
        setViewState({
            longitude: location[0],
            latitude: location[1],
            zoom: 8,
            transitionInterpolator: new FlyToInterpolator({speed: 2}),
            transitionDuration: 'auto'
        });
    }, [])

    useEffect(() => {
        flyTo(userLocation);
    }, [userLocation, flyTo])


    return (
            <DeckGL
                onDragStart={() => setHoverInfo(null)}
                onDragEnd={() => setHoverInfo(null)}
                initialViewState={viewState}
                controller={true}
                layers={[layer]}
                style={{overflow: 'hidden'}}
            >
                <Map mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"/>
                {hoverInfo && <HoverInfoComponent hoverInfo={hoverInfo}/>}
                <ActionIcon variant="filled" aria-label="Location"
                            size={'md'}
                            style={{
                                position: 'absolute',
                                bottom: 10,
                                left: 10,
                                zIndex: 1,
                                backgroundColor: theme.colors.gray[0],
                                color: theme.colors.gray[9],
                            }}
                            onClick={getLocation}
                >
                    <IconGps style={{width: '70%', height: '70%'}}/>
                </ActionIcon>
            </DeckGL>
    );
}

export default LossMap
