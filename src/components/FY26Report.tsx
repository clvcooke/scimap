import {Modal, Button, Text, Group, Stack} from '@mantine/core';
import {IconDownload} from '@tabler/icons-react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

interface FinancialReportModalProps {
    opened: boolean;
    onClose: () => void;
}

export function FY26Report({
                               opened,
                               onClose,
                           }: FinancialReportModalProps) {
    const imageUrl = 'https://data.scienceimpacts.org/FY2026-Loss-CD.png';
    const pdfUrl = 'https://scimap.org/images/FY26Report.pdf';
    const handleImageDownload = () => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'FY2026-Loss-CD.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePdfDownload = () => {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'financial-report-2026.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

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
                            // onClick={handleImageDownload}
                            variant="light"
                        >
                            Download Image
                        </Button>
                    </a>
                    <a href={pdfUrl} download={'FY2026-Loss-CD.png'} target="_blank">
                        <Button
                            leftSection={<IconDownload size={20}/>}
                            // onClick={handleImageDownload}
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