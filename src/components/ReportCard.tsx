import React from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
    Text,
    Stack,
    Container,
    Grid,
} from '@mantine/core';

import {ReportInfoCard} from "./ReportCard/ReportInfoCard.tsx";
import {ReportMapCard} from "./ReportCard/ReportMapCard.tsx";

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
    const reportInfoCard = <ReportInfoCard
        stateCode={stateCode}
        districtId={districtId}
        econLoss={econLoss}
        jobsLoss={jobsLoss}
        grantFunds={grantFunds}
        terminatedLoss={terminatedLoss}
        senatorNames={senatorNames}
        representativeName={representativeName}
    />;
    const minLatState = 39.74357822344452;
    const maxLatState = 42.28248;
    const minLonState = -80.5003234699697;
    const maxLonState = -74.71600701755278;
    const stateMapCard = <ReportMapCard
        minLat={minLatState}
        maxLat={maxLatState}
        minLon={minLonState}
        maxLon={maxLonState}
        paddingPx={10}
        cardType={'state'}/>
    const districtMapCard = <ReportMapCard
        minLat={minLat}
        maxLat={maxLat}
        minLon={minLon}
        maxLon={maxLon}
        cardType={'district'}
    />


    return (
        <Container size="xl" py="xl">
            <Stack gap="md">
                {/* Header */}
                <Stack gap={0}>
                    <Text size="xl" fw={700} c="dark">
                        Science Research Impact Report
                    </Text>
                    <Text size="lg" c="dimmed" mt="xs">
                        Economic impact of federal health research cuts
                    </Text>
                </Stack>


                <Grid gutter={'sm'}>
                    <Grid.Col span={4}>
                        <Stack gap={'sm'}>
                        {reportInfoCard}
                        {stateMapCard}
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={8}>
                        {districtMapCard}
                    </Grid.Col>
                </Grid>

                {/* Footer */}
                <div style={{textAlign: 'center'}}>
                    <Text size="sm" c="dimmed">
                        Data sourced from federal grant databases and economic impact models
                    </Text>
                </div>
            </Stack>
        </Container>
    );
    //
    // return (
    //     <Container size="xl" py="xl">
    //         <Stack gap="md">
    //             {/* Header */}
    //             <Stack gap={'xs'}>
    //                 <Text size="xl" fw={700} c="dark">
    //                     Science Research Impact Report
    //                 </Text>
    //                 <Text size="lg" c="dimmed" mt="xs">
    //                     Economic impact of federal health research cuts
    //                 </Text>
    //             </Stack>
    //
    //             {isMobile ? (
    //                 <Stack gap="lg">
    //                     {reportInfoCard}
    //                     {stateMapCard}
    //                     {districtMapCard}
    //                 </Stack>
    //             ) : (
    //                 <Grid>
    //                     <Grid.Col span={4}>
    //                         {reportInfoCard}
    //                     </Grid.Col>
    //                     <Grid.Col span={4}>
    //                         {stateMapCard}
    //                     </Grid.Col>
    //                     <Grid.Col span={4}>
    //                         {districtMapCard}
    //                     </Grid.Col>
    //                 </Grid>
    //             )}
    //
    //             {/* Footer */}
    //             <div style={{textAlign: 'center'}}>
    //                 <Text size="sm" c="dimmed">
    //                     Data sourced from federal grant databases and economic impact models
    //                 </Text>
    //             </div>
    //         </Stack>
    //     </Container>
    // );
};