import {MouseEvent, useCallback, useEffect, useMemo, useState} from 'react'
import {IconGps, IconShare, IconZoomIn, IconZoomOut} from '@tabler/icons-react';

import {Map} from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import 'maplibre-gl/dist/maplibre-gl.css';
import {MVTLayer} from '@deck.gl/geo-layers';
import {scaleLinear} from 'd3-scale';
import {interpolateOrRd,} from 'd3-scale-chromatic';
import {HoverInfo, HoverInfoComponent} from "./HoverInfoComponent.tsx";
import {ActionIcon, Button, Group, Modal, Radio, Stack, useMantineTheme} from "@mantine/core";
import {GeoJsonLayer} from '@deck.gl/layers';
import {FlyToInterpolator, MapViewState} from '@deck.gl/core';
import TitleHeader from "./TitleHeader.tsx";
import ReactGA from 'react-ga4';
import {ANALYTICS_ACTIONS, Condition, ECONOMIC_LOSS, JOBS_LOST} from "../constants.ts";
import SharePage from "./SharePage.tsx";
import ColorScale from "./ColorScale.tsx";
import {isMobile} from "react-device-detect";
import {grantLossValues} from "../data/grant-losses-county.ts";
import IconClusterLayer from "../layers/icon-cluster-layer.ts";
import GrantsOverlay from "./GrantsOverlay.tsx";
import MapSettings, {MapControlsDrawer} from "./MapSettings.tsx";

const ALPHA_COLOR = 200;
const TILE_VERSION = '9'
const domain = "https://data.scienceimpacts.org"


const idcTilesCounties = `${domain}/state_counties_v${TILE_VERSION}/{z}/{x}/{y}.pbf`;
const idcTilesStates = `${domain}/state_tiles_v${TILE_VERSION}/{z}/{x}/{y}.pbf`;
const idcTilesDistricts = `${domain}/state_districts_v${TILE_VERSION}/{z}/{x}/{y}.pbf`;

const grantTilesCounties = `${domain}/state_counties_v${TILE_VERSION}/{z}/{x}/{y}.pbf`;
const grantTilesStates = `${domain}/state_tiles_v${TILE_VERSION}/{z}/{x}/{y}.pbf`;
const grantTilesDistricts = `${domain}/state_districts_v${TILE_VERSION}/{z}/{x}/{y}.pbf`;

const TILE_LINKS = {
    county: {
        idc: idcTilesCounties,
        grant: grantTilesCounties
    },
    state: {
        idc: idcTilesStates,
        grant: grantTilesStates
    },
    districts: {
        idc: idcTilesDistricts,
        grant: grantTilesDistricts
    }
}

type GrantLossCounty = {
    reporter_url: string;
    award_remaining: number;
    termination_date: string;
    org_name: string;
    project_title: string;
    cancellation_source: string;
    centroid: [longitude: number, latitude: number];
};


// const COUNTY_DOMAIN: [number, number] = [0,    8_886110.52051];
const COUNTY_DOMAIN: [number, number] = [0, 25_000_000];
const DISTRICTS_DOMAIN: [number, number] = [250_000, 50_000_000];
const STATE_DOMAIN: [number, number] = [10_000, 2_500_000_000];

const DOMAINS = {
    county: {
        idc: COUNTY_DOMAIN,
        grant: COUNTY_DOMAIN
    },
    state: {
        idc: STATE_DOMAIN,
        grant: STATE_DOMAIN
    },
    districts: {
        idc: DISTRICTS_DOMAIN,
        grant: DISTRICTS_DOMAIN
    }
}


interface LossMapProps {
    condition?: Condition;
}

function LossMap({condition}: LossMapProps) {

    useEffect(() => {
        ReactGA.send({hitType: "pageview", page: "map", title: "map"});
    }, [])

    const [hoveredFeatureId, setHoveredFeatureId] = useState<number | string | null>(null);

    // const [showControls, setShowControls] = useState(false);
    // const [isNormalized, setIsNormalized] = useState(false);
    // const [showAnnotations, setShowAnnotations] = useState(false);
    const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
    const [viewState, setViewState] = useState<MapViewState>({
        longitude: -98.5795, // Approximate center longitude of the USA
        latitude: 39.8283,  // Approximate center latitude of the USA
        zoom: 3.5             // Adjust the zoom level to fit the continental USA
    });
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [showShare, setShowShare] = useState(false);

    const [mode, setMode] = useState<"county" | "districts" | "state" | ''>('county');
    const theme = useMantineTheme();
    const uniqueProperty = useMemo(() => mode === "county" ? "FIPS" : mode === "districts" ? "GEOID" : "state", [mode]);
    const [backgroundLayer, setBackgroundLayer] = useState<"idc" | "grant">('idc');
    const [showGrants, setShowGrants] = useState(true);

    useEffect(() => {
        if (condition === 'IDC') {
            setBackgroundLayer('idc');
            setShowGrants(false);
        } else if (condition === 'GRANTS') {
            setBackgroundLayer('grant');
            setShowGrants(true);
        } else if (condition === 'IDC_GRANTS') {
            setBackgroundLayer('idc');
            setShowGrants(true);
        } else {
            setShowGrants(false);
            setBackgroundLayer('idc');
        }
    }, [condition])


    const lossDomain: [number, number] = useMemo(() => {
        if (!mode || !backgroundLayer) {
            return [0, 10000000];
        }
        return DOMAINS[mode][backgroundLayer];
    }, [mode, backgroundLayer]);
    const colorScale = useMemo(() => {

        const lower = lossDomain[0] > 1 ? Math.log(lossDomain[0]) : 0;
        const upper = Math.log(lossDomain[1]);
        return scaleLinear()
            .domain([lower, upper])
            .range([0, 1])
            .clamp(true);
    }, [lossDomain]);

    const tileLink = useMemo(() => {
        if (!mode || !backgroundLayer) {
            return null;
        }
        return TILE_LINKS[mode][backgroundLayer];
    }, [mode, backgroundLayer]);

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

    const grantLayerActive = useMemo(() => true, []);

    const [overlayGrants, setOverlayGrants] = useState<GrantLossCounty[]>([]);
    const [showOverlay, setShowOverlay] = useState(false);


    const lossLayers: (IconClusterLayer | MVTLayer)[] = [];

    if (tileLink) {
        const baseLayer = new MVTLayer({
            id: 'xyz-mvt',
            data: [tileLink],
            binary: true, // Try setting this to true
            getLineColor: [192, 192, 192, ALPHA_COLOR / 2],
            lineWidthMinPixels: 1,
            pickable: true,
            highlightedFeatureId: hoveredFeatureId,
            highlightColor: [127, 255, 212, ALPHA_COLOR],
            uniqueIdProperty: uniqueProperty,
            maxZoom: 7,
            // @ts-expect-error comment
            getFillColor: (feature: { id: string, properties: TileProperties }) => {
                let colorString: string;
                if (mode === 'county') {
                    const value = feature.properties.econ_loss_log;
                    colorString = interpolateOrRd(colorScale(value));
                } else if (mode === 'state') {
                    const value = Math.log(feature.properties.econ_loss);
                    colorString = interpolateOrRd(colorScale(value));
                } else {
                    const value = Math.log(feature.properties.econ_loss);
                    // const value = feature.properties.econ_loss;
                    colorString = interpolateOrRd(colorScale(value));
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
                } else {
                    setHoverInfo(null);
                    setHoveredFeatureId(null);
                }
            }
        });
        lossLayers.push(baseLayer);
    }

    if (showGrants) {
        const superGrantLayer = new IconClusterLayer({
            data: grantLossValues,
            getPosition: (d: GrantLossCounty) => [d.centroid[0], d.centroid[1]],
            getSize: 50,
            iconAtlas: '/location-icon-atlas-v2.png',
            iconMapping: '/location-icon-mapping.json',
            getColor: () => [0, 255, 0],
            id: 'icon-cluster',
            sizeScale: 40,
            pickable: true
        });
        lossLayers.push(superGrantLayer);
    }

    // const mapWidth = isMobile ? '100vw' : '80vw';
    const mapWidth = '100vw';

    return (
        <Group h={"100%"} w={"100%"} preventGrowOverflow={true} gap={0}>
            {/*{!isMobile && <div style={{*/}
            {/*    width: '20vw',*/}
            {/*    height: "calc(100svh - 3rem)"*/}
            {/*}}>*/}
            {/*    <MapSettings*/}
            {/*        baseLayer={mode}*/}
            {/*        setBaseLayer={setMode}*/}
            {/*        isNormalized={isNormalized} setIsNormalized={setIsNormalized} showAnnotations={showAnnotations}*/}
            {/*        setShowAnnotations={setShowAnnotations}*/}
            {/*    />*/}
            {/*</div>}*/}

            {/*{isMobile && <MapControlsDrawer opened={showControls} onClose={() => {*/}
            {/*    console.log("close");*/}
            {/*    setShowControls(false)*/}
            {/*}} baseLayer={mode}*/}
            {/*                                setBaseLayer={setMode}*/}
            {/*                                isNormalized={isNormalized} setIsNormalized={setIsNormalized}*/}
            {/*                                showAnnotations={showAnnotations}*/}
            {/*                                setShowAnnotations={setShowAnnotations}/>}*/}

            <Group grow style={{
                width: mapWidth,
                height: "calc(100svh - 3rem)",
                position: "relative",
            }}>
                <DeckGL
                    onDragStart={() => setHoverInfo(null)}
                    onDragEnd={() => setHoverInfo(null)}
                    viewState={viewState}
                    onViewStateChange={({viewState: newViewState}) => {
                        setViewState(newViewState as MapViewState);
                    }}

                    controller={!showOverlay}
                    layers={[...lossLayers, userLocationLayer]}
                    style={{overflow: 'hidden'}}
                    onClick={(event) => {
                        if (grantLayerActive) {
                            // @ts-expect-error: objects are defined
                            let grants: GrantLossCounty[] = event.objects;
                            if (!grants?.length && event.object?.reporter_url) {
                                grants = [event.object];
                            }
                            if (grants?.length) {
                                setOverlayGrants(grants);
                                setShowOverlay(true);
                            } else {
                                console.log("No grants found");
                            }
                        }
                    }}
                    _pickable={!showOverlay}
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
                        m: 10,
                        pointerEvents: 'auto',

                    }} gap="xs">
                        <Stack style={{
                            backgroundColor: theme.colors.gray[0],
                            padding: 10
                        }} gap={"xs"}>
                            <Radio checked={mode === 'county'} onChange={() => {
                                setMode('county')
                                ReactGA.event({
                                    category: ANALYTICS_ACTIONS.layer,
                                    action: `county`,
                                });
                            }} label="County"/>
                            <Radio checked={mode === 'state'} onChange={() => {
                                setMode('state')
                                ReactGA.event({
                                    category: ANALYTICS_ACTIONS.layer,
                                    action: `state`,
                                });
                            }} label="State"/>
                            <Radio checked={mode === 'districts'} onChange={() => {
                                setMode('districts')
                                ReactGA.event({
                                    category: ANALYTICS_ACTIONS.layer,
                                    action: `districts`,
                                });
                            }} label="House District"/>
                            {/*<Button size={'xs'} onClick={() => setShowControls(true)}>More Options</Button>*/}
                            <Button size={"xs"} rightSection={<IconShare size={16}/>}
                                    onClick={() => setShowShare(true)}>Share</Button>
                        </Stack>

                    </Stack>
                    {hoverInfo && <HoverInfoComponent mode={mode} hoverInfo={hoverInfo} showJobs={mode !== 'county'}/>}

                    <div style={{
                        position: 'absolute',
                        right: 10,
                        bottom: 45,
                        zIndex: 1,
                        pointerEvents: 'none',
                    }}>
                        <ColorScale width={isMobile ? 5 : 10} height={isMobile ? 110 : 180} domain={lossDomain}
                                    logScale={true}/>
                    </div>


                    <Stack style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        zIndex: 1,
                        color: theme.colors.gray[9],
                        padding: 10,
                    }} gap="xs">
                        <ActionIcon variant="transparent" aria-label="Location"
                                    size={'xl'}
                                    style={{
                                        color: theme.colors.gray[9],
                                    }}
                                    onClick={getLocation}
                        >
                            <IconGps style={{width: '70%', height: '70%'}}/>
                        </ActionIcon>
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
                    </Stack>

                    <Modal closeOnClickOutside={true} withinPortal={false} opened={showShare}
                           onClose={() => setShowShare(false)}>
                        <SharePage
                            title={"See national impact of federal health research cuts"}
                        />
                    </Modal>
                    <GrantsOverlay grants={overlayGrants} opened={showOverlay} onClose={() => setShowOverlay(false)}/>
                </DeckGL>
            </Group>

        </Group>
    )
        ;
}

export default LossMap
