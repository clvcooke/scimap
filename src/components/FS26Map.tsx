import {MouseEvent, useCallback, useEffect, useMemo, useState} from 'react'
import {IconGps, IconZoomIn, IconZoomOut} from '@tabler/icons-react';

import {Map, AttributionControl} from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import 'maplibre-gl/dist/maplibre-gl.css';
import {MVTLayer} from '@deck.gl/geo-layers';
import {ScaleLinear, scaleLinear} from 'd3-scale';
import {interpolateMagma,} from 'd3-scale-chromatic';
import {HoverInfo, HoverInfoComponent} from "./HoverInfoComponent.tsx";
import {ActionIcon, Group, Modal, Stack, useMantineTheme, Text} from "@mantine/core";
import {GeoJsonLayer} from '@deck.gl/layers';
import {FlyToInterpolator, MapViewState, PickingInfo} from '@deck.gl/core';
import {FY26TitleHeader} from "./TitleHeader.tsx";
import {trackPageView} from "../utils/analytics.ts";
import SharePage from "./SharePage.tsx";
import ColorScale from "./ColorScale.tsx";
import {isMobile} from "react-device-detect";
import MapControls from "./MapControls.tsx";
import {FY26Report} from "./FY26Report.tsx";
import {generateStateOutlineLayer} from "../layers/state-outline-layer.ts";

const ALPHA_COLOR = 200;
const domain = "https://data.scienceimpacts.org"

const countyTiles = `${domain}/tiles_counties_budget_v1/{z}/{x}/{y}.pbf`;
const stateTiles = `${domain}/tiles_states_budget_v1/{z}/{x}/{y}.pbf`;
const districtTiles = `${domain}/tiles_districts_budget_119_v2/{z}/{x}/{y}.pbf`;

const ATTRIBUTION = !isMobile ? "SCIMaP © CC BY 4.0" : ""

const COUNTY_DOMAIN: [number, number] = [100_000, 100_000_000];
const DISTRICTS_DOMAIN: [number, number] = [5_000_000, 500_000_000];
const STATE_DOMAIN: [number, number] = [10_000_000, 5_000_000_000];


function generateMapLayer({
                              tileLink,
                              hoveredFeatureId,
                              uniqueProperty,
                              mode,
                              setHoveredFeatureId,
                              setHoverInfo,
                              colorScale,
                              colorProperties,
                              pinnedHoverInfo,
                          }: {
    tileLink: string;
    hoveredFeatureId: number | string | null;
    uniqueProperty: string;
    mode: string | null;
    setHoveredFeatureId: (featureId: number | null | string) => void;
    setHoverInfo: (info: HoverInfo | null) => void;
    colorScale: ScaleLinear<number, number>;
    colorProperties: string[];
    pinnedHoverInfo: HoverInfo | null;

}) {
    return new MVTLayer({
        id: 'xyz-mvt',
        data: [tileLink],
        binary: true, // Try setting this to true
        getLineColor: [255, 255, 255, ALPHA_COLOR / 3],
        lineWidthMinPixels: 1,
        pickable: true,
        highlightedFeatureId: hoveredFeatureId,
        highlightColor: [127, 255, 212, ALPHA_COLOR],
        uniqueIdProperty: uniqueProperty,
        maxZoom: 7,
        // @ts-expect-error comment
        getFillColor: (feature: { id: string, properties: TileProperties }) => {
            // let property_name: string = "econ_loss";
            const value = Math.log(
                colorProperties.map((p) =>
                    feature.properties[p] ?? 0).reduce((previous, current) => previous + current, 0)
            );
            const colorString = interpolateMagma(1 - colorScale(value));


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
            // Only update hover info if we don't have a pinned hover
            if (!pinnedHoverInfo && info.object) {
                if (mode === 'county') {
                    setHoveredFeatureId(info.object.properties.FIPS);
                } else if (mode === "state") {
                    setHoveredFeatureId(info.object.properties.state);
                } else {
                    setHoveredFeatureId(info.object.properties.GEOID);
                }
                setHoverInfo(
                    {
                        properties: info.object.properties,
                        x: info.x,
                        y: info.y,
                    }
                )
            } else if (!pinnedHoverInfo) {
                setHoverInfo(null);
                setHoveredFeatureId(null);
            }
        }
    });
}

function FY26Map() {

    useEffect(() => {
        trackPageView("map", "map");
    }, [])

    const [hoveredFeatureId, setHoveredFeatureId] = useState<number | string | null>(null);
    const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
    const [pinnedHoverInfo, setPinnedHoverInfo] = useState<HoverInfo | null>(null);
    const [viewState, setViewState] = useState<MapViewState>({
        longitude: -98.5795, // Approximate center longitude of the USA
        latitude: 39.8283,  // Approximate center latitude of the USA
        zoom: 3.5             // Adjust the zoom level to fit the continental USA
    });
    const [showReport, setShowReport] = useState(false);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [showShare, setShowShare] = useState(false);

    const [mode, setMode] = useState<"county" | "districts" | "state" | ''>('districts');
    const theme = useMantineTheme();
    const uniqueProperty = useMemo(() => mode === "county" ? "FIPS" : mode === "districts" ? "GEOID" : "state", [mode]);
    const [titleHeaderHeight, setTitleHeaderHeight] = useState(0);

    const stateLayer = generateStateOutlineLayer();

    const titleHeaderRef = useCallback((node: HTMLDivElement | null) => {
        if (node) {
            // Get the height immediately when the node is available
            const height = node.getBoundingClientRect().height;
            setTitleHeaderHeight(height);

            // Set up a resize observer to update the height when window resizes
            const resizeObserver = new ResizeObserver(entries => {
                for (const entry of entries) {
                    setTitleHeaderHeight(entry.contentRect.height);
                }
            });

            resizeObserver.observe(node);

            // Clean up observer when component unmounts
            return () => resizeObserver.disconnect();
        }
    }, []);


    const lossDomain: [number, number] = useMemo(() => {
        if (!mode) {
            return [0, 10000000];
        }
        if (mode === 'county') {
            return COUNTY_DOMAIN;
        } else if (mode === 'districts') {
            return DISTRICTS_DOMAIN;
        } else if (mode === 'state') {
            return STATE_DOMAIN;
        } else {
            return STATE_DOMAIN
        }
    }, [mode]);
    const colorScale = useMemo(() => {

        const lower = lossDomain[0] > 1 ? Math.log(lossDomain[0]) : 0;
        const upper = Math.log(lossDomain[1]);
        return scaleLinear()
            .domain([lower, upper])
            .range([0, 1])
            .clamp(true);
    }, [lossDomain]);

    const tileLink = useMemo(() => {
        if (!mode) {
            return countyTiles;
        }
        if (mode === "county") {
            return countyTiles;
        } else if (mode === "districts") {
            return districtTiles;
        } else if (mode === "state") {
            return stateTiles;
        } else {
            return stateTiles;
        }
    }, [mode]);

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
            getFillColor: [18, 184, 134, 200],
            getLineColor: [255, 255, 255, 255], // White border
            getLineWidth: 2,
            getPointRadius: 5,
        });
    }, [userLocation]);

    const [colorProperties,] = useState<string[]>(["budg_NIH_cuts_econ_loss"])
    const lossLayers: (MVTLayer)[] = [
        generateMapLayer({
            tileLink,
            uniqueProperty,
            hoveredFeatureId,
            setHoveredFeatureId,
            setHoverInfo,
            colorScale,
            mode,
            colorProperties,
            pinnedHoverInfo
        }),
        stateLayer,
    ];

    const mapWidth = '100vw';

    // Handle click events for pinning hover info in district mode
    const handleMapClick = useCallback((event: PickingInfo) => {
        if (mode === 'districts' && event.object) {
            const clickInfo: HoverInfo = {
                properties: event.object.properties,
                x: event.x,
                y: event.y,
            };
            setPinnedHoverInfo(clickInfo);
            setHoverInfo(null); // Clear regular hover when pinning
        } else {
            // Clear pinned hover if clicking elsewhere
            setPinnedHoverInfo(null);
        }
    }, [mode]);

    const handleClosePinnedHover = useCallback(() => {
        setPinnedHoverInfo(null);
    }, []);

    useEffect(() => {
        setPinnedHoverInfo(null);
    }, [mode]);

    // Unpin when clicking/touching anywhere outside the hover box
    useEffect(() => {
        if (!pinnedHoverInfo) return;
        const handleGlobalDown = () => {
            // If event originated within the hover card, HoverInfoComponent stops propagation for mouse/touch,
            // so this handler won't run. Otherwise, clear the pin.
            setPinnedHoverInfo(null);
        };
        document.addEventListener('mousedown', handleGlobalDown);
        document.addEventListener('touchstart', handleGlobalDown, {passive: true});
        return () => {
            document.removeEventListener('mousedown', handleGlobalDown);
            document.removeEventListener('touchstart', handleGlobalDown);
        };
    }, [pinnedHoverInfo]);

    return (
        <Group h={"100%"} w={"100%"} preventGrowOverflow={true} gap={0}>
            <Group grow style={{
                width: mapWidth,
                height: "calc(100svh - 3rem)",
                position: "relative",
            }}>
                <DeckGL
                    onDragStart={() => {
                        setHoverInfo(null);
                        if (pinnedHoverInfo) {
                            setPinnedHoverInfo(null);
                        }
                    }}
                    onDragEnd={() => setHoverInfo(null)}
                    viewState={viewState}
                    onViewStateChange={({viewState: newViewState}) => {
                        setViewState(newViewState as MapViewState);
                    }}
                    onClick={handleMapClick}
                    controller={!pinnedHoverInfo}
                    layers={[...lossLayers, userLocationLayer]}
                    style={{overflow: 'hidden'}}
                    _pickable={pinnedHoverInfo === null}
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
                         ref={titleHeaderRef}
                    >
                        <FY26TitleHeader onClickReport={() => setShowReport(true)}/>
                    </div>
                    <Map
                        attributionControl={false}
                        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json">
                        <AttributionControl customAttribution={ATTRIBUTION} compact={false}/>

                    </Map>
                    <FY26Report
                        opened={showReport}
                        onClose={() => setShowReport(false)}
                    />

                    {(hoverInfo || pinnedHoverInfo) && <HoverInfoComponent
                        layer={'budget'}
                        mode={mode}
                        hoverInfo={pinnedHoverInfo || hoverInfo}
                        showJobs={mode !== 'county'}
                        displayMode={null}
                        isPinned={!!pinnedHoverInfo}
                        onClose={handleClosePinnedHover}
                    />}

                    <div style={{
                        position: 'absolute',
                        right: 10,
                        bottom: 45,
                        zIndex: 1,
                        pointerEvents: 'none',
                    }}>
                        <ColorScale useMagma={true} width={isMobile ? 5 : 10} height={isMobile ? 110 : 180}
                                    domain={lossDomain}
                                    logScale={true}/>
                    </div>


                    <Stack style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        zIndex: 10,
                        color: theme.colors.gray[9],
                        padding: 10,
                    }} gap="xs">
                        <ActionIcon aria-label="Location"
                                    radius={'xl'}
                                    size={'lg'}
                                    onClick={getLocation}
                        >
                            <IconGps style={{width: '70%', height: '70%'}}/>
                        </ActionIcon>
                        <ActionIcon aria-label="Zoom In"
                                    radius={'xl'}
                                    size={'lg'}
                                    onClick={zoomIn}
                        >
                            <IconZoomIn style={{width: '70%', height: '70%'}}/>
                        </ActionIcon>
                        <ActionIcon aria-label="Zoom Out"
                                    radius={'xl'}
                                    size={'lg'}

                                    onClick={zoomOut}
                        >
                            <IconZoomOut style={{width: '70%', height: '70%'}}/>
                        </ActionIcon>
                    </Stack>

                    <Modal title={<Text size='xl'>Share</Text>} closeOnClickOutside={true} opened={showShare}
                           onClose={() => setShowShare(false)}>
                        <SharePage
                            summary={"FY26 NIH Budget Impact Map"}
                            text={"See the impact of the FY26 NIH Budget Proposal"}
                            title={"See national impact of federal health research cuts"}
                        />
                    </Modal>
                </DeckGL>
            </Group>
            <Stack style={{
                position: 'absolute',
                top: titleHeaderHeight + 15,
                right: 10,
                zIndex: 10,
                m: 10,
                pointerEvents: 'auto',
            }} gap="xs">
                <MapControls
                    mode={mode}
                    setMode={(selectedMode) => setMode(selectedMode)}
                    setShowShare={setShowShare}
                />
            </Stack>
        </Group>
    )
        ;
}

export default FY26Map