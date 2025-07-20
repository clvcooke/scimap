import React, {useEffect, useMemo, useState, useRef} from 'react';
import {IconDownload, IconShare} from '@tabler/icons-react';
import {Map} from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import 'maplibre-gl/dist/maplibre-gl.css';
import {MVTLayer} from '@deck.gl/geo-layers';
import {ScaleLinear, scaleLinear} from 'd3-scale';
import {interpolateMagma} from 'd3-scale-chromatic';
import {
    Card,
    Text,
    Stack,
    Group,
    useMantineTheme,
    Container,
    Grid,
    Badge,
    Button,
    Modal,
} from '@mantine/core';
import {MapViewState} from '@deck.gl/core';
import {isMobile} from "react-device-detect";
import SharePage from "./SharePage.tsx";
import {getViewStateFromBounds} from "../utils/map-utils.ts";

interface ReportCardProps {
    stateCode?: string;
    districtId?: string;
    representativeName?: string;
    senatorNames?: string[];

    // Mock data - replace with actual data fetching
    econLoss?: number;
    jobsLoss?: number;
    grantFunds?: number;
    terminatedLoss?: number;

    // Viewport bounds
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
}

const ALPHA_COLOR = 200;
const domain = "https://data.scienceimpacts.org";
const stateTiles = `${domain}/tiles_states_budget_v1/{z}/{x}/{y}.pbf`;
const districtTiles = `${domain}/tiles_districts_budget_v1/{z}/{x}/{y}.pbf`;


const COUNTY_DOMAIN: [number, number] = [0, 25_000_000];

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



export const ReportCard: React.FC<ReportCardProps> = ({
                                                          stateCode = "NJ",
                                                          districtId = "NJ-03",
                                                          representativeName = "Andy Kim (D)",
                                                          senatorNames = ["Cory Booker (D)", "Bob Menendez (D)"],
                                                          econLoss = 45_600_000,
                                                          jobsLoss = 456,
                                                          grantFunds = 125_000_000,
                                                          terminatedLoss = 12_300_000,
                                                          minLat,
                                                          maxLat,
                                                          minLon,
                                                          maxLon
                                                      }) => {
    const theme = useMantineTheme();
    const [showShare, setShowShare] = useState(false);

    const colorScale = useMemo(() => {
        const lower = COUNTY_DOMAIN[0] > 1 ? Math.log(COUNTY_DOMAIN[0]) : 0;
        const upper = Math.log(COUNTY_DOMAIN[1]);
        return scaleLinear()
            .domain([lower, upper])
            .range([0, 1])
            .clamp(true);
    }, []);

    const stateMapLayer = useMemo(() =>
            generateMapLayer({
                tileLink: stateTiles,
                colorScale,
                id: 'state-map-layer',
                uniqueProperty: 'FIPS',
                targetId: 42071,
            })
        , [colorScale]);

    const districtMapLayer = useMemo(() =>
            generateMapLayer({
                tileLink: districtTiles,
                colorScale,
                id: 'district-map-layer',
                uniqueProperty: 'GEOID',
                targetId: 4202
            })
        , [colorScale]);

    const formatCurrency = (value: number) => {
        if (value < 1000) return `$${value}`;
        if (value < 1_000_000) return `$${(value / 1000).toFixed(0)}K`;
        if (value < 1_000_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
        return `$${(value / 1_000_000_000).toFixed(1)}B`;
    };

    const formatJobs = (value: number) => {
        if (value < 1000) return value.toString();
        return `${(value / 1000).toFixed(1)}K`;
    };

    const MetadataCard = () => (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
                <Group justify="space-between" align="flex-start">
                    <Stack gap="xs">
                        <Text size="xl" fw={700} c="dark">
                            {stateCode} {districtId && `District ${districtId.split('-')[1]}`}
                        </Text>
                        <Badge color="blue" variant="light" size="sm">
                            Economic Impact Report
                        </Badge>
                    </Stack>
                    <Group gap="xs">
                        <Button
                            leftSection={<IconShare size={16}/>}
                            variant="light"
                            size="sm"
                            onClick={() => setShowShare(true)}
                        >
                            Share
                        </Button>
                        <Button
                            leftSection={<IconDownload size={16}/>}
                            variant="filled"
                            size="sm"
                        >
                            Download
                        </Button>
                    </Group>
                </Group>

                <Stack gap="sm">
                    <Text size="lg" fw={600} c="dark">Representatives</Text>
                    {representativeName && (
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">Representative:</Text>
                            <Text size="sm" fw={500}>{representativeName}</Text>
                        </Group>
                    )}
                    {senatorNames?.map((senator, index) => (
                        <Group key={index} justify="space-between">
                            <Text size="sm" c="dimmed">Senator:</Text>
                            <Text size="sm" fw={500}>{senator}</Text>
                        </Group>
                    ))}
                </Stack>

                <Stack gap="sm">
                    <Text size="lg" fw={600} c="dark">Economic Impact</Text>
                    <Group justify="space-between">
                        <Text size="sm" c="dimmed">Total Economic Loss:</Text>
                        <Text size="sm" fw={600} c="red">{formatCurrency(econLoss)}</Text>
                    </Group>
                    <Group justify="space-between">
                        <Text size="sm" c="dimmed">Jobs Lost:</Text>
                        <Text size="sm" fw={600} c="red">{formatJobs(jobsLoss)}</Text>
                    </Group>
                    <Group justify="space-between">
                        <Text size="sm" c="dimmed">Grant Funding:</Text>
                        <Text size="sm" fw={600} c="green">{formatCurrency(grantFunds)}</Text>
                    </Group>
                    <Group justify="space-between">
                        <Text size="sm" c="dimmed">Terminated Funding:</Text>
                        <Text size="sm" fw={600} c="orange">{formatCurrency(terminatedLoss)}</Text>
                    </Group>
                </Stack>
            </Stack>
        </Card>
    );

    const MapCard = ({
                         title,
                         mapLayer,
                         paddingPx = 50
                     }: {
        title: string;
        mapLayer: MVTLayer;
        paddingPx?: number;
    }) => {
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
        }, [paddingPx]);

        return (
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="sm">
                    <Text size="lg" fw={600} c="dark">{title}</Text>
                    <div
                        ref={mapContainerRef}
                        style={{height: isMobile ? 250 : 300, position: 'relative'}}
                    >
                        <DeckGL
                            viewState={viewState}
                            controller={false}
                            layers={[mapLayer]}
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

    return (
        <Container size="xl" py="xl">
            <Stack gap="xl">
                {/* Header */}
                <div style={{textAlign: 'center'}}>
                    <Text size="xxl" fw={700} c="dark">
                        Science Research Impact Report
                    </Text>
                    <Text size="lg" c="dimmed" mt="xs">
                        Economic impact of federal health research cuts
                    </Text>
                </div>

                {isMobile ? (
                    <Stack gap="lg">
                        <MetadataCard/>
                        <MapCard
                            title={`${stateCode} State Overview`}
                            mapLayer={stateMapLayer}
                            paddingPx={80}
                        />
                        <MapCard
                            title={districtId ? `${districtId} District Detail` : "District Detail"}
                            mapLayer={districtMapLayer}
                            paddingPx={40}
                        />
                    </Stack>
                ) : (
                    <Grid>
                        <Grid.Col span={4}>
                            <MetadataCard/>
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <MapCard
                                title={`${stateCode} State Overview`}
                                mapLayer={stateMapLayer}
                                paddingPx={80}
                            />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <MapCard
                                title={districtId ? `${districtId} District Detail` : "District Detail"}
                                mapLayer={districtMapLayer}
                                paddingPx={40}
                            />
                        </Grid.Col>
                    </Grid>
                )}

                {/* Footer */}
                <div style={{textAlign: 'center', paddingTop: theme.spacing.xl}}>
                    <Text size="sm" c="dimmed">
                        Data sourced from federal grant databases and economic impact models
                    </Text>
                </div>
            </Stack>

            {/* Share Modal */}
            <Modal
                title={<Text size="xl">Share Report</Text>}
                opened={showShare}
                onClose={() => setShowShare(false)}
            >
                <SharePage title={`Economic Impact Report - ${stateCode} ${districtId || ''}`}/>
            </Modal>
        </Container>
    );
};