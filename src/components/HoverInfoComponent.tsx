import { Card, Text, Flex } from '@mantine/core';



export type StateTileProperties = {
    state_code: string;
    state: string;
    grant_funds: number;
    IDC_loss: number;
    econ_loss: number;
    pop_2024: number;
    grant_pc: number;
    loss_pc: number;
    econ_loss_pc: number;
    jobs_loss: number
}

export type CountyTileProperties = {
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
    properties: CountyTileProperties | StateTileProperties;
    x: number;
    y: number;
}

type Props = {
    hoverInfo: HoverInfo | null;
    mode: "county" | "state";
};

export const HoverInfoComponent: React.FC<Props> = ({ mode, hoverInfo }) => {
    if (!hoverInfo) {
        return null;
    }
    let county: string = "";
    let state: string;
    let econ_loss: number;
    let jobs_loss: number;
    if (mode === "county") {
        const properties = hoverInfo.properties as CountyTileProperties;
        county = properties.county;
        state = properties.state;
        econ_loss = properties.econ_loss;
        jobs_loss = properties.jobs_loss;
    } else {
        const properties = hoverInfo.properties as StateTileProperties;
        state = properties.state;
        econ_loss = properties.econ_loss;
        jobs_loss = properties.jobs_loss;
    }

    let regionIndicator = "State"
    if (state === "Puerto Rico") {
        regionIndicator = "Territory"
    }


    const econ_loss_string = econ_loss >= 1000000 ? Math.round(econ_loss / 1000000) + 'M' : econ_loss >= 1000 ? Math.round(econ_loss / 1000) + 'K' : Math.round(econ_loss);
    let roundedJobsLoss: number | string = Math.round(jobs_loss);
    if (roundedJobsLoss < 10) {
        roundedJobsLoss = "<10"
    }
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
                    {county && <Text size="md" style={{ color: 'black' }}><b>County:</b> {county}</Text>}
                    <Text size="md" style={{ color: 'black' }}><b>{regionIndicator}:</b> {state}</Text>
                    <Text size="md" style={{ color: 'black' }}><b>Economic Loss:</b> ${econ_loss_string}</Text>
                    <Text size="md" style={{ color: 'black' }}><b>Jobs Lost:</b> {roundedJobsLoss}</Text>
                </Flex>
            </Card>
        </div>
    );
};