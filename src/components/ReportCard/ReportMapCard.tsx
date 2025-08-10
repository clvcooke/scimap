import {useMemo, useState, useRef, useEffect} from "react";
import {ScaleLinear, scaleLinear} from "d3-scale";
import {interpolateMagma} from "d3-scale-chromatic";
import {MVTLayer} from "@deck.gl/geo-layers";
import {Card, Stack, Text} from "@mantine/core";
import DeckGL from "@deck.gl/react";
import {getViewStateFromBounds} from "../../utils/map-utils";
import {MapViewState} from "@deck.gl/core";
import {Map} from 'react-map-gl/maplibre';
import {generateDistrictOutlineLayer} from "../../layers/state-outline-layer.ts";


interface MapCardProps {
    title?: string;
    paddingPx?: number;
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
    cardType: 'state' | 'district';
    targetState?: string;
    targetDistrict: number;
}


const ALPHA_COLOR = 200;
const domain = "https://data.scienceimpacts.org";
const stateTiles = `${domain}/tiles_states_budget_v1/{z}/{x}/{y}.pbf`;
const districtTiles = `${domain}/tiles_districts_budget_119_v2/{z}/{x}/{y}.pbf`;


const DISTRICTS_DOMAIN: [number, number] = [5_000_000, 500_000_000];
const STATE_DOMAIN: [number, number] = [10_000_000, 5_000_000_000];


function generateMapLayer({
                              tileLink,
                              colorScale,
                              colorProperties = ["budg_NIH_cuts_econ_loss"],
                              id,
                              targetId,
                              uniqueProperty
                          }: {
    tileLink: string;
    colorScale: ScaleLinear<number, number>;
    colorProperties?: string[];
    id?: string;
    targetId?: string | number;
    uniqueProperty: string
}) {
    return new MVTLayer({
        id,
        data: [tileLink],
        binary: true,
        getLineColor: [255, 255, 255, ALPHA_COLOR / 3],
        lineWidthMinPixels: 1,
        pickable: false,
        uniqueIdProperty: uniqueProperty,
        maxZoom: 7,
        // @ts-expect-error Deck.gl typing issue
        getFillColor: (feature: { properties: any }) => {
            const value = Math.log(
                colorProperties.map((p) =>
                    feature.properties[p] ?? 0).reduce((previous, current) => previous + current, 0)
            );

            const colorString = interpolateMagma(1 - colorScale(value));

            let rgbValues;
            if (colorString.startsWith('rgb')) {
                rgbValues = colorString.slice(4, -1).split(",").map(str => parseInt(str.trim(), 10));
            } else {
                const hex = colorString.slice(1);
                rgbValues = [
                    parseInt(hex.slice(0, 2), 16),
                    parseInt(hex.slice(2, 4), 16),
                    parseInt(hex.slice(4, 6), 16)
                ];
            }
            let alpha = ALPHA_COLOR;
            if (targetId && targetId !== feature.properties[uniqueProperty]) {
                alpha = 100;
            }
            return [...rgbValues, alpha];
        }
    });
}

export const ReportMapCard = ({
                                  title,
                                  paddingPx = 50,
                                  minLat,
                                  maxLat,
                                  minLon,
                                  maxLon,
                                  cardType,
                                  targetDistrict,
                                  targetState,
                              }: MapCardProps) => {

    const colorScaleDistrict = useMemo(() => {
        const lower = DISTRICTS_DOMAIN[0] > 1 ? Math.log(DISTRICTS_DOMAIN[0]) : 0;
        const upper = Math.log(DISTRICTS_DOMAIN[1]);
        return scaleLinear()
            .domain([lower, upper])
            .range([0, 1])
            .clamp(true);
    }, []);
    const colorScaleState = useMemo(() => {
        const lower = STATE_DOMAIN[0] > 1 ? Math.log(STATE_DOMAIN[0]) : 0;
        const upper = Math.log(STATE_DOMAIN[1]);
        return scaleLinear()
            .domain([lower, upper])
            .range([0, 1])
            .clamp(true);
    }, []);

    const isState = cardType === 'state';

    const mapLayers = useMemo(() => {
        if (isState) {
            return [
                generateMapLayer({
                    tileLink: stateTiles,
                    colorScale: colorScaleState,
                    id: 'state-map-layer',
                    uniqueProperty: 'state_code',
                    targetId: targetState
                }),
                generateDistrictOutlineLayer('GEOID', targetDistrict, [255, 255, 255], 2)
            ]
        } else {
            return [
                generateMapLayer({
                    tileLink: districtTiles,
                    colorScale: colorScaleDistrict,
                    id: 'district-map-layer',
                    uniqueProperty: 'GEOID',
                    targetId: targetDistrict,
                }),
                generateDistrictOutlineLayer('GEOID', targetDistrict)
            ]
        }

    }, [colorScaleDistrict, colorScaleState, isState, targetDistrict, targetState])

    const [viewState, setViewState] = useState<MapViewState>({
        longitude: (minLon + maxLon) / 2,
        latitude: (minLat + maxLat) / 2,
        zoom: 6
    });

    const mapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (mapContainerRef.current) {
            const {width, height} = mapContainerRef.current.getBoundingClientRect();
            if (width > 0 && height > 0) {
                const newViewState = getViewStateFromBounds(
                    minLat, maxLat, minLon, maxLon,
                    width, height, paddingPx
                );
                setViewState(newViewState);
            }
        }
    }, [paddingPx, minLat, maxLat, minLon, maxLon]);


    return (
        <Card shadow="sm" padding={isState ? 0 : 0} radius="md" withBorder>
            <Stack gap="sm">
                {title && <Text size="lg" fw={600} c="dark">{title}</Text>}
                <div
                    ref={mapContainerRef}
                    style={{height: isState ? 300 : 735, position: 'relative'}}
                >
                    <DeckGL
                        initialViewState={viewState}
                        controller={false}
                        layers={mapLayers}
                        getCursor={() => 'default'}
                    >
                        <Map
                            attributionControl={false}
                            mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                        />
                    </DeckGL>
                </div>
            </Stack>
        </Card>
    );
};