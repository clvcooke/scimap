import React, {useState} from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
    Text,
    Stack,
    Grid,
    Group,
    Box,
    Image,
    ActionIcon,
    Anchor,
    Modal, Container,
} from '@mantine/core';
import {IconDownload, IconShare} from '@tabler/icons-react';
import {QRCodeSVG} from 'qrcode.react';

import {ReportInfoCard} from "./ReportInfoCard.tsx";
import {ReportMapCard} from "./ReportMapCard.tsx";
import {getReportCardData} from "../../data/report-card-data.ts";
import SharePage from '../SharePage.tsx';

import {isMobile} from "react-device-detect";

interface ReportCardProps {
    stateCode: string;
    districtId: string;
}

export const ReportCard: React.FC<ReportCardProps> = ({
                                                          stateCode,
                                                          districtId,
                                                      }) => {

    const reportCardData = getReportCardData({stateCode, districtId});
    // Local state to open the existing Share flow UI
    const [shareOpen, setShareOpen] = useState(false);
    if (!reportCardData) {
        return null;
    }
    const {
        district_bounds,
        state_bounds,
        state,
        state_code,
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
    const currentUrl = `https://scienceimpacts.org${window.location.pathname}${window.location.search}`;

    // Function to download the report card image
    const downloadReportCardImage = async () => {
        const imageUrl = `https://data.scienceimpacts.org/report-cards-v5/report-card-${stateCode}-${districtId}.png`;
        const fileName = `fact-sheet-${stateCode}-${districtId === "00" ? 'AL' : districtId}.png`;

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
        stateCode={stateCode}
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

    const districtTitle = isMobile ? `${state_code}-${districtId === '00' ? 'AL' : districtId}` : `${state} ${districtName}`

    return (

        <Container size={'100rem'}>

            <Stack gap="sm" p={{base: 'xs', sm: 'md'}}>
                {/* Mobile Header Layout */}
                <Stack gap="xs" hiddenFrom="sm">
                    <Text size="md" fw={700} c="dark" ta="center">
                        SCIMaP Scorecard: White House NIH FY26 Budget Proposal
                    </Text>
                    <Group justify="center" align="center" gap={'md'}>
                        <Text size="md" fw={500} c="dark" ta="center">
                            {state} {districtName}
                        </Text>
                        <Group gap="xs">
                            <ActionIcon
                                variant="transparent"
                                size="sm"
                                onClick={downloadReportCardImage}
                                title="Download Report Card Image"
                            >
                                <IconDownload size={18}/>
                            </ActionIcon>
                            <ActionIcon
                                variant="transparent"
                                color="blue"
                                size="sm"
                                onClick={() => setShareOpen(true)}
                                title="Share this scorecard"
                            >
                                <IconShare size={18}/>
                            </ActionIcon>
                        </Group>
                    </Group>
                </Stack>

                {/* Desktop Header Layout */}
                <Group justify="space-between" align="flex-start" visibleFrom="sm">
                    <Stack gap={0} align="center">
                        <Anchor href="/" underline="never">
                            <Image src={"/science.png"} h={76} w={76} p={8}/>
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

                    <Stack gap={0} style={{flex: 1}}>
                        <Text size="xl" fw={700} c="dark">SCIMaP Scorecard: White House NIH FY26 Budget Proposal</Text>
                        <Text size="lg" fw={500} c="dark">
                            {districtTitle} — FY2026 NIH Budget Impact{' '}

                        </Text>
                        <Text size="md" c="dimmed">
                            Projected district-level economic losses from cuts proposed in the White House FY26 NIH
                            budget
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
                        <Stack justify={'space-between'} align={'center'} gap={'lg'}>
                            <ActionIcon
                                variant="transparent"
                                color="blue"
                                size="lg"
                                onClick={() => setShareOpen(true)}
                                title="Share this scorecard"
                                aria-label="Share this scorecard"
                            >
                                <IconShare size={20}/>
                            </ActionIcon>
                            <ActionIcon
                                variant="transparent"
                                size="sm"
                                onClick={downloadReportCardImage}
                                title="Download Report Card Image"
                                aria-label="Download report card image"
                            >
                                <IconDownload size={20}/>
                            </ActionIcon>
                        </Stack>

                    </Group>
                </Group>

                {/* Mobile Layout - Stack vertically, no state card */}
                <Stack gap="md" hiddenFrom="sm">
                    {reportInfoCard}
                    <ReportMapCard
                        minLat={district_bounds.min_lat}
                        maxLat={district_bounds.max_lat}
                        minLon={district_bounds.min_lng}
                        maxLon={district_bounds.max_lng}
                        cardType={'district'}
                        targetDistrict={GEOID}
                        showColorbar={true}
                        height={400}
                    />
                </Stack>


                {/* Desktop Layout - Grid with state card */}
                <Grid gutter={'xs'} visibleFrom="sm" h={'100%'}>
                    <Grid.Col span={4} h={'100%'}>
                        <Stack gap={'xs'}>
                            {reportInfoCard}
                            <Box h={{base: "18rem", xl: '20rem', md: '18rem', sm: "12rem"}}>
                                <ReportMapCard
                                    minLat={state_bounds.min_lat}
                                    maxLat={state_bounds.max_lat}
                                    minLon={state_bounds.min_lng}
                                    maxLon={state_bounds.max_lng}
                                    paddingPx={10}
                                    cardType={'state'}
                                    targetDistrict={GEOID}
                                    targetState={stateCode}
                                    height={"100%"}
                                />
                            </Box>
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={8}>
                        <ReportMapCard
                            minLat={district_bounds.min_lat}
                            maxLat={district_bounds.max_lat}
                            minLon={district_bounds.min_lng}
                            maxLon={district_bounds.max_lng}
                            cardType={'district'}
                            targetDistrict={GEOID}
                            showColorbar={true}
                            height={'100%'}
                        />
                    </Grid.Col>
                </Grid>

                {/* Footer */}
                <div style={{textAlign: 'center'}}>
                    <Text size="xs" c="dimmed">
                        Funding losses are calculated by comparing the FY 2026 <a target={'_blank'}
                                                                                  href={'https://officeofbudget.od.nih.gov/pdfs/FY26/br/Overview%20of%20FY%202026%20Supplementary%20Tables.pdf'}>proposed
                        NIH budget</a> with average funding for a given district (using data from <a target={"_blank"}
                                                                                                     href={'https://reporter.nih.gov/'}>NIH
                        RePORTER</a>) between FY2020-2024. Corresponding economic and job losses are determined based on
                        an <a
                        href={"https://www.unitedformedicalresearch.org/wp-content/uploads/2025/03/UMR_NIH-Role-in-Sustaining-US-Economy-FY2024-2025-Update.pdf"}
                        target={"_blank"}>analysis of lost economic activity</a> and distributed among local communities
                        based on <a href={"https://lehd.ces.census.gov/data/"} target={"_blank"}>U.S. Census data</a>.
                        We also list losses specific to research funding for aging (NIA), cancer (NCI), and infectious
                        diseases (NIAID).
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
                    summary={`See the impact of the FY26 White House NIH Budget on ${districtTitle}`}
                    text={`See the impact of the FY26 White House NIH Budget on ${districtTitle}`}
                />
            </Modal>
        </Container>
    );
};