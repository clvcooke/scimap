import React from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
    Text,
    Stack,
    Container,
    Grid,
} from '@mantine/core';

import {ReportInfoCard} from "./ReportInfoCard.tsx";
import {ReportMapCard} from "./ReportMapCard.tsx";
import {getReportCardData} from "../../data/report-card-data.ts";

interface ReportCardProps {
    stateCode: string;
    districtId: string;
}

export const ReportCard: React.FC<ReportCardProps> = ({
                                                          stateCode,
                                                          districtId,
                                                      }) => {

    const reportCardData = getReportCardData({stateCode, districtId});
    if (!reportCardData) {
        return null;
    }
    const {
        district_bounds,
        state_bounds,
        state,
        IDC_econ_loss,
        IDC_job_loss,
        terminated_econ_loss,
        GEOID,
        processedRepName,
        processedJuniorSenator,
        processedSeniorSenator,
        top_five_impact,
    } = reportCardData;


    const reportInfoCard = <ReportInfoCard
        state={state}
        districtId={districtId}
        econLoss={IDC_econ_loss}
        jobsLoss={IDC_job_loss}
        terminatedLoss={terminated_econ_loss}
        juniorSenator={processedJuniorSenator}
        seniorSenator={processedSeniorSenator}
        representativeName={processedRepName}
    />;

    const stateMapCard = <ReportMapCard
        minLat={state_bounds.min_lat}
        maxLat={state_bounds.max_lat}
        minLon={state_bounds.min_lng}
        maxLon={state_bounds.max_lng}
        paddingPx={10}
        cardType={'state'}
        targetDistrict={GEOID}
        targetState={stateCode}
    />
    const districtMapCard = <ReportMapCard
        minLat={district_bounds.min_lat}
        maxLat={district_bounds.max_lat}
        minLon={district_bounds.min_lng}
        maxLon={district_bounds.max_lng}
        cardType={'district'}
        targetDistrict={GEOID}
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