import { Card, Text, Flex } from '@mantine/core';

export type TileProperties = {
    FIPS: number;
    state: string;
    county: string;
    pop_2024: number;
    grant_funds: number;
    econ_loss: number;
    IDC_loss: number;
    jobs_loss: number;
    grant_funds_25k: number;
    econ_loss_25k: number;
    IDC_loss_25k: number;
    grant_funds_log: number;
    econ_loss_log: number;
    IDC_loss_log: number;
    fiscal_year: number;
    layerName: string;
};

export type HoverInfo = {
    properties: TileProperties;
    x: number;
    y: number;
}

type Props = {
    hoverInfo: HoverInfo | null;
};

export const HoverInfoComponent: React.FC<Props> = ({ hoverInfo }) => {
    if (!hoverInfo) {
        return null;
    }
    const { county, state, econ_loss, jobs_loss } = hoverInfo.properties;
    const econ_loss_string = econ_loss >= 1000000 ? Math.round(econ_loss / 1000000) + 'M' : econ_loss >= 1000 ? Math.round(econ_loss / 1000) + 'K' : Math.round(econ_loss);
    return (
        <div
            style={{
                position: 'absolute',
                left: hoverInfo.x,
                top: hoverInfo.y,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                zIndex: 1,
                pointerEvents: 'none',
            }}
        >
            <Card shadow="sm" padding="md" radius="md" withBorder style={{color: 'black', textAlign: 'left' }}>
                <Flex direction="column" gap="xs">
                    <Text size="md" style={{ color: 'black' }}><b>County:</b> {county}</Text>
                    <Text size="md" style={{ color: 'black' }}><b>State:</b> {state}</Text>
                    <Text size="md" style={{ color: 'black' }}><b>Economic Loss:</b> ${econ_loss_string}</Text>
                    <Text size="md" style={{ color: 'black' }}><b>Jobs Lost:</b> {Math.round(jobs_loss)}</Text>
                </Flex>
            </Card>
        </div>
    );
};