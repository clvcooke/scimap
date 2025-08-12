import React, {useState} from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
    Text,
    Stack,
    Container,
    Grid,
    Group,
    Box,
    Image,
    ActionIcon,
    Anchor,
    Modal,
} from '@mantine/core';
import { IconDownload, IconShare } from '@tabler/icons-react';
import { QRCodeSVG } from 'qrcode.react';

import { ReportInfoCard } from "./ReportInfoCard.tsx";
import { ReportMapCard } from "./ReportMapCard.tsx";
import { getReportCardData } from "../../data/report-card-data.ts";
import SharePage from '../SharePage.tsx';

interface ReportCardProps {
    stateCode: string;
    districtId: string;
}

export const ReportCard: React.FC<ReportCardProps> = ({
                                                          stateCode,
                                                          districtId,
                                                      }) => {

    const reportCardData = getReportCardData({ stateCode, districtId });
    // Local state to open the existing Share flow UI
    const [shareOpen, setShareOpen] = useState(false);
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



    // Function to download the report card image
    const downloadReportCardImage = async () => {
        const imageUrl = `https://data.scienceimpacts.org/report-cards-v2/report-card-${stateCode}-${districtId}.png`;
        const fileName = `report-card-${stateCode}-${districtId === "00" ? 'AL' : districtId}.png`;

        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading image:', error);
        }
    };

    const districtName = districtId == '00' ? 'At Large' : `District ${districtId}`;
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

    const districtTitle = `${state} ${districtName}`

    return (
        <Container size="xl" py="xl">
            <Stack gap="md">
                {/* Header with QR Code and Download/Share Buttons */}
                <Group justify="space-between" align="flex-start">
                    <Stack gap={0} align="center">
                        <Anchor href="/" underline="never">
                            <Image src={"/science.png"}
                                   h={76}
                                   w={76}
                                   p={8}
                            >
                            </Image>
                        </Anchor>
                        <Text
                            size="xs"
                            c="dimmed"
                            fw={500}
                            style={{
                                letterSpacing: '0.5px',
                                textTransform: 'lowercase'
                            }}
                        >
                            scienceimpacts.org
                        </Text>
                    </Stack>

                    <Stack gap={0} style={{ flex: 1 }}>
                        <Text size="xl" fw={700} c="dark">SCIMaP Scorecard: White House NIH FY26 Budget Proposal</Text>
                        <Text size="lg" fw={500} c="dark">
                            {districtTitle} — FY2026 NIH Budget Impact{' '}
                            <ActionIcon
                                variant="transparent"
                                size="sm"
                                onClick={downloadReportCardImage}
                                title="Download Report Card Image"
                                aria-label="Download report card image"
                            >
                                <IconDownload size={20} />
                            </ActionIcon>
                        </Text>
                        <Text size="md" c="dimmed">
                            Projected district-level economic losses from cuts proposed in the White House FY26 NIH budget
                        </Text>
                    </Stack>

                    {/* QR Code and Share button in top right */}
                    <Group gap="xs" align="center">
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
                        <ActionIcon
                            variant="transparent"
                            color="blue"
                            size="lg"
                            onClick={() => setShareOpen(true)}
                            title="Share this scorecard"
                            aria-label="Share this scorecard"
                        >
                            <IconShare size={20} />
                        </ActionIcon>
                    </Group>
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
                <div style={{ textAlign: 'center' }}>
                    <Text size="sm" c="dimmed">
                        Data sourced from federal grant databases and economic impact models
                    </Text>
                </div>
            </Stack>

            {/* Share modal using the existing Share flow */}
            <Modal
                opened={shareOpen}
                onClose={() => setShareOpen(false)}
                title="Share this scorecard"
                size="md"
                centered
            >
                <SharePage
                    title={`SCIMaP Scorecard: ${districtTitle}`}
                    summary="Projected district-level economic losses from cuts proposed in the White House FY26 NIH budget"
                />
            </Modal>
        </Container>
    );
};