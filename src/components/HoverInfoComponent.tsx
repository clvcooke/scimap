import { Card, Text, Flex } from '@mantine/core';
import {HOUSE_GEOID_TO_STATE} from "../data/house-states.ts";

export type DistrictTileProperties = {
    GEOID: number;
    grant_funds: number;
    grant_funds_econ: number;
    IDC_loss: number;
    econ_loss: number;
    jobs_loss: number;
    grant_funds_econ_loss_log: number;
    econ_loss_log: number;
    IDC_loss_log: number;
    fiscal_year: number;
    rep_name: string;
    pol_party: string;
}

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
    properties: CountyTileProperties | StateTileProperties | DistrictTileProperties;
    x: number;
    y: number;
}

type Props = {
    hoverInfo: HoverInfo | null;
    mode: "county" | "state" | 'districts';
    showJobs: boolean;
};

export const HoverInfoComponent: React.FC<Props> = ({ mode, hoverInfo, showJobs }) => {
    if (!hoverInfo) {
        return null;
    }
    let county: string = "";
    let state: string = "";
    let rep_name: string = "";
    let econ_loss: number;
    let jobs_loss: number;
    if (mode === "county") {
        const properties = hoverInfo.properties as CountyTileProperties;
        county = properties.county;
        state = properties.state;
        econ_loss = properties.econ_loss;
        jobs_loss = properties.jobs_loss;
    } else  if (mode === "state") {
        const properties = hoverInfo.properties as StateTileProperties;
        state = properties.state;
        econ_loss = properties.econ_loss;
        jobs_loss = properties.jobs_loss;
    } else {
        const properties = hoverInfo.properties as DistrictTileProperties;
        econ_loss = properties.econ_loss;
        jobs_loss = properties.jobs_loss;
        rep_name = properties.rep_name;
        const geoid = properties.GEOID;
        try{
            // @ts-expect-error: stuff
            state = HOUSE_GEOID_TO_STATE[geoid?.toString()] ?? "";
        } catch(error) {
            console.error(error);
            state = "";
        }


        if (properties?.pol_party?.startsWith("Republican")) {
            rep_name = `${rep_name} (R)`;
        } else if (properties?.pol_party?.startsWith("Democrat")) {
            rep_name = `${rep_name} (D)`;
        } else {
            console.log({rep_name});
            if (!rep_name?.trim()) {
                rep_name = `Vacant Seat`;
            } else {
                rep_name = `${rep_name} (I)`;
            }
        }
        rep_name = rep_name.replace('""', '"').replace('""', '"');
    }

    let regionIndicator = "State"
    if (state === "Puerto Rico" || state === "District of Columbia") {
        regionIndicator = "Territory"
    }

    let econ_loss_string;
    let showLessThan = false;
    if (econ_loss < 100) {
        econ_loss_string = "100"
        showLessThan = true;
    } else {
        econ_loss_string = econ_loss >= 1000000 ? Math.round(econ_loss / 1000000) + 'M' : econ_loss >= 1000 ? Math.round(econ_loss / 1000) + 'K' : Math.round(econ_loss);
    }
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
                zIndex: 100,
                pointerEvents: 'none',
            }}
        >
            <Card shadow="sm" padding="md" radius="md" withBorder style={{color: 'black', textAlign: 'left' }}>
                <Flex direction="column" gap="xs">
                    {county && <Text size="md" style={{ color: 'black' }}><b>County:</b> {county}</Text>}
                    {state && <Text size="md" style={{ color: 'black' }}><b>{regionIndicator}:</b> {state}</Text>}
                    {rep_name && <Text size="md" style={{ color: 'black' }}><b>Representative:</b> {rep_name}</Text>}
                    <Text size="md" style={{ color: 'black' }}><b>Economic Loss:</b> {(showLessThan ? `<$` : '$') + econ_loss_string}</Text>
                    {showJobs && <Text size="md" style={{ color: 'black' }}><b>Jobs Lost:</b> {roundedJobsLoss}</Text>}
                </Flex>
            </Card>
        </div>
    );
};