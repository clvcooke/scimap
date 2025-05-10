import {Card, Text, Flex} from '@mantine/core';
import {JSX} from "react";

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

type BaseCombinedTile = {
    state: string;
    state_code: string;
    combined_econ_loss: number;
    combined_job_loss: number;
    terminated_econ_loss: number;
    terminated_job_loss: number;
    IDC_econ_loss: number;
    IDC_job_loss: number;
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
    county: string;
}

export type CountyCombinedTileProperties = BaseCombinedTile & {
    FIPS: number;
    county: string;
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

export type DistrictCombinedTileProperties = BaseCombinedTile & {
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

export type StateCombinedTileProperties = BaseCombinedTile;

type IDCTileProperties = CountyIDCTileProperties | DistrictIDCTileProperties | StateIDCTileProperties;
type GrantTileProperties = CountyGrantTileProperties | DistrictGrantTileProperties | StateGrantTileProperties;
type CombinedTileProperties =
    CountyCombinedTileProperties
    | DistrictCombinedTileProperties
    | StateCombinedTileProperties;

type CountyTile = CountyGrantTileProperties | CountyIDCTileProperties | CountyCombinedTileProperties;
type DistrictTile = DistrictCombinedTileProperties | DistrictGrantTileProperties | DistrictIDCTileProperties;


export type HoverInfo = {
    properties: IDCTileProperties | GrantTileProperties | CombinedTileProperties;
    x: number;
    y: number;
}

export enum HoverDisplayMode {
    IDC_GRANTS,
    TOTAL

}

type Props = {
    hoverInfo: HoverInfo | null;
    mode: "county" | "state" | 'districts' | "";
    layer: "idc" | "grant" | "total";
    showJobs: boolean;
    displayMode?: HoverDisplayMode | null;
};

type HoverContentProps = Props & {
    hoverInfo: HoverInfo;
    county: string | null;
    state: string;
    repName: string | null;
    regionIndicator: string;
}

function processRepName(repName: string, party: string): string {
    let rep_name = repName;
    if (party?.startsWith("Republican")) {
        rep_name = `${rep_name} (R)`;
    } else if (party?.startsWith("Democrat")) {
        rep_name = `${rep_name} (D)`;
    } else {
        if (!rep_name?.trim()) {
            rep_name = `Vacant Seat`;
        } else {
            rep_name = `${rep_name} (I)`;
        }
    }
    rep_name = rep_name.replace('""', '"').replace('""', '"');
    return rep_name;
}

function generateEconLossString(econLoss: number) {
    let econLossString: string;
    if (econLoss < 100) {
        econLossString = "<$100"
    } else {
        econLossString = '$' + (econLoss >= 1000000 ? `${Math.round(econLoss / 1000000)}` + 'M' :
            econLoss >= 1000 ? `${Math.round(econLoss / 1000)}` + 'K' : `${Math.round(econLoss)}`);
    }
    return econLossString
}

function generateJobLossString(jobLoss: number) {
    if (jobLoss < 10) {
        return "<10"
    } else {
        return `${Math.round(jobLoss)}`;
    }
}


function generateDefaultHover({
                                  layer,
                                  hoverInfo,
                                  showJobs,
                                  state,
                                  county,
                                  repName,
                                  regionIndicator
                              }: HoverContentProps) {
    let econ_loss: number;
    let jobs_loss: number;

    if (layer === "idc") {
        const tileProperties = hoverInfo.properties as IDCTileProperties;
        econ_loss = tileProperties.econ_loss;
        jobs_loss = tileProperties.jobs_loss;
    } else if (layer === "total") {
        const tileProperties = hoverInfo.properties as CombinedTileProperties;
        econ_loss = tileProperties.combined_econ_loss;
        jobs_loss = tileProperties.combined_job_loss;
    } else {
        const tileProperties = hoverInfo.properties as GrantTileProperties;
        econ_loss = tileProperties.terminated_econ_loss;
        jobs_loss = tileProperties.terminated_job_loss;
    }

    const econLossString = generateEconLossString(econ_loss);
    const jobLossString = generateJobLossString(jobs_loss)


    return <Flex direction="column" gap="xs">
        {county && <Text size="md" style={{color: 'black'}}><b>County:</b> {county}</Text>}
        {state && <Text size="md" style={{color: 'black'}}><b>{regionIndicator}:</b> {state}</Text>}
        {repName && <Text size="md" style={{color: 'black'}}><b>Representative:</b> {repName}</Text>}
        <Text size="md" style={{color: 'black'}}><b>Economic
            Loss:</b> {econLossString}</Text>
        {showJobs && <Text size="md" style={{color: 'black'}}><b>Jobs Lost:</b> {jobLossString}</Text>}
    </Flex>
}

function generateGrantIDCGrantsHover({
                                         hoverInfo,
                                         state,
                                         county,
                                         repName,
                                         regionIndicator
                                     }: HoverContentProps) {

    const tileProperties = hoverInfo.properties as CombinedTileProperties;

    const currentEconLoss: number = tileProperties.terminated_econ_loss;
    const currentJobLoss = tileProperties.terminated_job_loss;

    const futureEconLoss = tileProperties.IDC_econ_loss;
    const futureJobLoss = tileProperties.IDC_job_loss;

    const currentEconLossString = generateEconLossString(currentEconLoss);
    const futureEconLossString = generateEconLossString(futureEconLoss)
    const currentJobLossString = generateJobLossString(currentJobLoss);
    const futureJobLossString = generateJobLossString(futureJobLoss)

    return <Flex direction="column" gap="xs">
        {county && <Text size="md" style={{color: 'black'}}><b>County:</b> {county}</Text>}
        {state && <Text size="md" style={{color: 'black'}}><b>{regionIndicator}:</b> {state}</Text>}
        {repName && <Text size="md" style={{color: 'black'}}><b>Representative:</b> {repName}</Text>}

        <Text size="md" style={{color: 'black'}}><b>Current
            Losses:</b> {currentEconLossString} and {currentJobLossString} jobs</Text>
        <Text size="md" style={{color: 'black'}}><b>Annual Future Losses:</b>
            {" "} {futureEconLossString} and {futureJobLossString} jobs</Text>
    </Flex>;
}

function generateTotalHover({
                                         hoverInfo,
                                         state,
                                         county,
                                         repName,
                                         regionIndicator
                                     }: HoverContentProps) {

    const tileProperties = hoverInfo.properties as CombinedTileProperties;

    // Total Losses (Current + Future):
    const totalEconLoss = tileProperties.combined_econ_loss;
    const totalJobLoss = tileProperties.combined_job_loss;

    // Current Losses (Cancelled Grants):
    const currentEconLoss: number = tileProperties.terminated_econ_loss;
    const currentJobLoss = tileProperties.terminated_job_loss;

    // Annual Future Losses (Indirect Costs):
    const futureEconLoss = tileProperties.IDC_econ_loss;
    const futureJobLoss = tileProperties.IDC_job_loss;

    const totalEconLossString = generateEconLossString(totalEconLoss);
    const totalJobLossString = generateJobLossString(totalJobLoss);

    const currentEconLossString = generateEconLossString(currentEconLoss);
    const futureEconLossString = generateEconLossString(futureEconLoss);

    const currentJobLossString = generateJobLossString(currentJobLoss);
    const futureJobLossString = generateJobLossString(futureJobLoss)

    return <Flex direction="column" gap="xs">
        {county && <Text size="md" style={{color: 'black'}}><b>County:</b> {county}</Text>}
        {state && <Text size="md" style={{color: 'black'}}><b>{regionIndicator}:</b> {state}</Text>}
        {repName && <Text size="md" style={{color: 'black'}}><b>Representative:</b> {repName}</Text>}

        <Text size="md" style={{color: 'black'}}><b>Total
            Losses:</b> {totalEconLossString} and {totalJobLossString} jobs</Text>
        <Text size="md" style={{color: 'black'}}><b>Current
            Losses:</b> {currentEconLossString} and {currentJobLossString} jobs</Text>
        <Text size="md" style={{color: 'black'}}><b>Annual Future Losses:</b>
            {" "} {futureEconLossString} and {futureJobLossString} jobs</Text>
    </Flex>;
}

export const HoverInfoComponent: React.FC<Props> = ({mode, layer, hoverInfo, showJobs, displayMode}) => {
    if (!hoverInfo) {
        return null;
    }
    console.log("HOVER INFO", {hoverInfo})
    const state = hoverInfo.properties.state;
    let county: string | null = null;
    let repName: string | null = null;
    if (mode === "county") {
        county = (hoverInfo.properties as CountyTile).county;
    } else if (mode === "districts") {
        const districtTileProperties = (hoverInfo.properties as DistrictTile);
        const raw_rep_name = districtTileProperties.rep_name;
        const raw_pol_party = districtTileProperties.pol_party;
        repName = processRepName(raw_rep_name, raw_pol_party)
    }

    let regionIndicator = "State"
    if (state === "Puerto Rico" || state === "District of Columbia") {
        regionIndicator = "Territory"
    }

    let hoverContent: JSX.Element;

    const commonProps: HoverContentProps = {
        mode,
        layer,
        hoverInfo,
        showJobs,
        county,
        state,
        repName,
        regionIndicator

    }

    if (displayMode === HoverDisplayMode.IDC_GRANTS) {
        hoverContent = generateGrantIDCGrantsHover(commonProps);
    } else if (displayMode === HoverDisplayMode.TOTAL) {
        hoverContent = generateTotalHover(commonProps);
    } else {
        hoverContent = generateDefaultHover(commonProps)
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
                {hoverContent}
            </Card>
        </div>
    );
};