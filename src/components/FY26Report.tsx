import {Modal, Button, Text, Group, Stack} from '@mantine/core';
import {IconDownload} from '@tabler/icons-react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import {trackEvent} from "../utils/analytics.ts";
import {ANALYTICS_ACTIONS} from "../constants.ts";

interface FinancialReportModalProps {
    opened: boolean;
    onClose: () => void;
}

export function FY26Report({
                               opened,
                               onClose,
                           }: FinancialReportModalProps) {
    const imageUrl = 'https://data.scienceimpacts.org/FY2026-Loss-CD.png';
    const pdfUrl = 'https://data.scienceimpacts.org/scimap_whitehouse_fy2026_nih_budget_062325.pdf';
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            size="xl"
            title={
                <Text size="xl" fw={700}>
                    Report on the Financial Year 2026 Budget
                </Text>
            }
        >
            <Stack gap="md">
                <div style={{width: '100%'}}>
                    <Zoom>
                        <img
                            src={imageUrl}
                            alt="Financial Report 2026"
                            style={{width: '100%', height: 'auto'}}
                        />
                    </Zoom>
                </div>

                <Group justify="apart">
                    <a href={imageUrl} download={'FY2026-Loss-CD.png'} target="_blank">
                        <Button
                            leftSection={<IconDownload size={20}/>}
                            onClick={() => {
                                trackEvent(ANALYTICS_ACTIONS.downloadReport, 'download-report-image');
                            }}
                            variant="light"
                        >
                            Download Image
                        </Button>
                    </a>
                    <a href={pdfUrl} download={'FY2026-Loss-CD.png'} target="_blank">
                        <Button
                            leftSection={<IconDownload size={20}/>}
                            onClick={() => {
                                trackEvent(ANALYTICS_ACTIONS.downloadReport, 'download-report-pdf');
                            }}
                            variant="blue"
                        >
                            Download PDF Report
                        </Button>
                    </a>
                </Group>
            </Stack>
        </Modal>
    );
}