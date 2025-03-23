import {useCallback, useMemo, useState} from 'react'
import {IconGps, IconShare, IconZoomIn, IconZoomOut} from '@tabler/icons-react';

import {Map} from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import 'maplibre-gl/dist/maplibre-gl.css';
import {MVTLayer} from '@deck.gl/geo-layers';
import {scaleLinear} from 'd3-scale';
import {interpolateOrRd,} from 'd3-scale-chromatic';
import {HoverInfo, HoverInfoComponent} from "./HoverInfoComponent.tsx";
import {ActionIcon, useMantineTheme, Radio, Text, Stack, Button} from "@mantine/core";
import {GeoJsonLayer} from '@deck.gl/layers';
import {MapViewState, FlyToInterpolator} from '@deck.gl/core';
import TitleHeader from "./TitleHeader.tsx";
import {MouseEvent} from "react";

const JOBS_LOST = 153712.58056788
const ECONOMIC_LOSS = 13834132249.184;

const ALPHA_COLOR = 200;

const domain = "https://data.scienceimpacts.org"
const tilesCounties = `${domain}/county_tiles/{z}/{x}/{y}.pbf`
const tilesStates = `${domain}/state_tiles/{z}/{x}/{y}.pbf`
import {isMobile} from 'react-device-detect';

const formattedJobs = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short'
}).format(JOBS_LOST);

const formattedCost = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short'
}).format(ECONOMIC_LOSS);

function LossMap() {
    const [hoveredFeatureId, setHoveredFeatureId] = useState<number | string | null>(null);
    const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
    const [viewState, setViewState] = useState<MapViewState>({
        longitude: -98.5795, // Approximate center longitude of the USA
        latitude: 39.8283,  // Approximate center latitude of the USA
        zoom: 3.5             // Adjust the zoom level to fit the continental USA
    });
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

    const [mode, setMode] = useState<"county" | "state">('county');
    const tileLink = useMemo(() => {
        if (mode === 'county') {
            return tilesCounties;
        } else {
            return tilesStates;
        }
    }, [mode]);

    // Define your data range based on your economic loss values
    const countyColorScale = scaleLinear()
        .domain([0, Math.log(1000000)])
        .range([0, 1])
        .clamp(true);
    const stateColorScale = scaleLinear()
        .domain([0, Math.log(187.3718153)])
        .range([0, 1])
        .clamp(true);


    const pageUrl = window.location.href;
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Federal Health Research Cuts',
                    text: `Impact: $${formattedCost} and ${formattedJobs} Jobs Lost`,
                    url: pageUrl,
                });
                console.log('Successfully shared');
            } catch (error) {
                console.error('Error sharing:', error);
                alert("Error sharing. Please copy the link to your clipboard.");
            }
        }
    };

    const layer = new MVTLayer({
        id: 'xyz-mvt',
        data: [tileLink],
        binary: true, // Try setting this to true
        getLineColor: [192, 192, 192, ALPHA_COLOR / 2],
        lineWidthMinPixels: 1,
        pickable: true,
        highlightedFeatureId: hoveredFeatureId,
        highlightColor: [127, 255, 212, ALPHA_COLOR],
        uniqueIdProperty: mode === "county" ? "FIPS" : "state",
        maxZoom: 7,
        // @ts-expect-error comment
        getFillColor: (feature: { id: string, properties: TileProperties }) => {
            let colorString: string;
            if (mode === 'county') {
                const value = Math.log(feature.properties.econ_loss_25k);
                colorString = interpolateOrRd(countyColorScale(value));
            } else {
                const value = Math.log(feature.properties.econ_loss_pc);
                colorString = interpolateOrRd(stateColorScale(value));
            }
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
                if (mode === 'county') {
                    setHoveredFeatureId(info.object.properties.FIPS);
                } else {
                    setHoveredFeatureId(info.object.properties.state);
                }
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

    const flyTo = useCallback((location: [number, number] | null) => {
        if (!location) {
            return;
        }
        setUserLocation(location);
        setViewState({
            longitude: location[0],
            latitude: location[1],
            zoom: 8,
            transitionInterpolator: new FlyToInterpolator({speed: 2}),
            transitionDuration: 'auto'
        });
    }, [])

    const getLocation = (event: MouseEvent) => {
        event.stopPropagation();
        if (navigator.geolocation) {
            navigator.permissions.query({name: 'geolocation'}).then(permissionStatus => {
                if (permissionStatus.state === 'denied') {
                    if (window.confirm("Please allow location access to zoom to your location. Press OK to go to settings.")) {
                        window.location.href = "app-settings:location";
                    }
                } else {

                    navigator.geolocation.getCurrentPosition(position => {
                            flyTo([position.coords.longitude, position.coords.latitude]);
                        },
                        error => {
                            console.error("Error getting location:", error);
                            alert("Error getting location. Please allow location access to zoom to your location.");
                        });
                }
            });
        } else {
            alert('Geolocation is not supported in your browser.');
        }
    };

    const zoomIn = (event: MouseEvent) => {
        event.stopPropagation();
        setViewState(prev => ({...prev, zoom: prev.zoom + 1}));
    };

    const zoomOut = (event: MouseEvent) => {
        event.stopPropagation();
        setViewState(prev => ({...prev, zoom: prev.zoom - 1}));
    };

    const userLocationLayer = useMemo(() => {
        if (!userLocation) return null;

        return new GeoJsonLayer({
            id: 'user-location-layer',
            data: {
                "type": "Point",
                "coordinates": userLocation,
            },
            pointRadiusMinPixels: 5,
            pointRadiusMaxPixels: 5,
            lineWidthMinPixels: 2,
            getFillColor: [34, 114, 242, 200], // Light blue color
            getLineColor: [255, 255, 255, 255], // White border
            getLineWidth: 2,
            getPointRadius: 5,
        });
    }, [userLocation]);


    return (
        <DeckGL
            onDragStart={() => setHoverInfo(null)}
            onDragEnd={() => setHoverInfo(null)}
            viewState={viewState}
            onViewStateChange={({viewState: newViewState}) => {
                setViewState(newViewState as MapViewState);
            }}
            controller={true}
            layers={[layer, userLocationLayer]}
            style={{overflow: 'hidden'}}
        >
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100vw',
                zIndex: 2,
                background: 'rgba(255, 255, 255, 0.7)', // Slightly less transparent
                backdropFilter: 'blur(5px)', // Add a subtle blur
                padding: '4px', // Add some padding inside the container
            }}
                 onMouseOver={(event) => event.stopPropagation()}
                 onMouseOut={(event) => event.stopPropagation()}
            >
                <TitleHeader
                    jobsLost={JOBS_LOST} costImpact={ECONOMIC_LOSS}></TitleHeader>
            </div>
            <Map mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"/>
            <Stack style={{
                position: 'absolute',
                top: 100,
                right: 10,
                zIndex: 10,
                backgroundColor: theme.colors.gray[0],
                padding: 10,
            }} gap="xs">
                <Text fw={700}>Level</Text>
                <Radio checked={mode === 'county'} onChange={() => setMode('county')} label="County"/>
                <Radio checked={mode === 'state'} onChange={() => setMode('state')} label="State"/>
                {isMobile &&
                    <Button onClick={handleShare} size={"sm"} rightSection={<IconShare size={16}/>}>Share</Button>}
            </Stack>
            {hoverInfo && <HoverInfoComponent mode={mode} hoverInfo={hoverInfo}/>}


            <Stack style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                zIndex: 1,
                color: theme.colors.gray[9],
                padding: 10,
            }} gap="xs">

                <ActionIcon variant="transparent" aria-label="Zoom In"
                            size={'xl'}
                            style={{
                                color: theme.colors.gray[9],
                            }}
                            onClick={zoomIn}
                >
                    <IconZoomIn style={{width: '70%', height: '70%'}}/>
                </ActionIcon>
                <ActionIcon variant="transparent" aria-label="Zoom Out"
                            size={'xl'}
                            style={{
                                color: theme.colors.gray[9],
                            }}
                            onClick={zoomOut}
                >
                    <IconZoomOut style={{width: '70%', height: '70%'}}/>
                </ActionIcon>
                <ActionIcon variant="transparent" aria-label="Location"
                            size={'xl'}
                            style={{
                                color: theme.colors.gray[9],
                            }}
                            onClick={getLocation}
                >
                    <IconGps style={{width: '70%', height: '70%'}}/>
                </ActionIcon>
            </Stack>

        </DeckGL>
    );
}

export default LossMap
