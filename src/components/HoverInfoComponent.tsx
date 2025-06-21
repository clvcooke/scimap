import {Card, Text, Flex, Stack} from '@mantine/core';
import {JSX} from "react";
import {NUMBER_FORMATTER} from "../constants.ts";

type BaseIDCTile = {
    state: string;
    state_code: string;
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

type BaseBudgetTile = {
    state: string;
    state_code: string;
    budg_NIH_cuts: number;
    budg_NIH_cuts_econ_loss: number;
    budg_NIH_cuts_job_loss: number;
    budg_NIA_cuts_econ_loss: number;
    budg_NCI_cuts_econ_loss: number;
    budg_NIAID_cuts_econ_loss: number;
}

export type CountyBudgetTileProperties = BaseBudgetTile & {
    FIPS: number;
    county: string;
}

export type StateBudgetTileProperties = BaseBudgetTile;
export type DistrictBudgetTileProperties = BaseBudgetTile & {
    GEOID: number;
    rep_name: string;
    pol_party: string;
    CD118FP: string;
};

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
    CD118FP: string;
}

export type DistrictGrantTileProperties = BaseGrantTile & {
    GEOID: number;
    rep_name: string;
    pol_party: string;
    CD118FP: string;
}

export type DistrictCombinedTileProperties = BaseCombinedTile & {
    GEOID: number;
    rep_name: string;
    pol_party: string;
    CD118FP: string;
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
type DistrictTile =
    DistrictCombinedTileProperties
    | DistrictGrantTileProperties
    | DistrictIDCTileProperties
    | DistrictBudgetTileProperties;


export type HoverInfo = {
    properties: IDCTileProperties | GrantTileProperties | CombinedTileProperties | BaseBudgetTile;
    x: number;
    y: number;
}

export enum HoverDisplayMode {
    IDC_GRANTS,
    TOTAL,
    TERM,
    BUDGET,
}

type Props = {
    hoverInfo: HoverInfo | null;
    mode: "county" | "state" | 'districts' | "";
    layer: "idc" | "grant" | "total" | 'budget';
    showJobs: boolean;
    displayMode?: HoverDisplayMode | null;
};

type HoverContentProps = Props & {
    hoverInfo: HoverInfo;
    county: string | null;
    state: string;
    repName: string | null;
    district: string | null;
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
        econLossString = `$${NUMBER_FORMATTER.format(econLoss)}`;
    }
    return econLossString
}

function generateJobLossString(jobLoss: number) {
    if (jobLoss < 10) {
        return "<10"
    } else {
        return `${NUMBER_FORMATTER.format(jobLoss)}`;
    }
}


function generateDefaultHover({
                                  layer,
                                  hoverInfo,
                                  showJobs,
                                  state,
                                  county,
                                  repName,
                                  district
                              }: HoverContentProps) {
    let econ_loss: number;
    let jobs_loss: number;
    let aging_loss: string | undefined = undefined;
    let cancer_loss: string | undefined = undefined;
    let infect_loss: string | undefined = undefined;
    let econ_loss_string = "Economic Loss"
    if (layer === "idc") {
        const tileProperties = hoverInfo.properties as IDCTileProperties;
        econ_loss = tileProperties.econ_loss;
        jobs_loss = tileProperties.jobs_loss;
    } else if (layer === "total") {
        const tileProperties = hoverInfo.properties as CombinedTileProperties;
        econ_loss = tileProperties.combined_econ_loss;
        jobs_loss = tileProperties.combined_job_loss;
    } else if (layer === 'budget') {
        const tileProperties = hoverInfo.properties as BaseBudgetTile;
        econ_loss = tileProperties.budg_NIH_cuts_econ_loss;
        jobs_loss = tileProperties.budg_NIH_cuts_job_loss;
        aging_loss = generateEconLossString(tileProperties.budg_NIA_cuts_econ_loss);
        cancer_loss = generateEconLossString(tileProperties.budg_NCI_cuts_econ_loss);
        infect_loss = generateEconLossString(tileProperties.budg_NIAID_cuts_econ_loss);
        econ_loss_string = "Total Economic Loss"
        showJobs = true;
    } else {
        const tileProperties = hoverInfo.properties as GrantTileProperties;
        econ_loss = tileProperties.terminated_econ_loss;
        jobs_loss = tileProperties.terminated_job_loss;
    }

    const econLossString = generateEconLossString(econ_loss);
    const jobLossString = generateJobLossString(jobs_loss)
    const showSubLosses = aging_loss !== undefined || cancer_loss !== undefined || infect_loss !== undefined;

    return <Flex direction="column" gap="0.1rem">
        {state && <Text size="lg" style={{color: 'black'}}><b>{state}{district && ` (${district})`}</b></Text>}
        {county && <Text size="md" style={{color: 'black'}}><b>County:</b> {county}</Text>}
        {repName && <Text size="md" style={{color: 'black'}}><b>Representative:</b> {repName}</Text>}
        {showJobs && <Text size="md" style={{color: 'black'}}><b>Total Jobs Lost:</b> {jobLossString}</Text>}
        {showSubLosses && <Stack gap={"0.05rem"}>
            <Text size="md" style={{color: 'black'}}><b>{econ_loss_string}:</b> {econLossString}</Text>
            {aging_loss !== undefined &&
                <Text size="sm" style={{color: 'black'}}><b>&#8226; Aging:</b> {aging_loss}</Text>}
            {cancer_loss !== undefined &&
                <Text size="sm" style={{color: 'black'}}><b>&#8226; Cancer:</b> {cancer_loss}</Text>}
            {infect_loss !== undefined &&
                <Text size="sm" style={{color: 'black'}}><b>&#8226; Infectious Disease:</b> {infect_loss}</Text>}
        </Stack>}


    </Flex>
}

function generateGrantIDCGrantsHover({
                                         hoverInfo,
                                         state,
                                         county,
                                         repName,
    district
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
        {state && <Text size="lg" style={{color: 'black'}}><b>{state}{district && ` (${district})`}</b></Text>}
        {county && <Text size="md" style={{color: 'black'}}><b>County:</b> {county}</Text>}
        {repName && <Text size="md" style={{color: 'black'}}><b>Representative:</b> {repName}</Text>}

        <Text size="md" style={{color: 'black'}}><b>Current
            Loss:</b> {currentEconLossString} and {currentJobLossString} jobs</Text>
        <Text size="md" style={{color: 'black'}}><b>Annual Future Loss:</b>
            {" "} {futureEconLossString} and {futureJobLossString} jobs</Text>
    </Flex>;
}

function generateTotalHover({
                                hoverInfo,
                                state,
                                county,
                                repName,
                            }: HoverContentProps) {

    const tileProperties = hoverInfo.properties as CombinedTileProperties;

    // Total Loss (Current + Future):
    const totalEconLoss = tileProperties.combined_econ_loss;
    const totalJobLoss = tileProperties.combined_job_loss;

    // Current Loss (Cancelled Grants):
    const currentEconLoss: number = tileProperties.terminated_econ_loss;
    const currentJobLoss = tileProperties.terminated_job_loss;

    // Annual Future Loss (Indirect Costs):
    const futureEconLoss = tileProperties.IDC_econ_loss;
    const futureJobLoss = tileProperties.IDC_job_loss;

    const totalEconLossString = generateEconLossString(totalEconLoss);
    const totalJobLossString = generateJobLossString(totalJobLoss);

    const currentEconLossString = generateEconLossString(currentEconLoss);
    const futureEconLossString = generateEconLossString(futureEconLoss);

    const currentJobLossString = generateJobLossString(currentJobLoss);
    const futureJobLossString = generateJobLossString(futureJobLoss)

    return <Flex direction="column" gap="xs">
        {state && <Text size="lg" style={{color: 'black'}}><b>{state}</b></Text>}
        {county && <Text size="md" style={{color: 'black'}}><b>County:</b> {county}</Text>}
        {repName && <Text size="md" style={{color: 'black'}}><b>Representative:</b> {repName}</Text>}

        <Text size="md" style={{color: 'black'}}><b>Total
            Loss:</b> {totalEconLossString} and {totalJobLossString} jobs</Text>
        <Text size="md" style={{color: 'black'}}><b>Current
            Loss:</b> {currentEconLossString} and {currentJobLossString} jobs</Text>
        <Text size="md" style={{color: 'black'}}><b>Annual Future Loss:</b>
            {" "} {futureEconLossString} and {futureJobLossString} jobs</Text>
    </Flex>;
}

function generateTermHover({
                               hoverInfo,
                               state,
                               county,
                               repName,
                           }: HoverContentProps) {

    const tileProperties = hoverInfo.properties as CombinedTileProperties;

    // Current Loss (Cancelled Grants):
    const currentEconLoss: number = tileProperties.terminated_econ_loss;
    const currentJobLoss = tileProperties.terminated_job_loss;


    const currentEconLossString = generateEconLossString(currentEconLoss);

    const currentJobLossString = generateJobLossString(currentJobLoss);

    return <Flex direction="column" gap="xs">
        {state && <Text size="lg" style={{color: 'black'}}><b>{state}</b></Text>}
        {county && <Text size="md" style={{color: 'black'}}><b>County:</b> {county}</Text>}
        {repName && <Text size="md" style={{color: 'black'}}><b>Representative:</b> {repName}</Text>}


        <Text size="md" style={{color: 'black'}}><b>Current
            Loss:</b> {currentEconLossString} and {currentJobLossString} jobs</Text>
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
    let district: string | null = null;
    if (mode === "county") {
        county = (hoverInfo.properties as CountyTile).county;
    } else if (mode === "districts") {
        const districtTileProperties = (hoverInfo.properties as DistrictTile);
        const raw_rep_name = districtTileProperties.rep_name;
        const raw_pol_party = districtTileProperties.pol_party;
        repName = processRepName(raw_rep_name, raw_pol_party);
        // 0 for at-large, otherwise number
        const districtNumber = districtTileProperties.CD118FP;
        district = `${districtTileProperties.state_code}-${districtNumber === "00" ? "AL" : districtNumber}`;
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
        district
    }

    if (displayMode === HoverDisplayMode.IDC_GRANTS) {
        hoverContent = generateGrantIDCGrantsHover(commonProps);
    } else if (displayMode === HoverDisplayMode.TOTAL) {
        hoverContent = generateTotalHover(commonProps);
    } else if (displayMode === HoverDisplayMode.TERM) {
        hoverContent = generateTermHover(commonProps);
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