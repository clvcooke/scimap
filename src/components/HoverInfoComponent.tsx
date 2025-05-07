import {Card, Text, Flex} from '@mantine/core';
import {HOUSE_GEOID_TO_REP} from "../data/house-states.ts";

type BaseIDCTile = {
    state: string;
    grant_funds: number;
    IDC_loss: number;
    econ_loss: number;
    IDC_loss_log: number;
    econ_loss_log: number;
    jobs_loss: number;
}

type BaseGrantTile = {
    state: string;
    state_code: string;
    terminated_loss: number;
    terminated_econ_loss: number;
    terminated_job_loss: number;
    terminated_loss_noself: number;
    terminated_econ_loss_noself: number;
    terminated_jobs_loss_noself: number;
}

export type CountyIDCTileProperties = BaseIDCTile & {
    FIPS: number;
    county: string;
    pop_2024: number;
    grant_funds_25k: number;
    econ_loss_25k: number;
    IDC_loss_25k: number;
    fiscal_year: number;
};

export type CountyGrantTileProperties = BaseGrantTile & {
    FIPS: number;
}

export type DistrictIDCTileProperties = BaseIDCTile & {
    GEOID: number;
    rep_name: string;
    pol_party: string;
}

export type DistrictGrantTileProperties = BaseGrantTile & {
    GEOID: number;
    rep_name: string;
    pol_party: string;
}

export type StateGrantTileProperties = BaseGrantTile;

export type StateIDCTileProperties = BaseIDCTile & {
    pop_2024: number;
    grant_pc: number;
    loss_pc: number;
    econ_loss_pc: number;
    job_loss: number;
}

type IDCTileProperties = CountyIDCTileProperties | DistrictIDCTileProperties | StateIDCTileProperties;
type GrantTileProperties = CountyGrantTileProperties | DistrictGrantTileProperties | StateGrantTileProperties


export type HoverInfo = {
    properties: IDCTileProperties | GrantTileProperties;
    x: number;
    y: number;
}

type Props = {
    hoverInfo: HoverInfo | null;
    mode: "county" | "state" | 'districts' | "";
    layer: "idc" | "grant";
    showJobs: boolean;
};

export const HoverInfoComponent: React.FC<Props> = ({mode, layer, hoverInfo, showJobs}) => {
    if (!hoverInfo) {
        return null;
    }
    let county: string = "";
    let state: string = "";
    let rep_name: string = "";
    let pol_party: string = "";
    let econ_loss: number;
    let jobs_loss: number;
    if (layer === "idc") {
        if (mode === "county") {
            const properties = hoverInfo.properties as CountyIDCTileProperties;
            county = properties.county;
            state = properties.state;
            econ_loss = properties.econ_loss;
            jobs_loss = properties.jobs_loss;
        } else if (mode === "state") {
            const properties = hoverInfo.properties as StateIDCTileProperties;
            state = properties.state;
            econ_loss = properties.econ_loss;
            jobs_loss = properties.job_loss;
        } else {
            const properties = hoverInfo.properties as DistrictIDCTileProperties;
            econ_loss = properties.econ_loss;
            jobs_loss = properties.jobs_loss;
            state = properties.state;
            const geoid = properties.GEOID;
            console.log({geoid});

            try {
                rep_name = HOUSE_GEOID_TO_REP[geoid].rep_name;
                pol_party = HOUSE_GEOID_TO_REP[geoid].rep_party;
            } catch (e) {
                console.log({e});
            }

            if (!rep_name) {
                rep_name = properties.rep_name;
            }
            if (!pol_party) {
                pol_party = properties.pol_party;
            }
        }
    } else {
        if (mode === "county") {
            const properties = hoverInfo.properties as CountyGrantTileProperties;
            county = "NO COUNTY VALUE";
            state = properties.state;
            econ_loss = properties.terminated_econ_loss;
            jobs_loss = properties.terminated_job_loss;
        } else if (mode === "state") {
            const properties = hoverInfo.properties as StateGrantTileProperties;
            state = properties.state;
            econ_loss = properties.terminated_econ_loss;
            jobs_loss = properties.terminated_job_loss;
        } else {
            const properties = hoverInfo.properties as DistrictGrantTileProperties;
            econ_loss = properties.terminated_econ_loss;
            jobs_loss = properties.terminated_job_loss;
            state = properties.state;
            rep_name = properties.rep_name;
            pol_party = properties.pol_party;
        }
    }


    if (mode === "districts") {

        if (pol_party?.startsWith("Republican")) {
            rep_name = `${rep_name} (R)`;
        } else if (pol_party?.startsWith("Democrat")) {
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
            <Card shadow="sm" padding="md" radius="md" withBorder style={{color: 'black', textAlign: 'left'}}>
                <Flex direction="column" gap="xs">
                    {county && <Text size="md" style={{color: 'black'}}><b>County:</b> {county}</Text>}
                    {state && <Text size="md" style={{color: 'black'}}><b>{regionIndicator}:</b> {state}</Text>}
                    {rep_name && <Text size="md" style={{color: 'black'}}><b>Representative:</b> {rep_name}</Text>}
                    <Text size="md" style={{color: 'black'}}><b>Economic
                        Loss:</b> {(showLessThan ? `<$` : '$') + econ_loss_string}</Text>
                    {showJobs && <Text size="md" style={{color: 'black'}}><b>Jobs Lost:</b> {roundedJobsLoss}</Text>}
                </Flex>
            </Card>
        </div>
    );
};