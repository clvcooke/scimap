import React from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
    Text,
    Stack,
    Container,
    Grid,
    Group,
    Box, Image,
} from '@mantine/core';

import {QRCodeSVG} from 'qrcode.react';

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
        budg_NCI_cuts_econ_loss,
        budg_NIA_cuts_econ_loss,
        budg_NIAID_cuts_econ_loss,
        budg_NIH_cuts_econ_loss,
        budg_NIH_cuts_job_loss,
    } = reportCardData;

    // Get the current page URL for the QR code
    const currentUrl = window.location.href;

    const reportInfoCard = <ReportInfoCard
        state={state}
        districtId={districtId}
        econLossIDC={IDC_econ_loss}
        jobLossIDC={IDC_job_loss}
        econLossFY26={budg_NIH_cuts_econ_loss}
        cancerLossFY26={budg_NCI_cuts_econ_loss}
        infectLossFY26={budg_NIAID_cuts_econ_loss}
        agingLossFY26={budg_NIA_cuts_econ_loss}
        jobLossFY26={budg_NIH_cuts_job_loss}
        terminatedLoss={terminated_econ_loss}
        juniorSenator={processedJuniorSenator}
        seniorSenator={processedSeniorSenator}
        representativeName={processedRepName}
        topFiveImpact={top_five_impact}
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
                {/* Header with QR Code */}

                <Group justify="space-between" align="flex-start">
                    <Image src={"/science.png"}
                           h={76}
                           w={76}
                           p={8}
                    >
                    </Image>
                    <Stack gap={0} style={{flex: 1}}>
                        <Text size="xl" fw={700} c="dark">
                            Science Research Impact Report
                        </Text>
                        <Text size="lg" c="dimmed" mt="xs">
                            Economic impact of federal health research cuts
                        </Text>
                    </Stack>

                    {/* QR Code in top right */}
                    <Box
                        style={{
                            padding: '8px 8px 4px 8px',
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            border: '1px solid #e9ecef',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        <QRCodeSVG
                            value={currentUrl}
                            size={60}
                            level="M"
                            marginSize={0}
                        />
                    </Box>
                </Group>

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
};