import {Card, Text, Flex, Stack, Button, ActionIcon} from '@mantine/core';
import {IconX} from '@tabler/icons-react';
import {generateEconLossString, generateJobLossString, processPoliticianName} from "../utils/info.ts";
import {getHouseRep, getSenatorsList} from "../data/legislature.ts";
import {isMobile} from "react-device-detect";

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
    CD119FP: string;
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
    CD119FP: string;
}

export type DistrictGrantTileProperties = BaseGrantTile & {
    GEOID: number;
    rep_name: string;
    pol_party: string;
    CD119FP: string;
}

export type DistrictCombinedTileProperties = BaseCombinedTile & {
    GEOID: number;
    rep_name: string;
    pol_party: string;
    CD119FP: string;
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

// type CountyTile = CountyGrantTileProperties | CountyIDCTileProperties | CountyCombinedTileProperties;
// type DistrictTile =
//     DistrictCombinedTileProperties
//     | DistrictGrantTileProperties
//     | DistrictIDCTileProperties
//     | DistrictBudgetTileProperties;


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
    isPinned?: boolean;
    onClose?: () => void;
};

type HoverContentProps = Props & {
    hoverInfo: HoverInfo;
    county: string | null;
    state: string;
    repName: string | null;
    district: string | null;
    senatorNames: string[];
}


function generateDefaultHover({
                                  layer,
                                  hoverInfo,
                                  showJobs,
                                  state,
                                  county,
                                  repName,
                                  district,
                                  senatorNames,
                                  mode,
                                  isPinned
                              }: HoverContentProps & { mode: string, isPinned?: boolean }) {
    let econ_loss: number;
    let jobs_loss: number;
    let aging_loss: string | null = null;
    let cancer_loss: string | null = null;
    let infect_loss: string | null = null;
    let econ_loss_string = "Economic Loss"

    // Generate report card link for districts in budget mode
    const showKeyFactsLink = (isMobile || isPinned) && (mode === 'districts' || mode === 'state') && layer === 'budget';
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
        // Only show sub-losses when the fact sheet is NOT visible (i.e., in hover mode, not on the actual report card)
        // Since this is the hover component and not the report card itself, we show them based on whether this is a standalone view
        if (showKeyFactsLink) {
            aging_loss = generateEconLossString(tileProperties.budg_NIA_cuts_econ_loss);
            cancer_loss = generateEconLossString(tileProperties.budg_NCI_cuts_econ_loss);
            infect_loss = generateEconLossString(tileProperties.budg_NIAID_cuts_econ_loss);
        }
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

    let reportCardUrl = '';
    let isDc = false
    const stateCode = hoverInfo.properties.state_code;
    isDc = stateCode === 'DC'

    if (showKeyFactsLink) {
        if (mode === 'districts') {
            const tileProperties = hoverInfo.properties as DistrictBudgetTileProperties;
            const districtId = tileProperties.CD119FP;
            reportCardUrl = `${window.location.origin}/report?stateCode=${stateCode}&districtId=${districtId}`;
        } else if (mode === 'state') {
            reportCardUrl = `${window.location.origin}/report?stateCode=${stateCode}`;
        }
    }

    console.log("IS DC: ", isDc)

    // Show click prompt for district budget mode when not pinned
    const showClickPrompt = !isPinned && !isMobile && mode === 'districts' && layer === 'budget';

    return <Flex direction="column" gap="0.1rem" justify={'left'}>
        {state &&
            <Text size="lg" ta="center" style={{color: 'black'}}><b>{state}{district && !isDc && ` (${district})`}</b></Text>}
        {county && <Text size="md" ta="left" style={{color: 'black'}}><b>County:</b> {county}</Text>}
        {repName && !isDc && <Text size="md" ta="left" style={{color: 'black'}}><b>Representative:</b> {repName}</Text>}
        {senatorNames.map((senatorName, index) => <Text key={index} size="md" ta="left"
                                                        style={{color: 'black'}}><b>Senator:</b> {senatorName}</Text>)}
        {showJobs && <Text size="md" ta="left" style={{color: 'black'}}><b>Total Jobs Lost:</b> {jobLossString}</Text>}
        {showSubLosses && <Stack gap={"0.05rem"}>
            <Text size="md" ta="left" style={{color: 'black'}}><b>{econ_loss_string}:</b> {econLossString}</Text>
            {aging_loss &&
                <Text size="sm" ta="left" style={{color: 'black'}}><b>&#8226; Aging:</b> {aging_loss}</Text>}
            {cancer_loss &&
                <Text size="sm" ta="left" style={{color: 'black'}}><b>&#8226; Cancer:</b> {cancer_loss}</Text>}
            {infect_loss &&
                <Text size="sm" ta="left" style={{color: 'black'}}><b>&#8226; Infectious Disease:</b> {infect_loss}
                </Text>}
        </Stack>}

        {showClickPrompt && (
            <Text
                size="sm"
                ta="center"
                fw={450}
                c={'black.9'}
                style={{
                    fontStyle: 'italic',
                    marginTop: '0.5rem',
                    padding: '0.25rem',
                    backgroundColor: 'rgba(176,186,218,0.15)',
                    borderRadius: '4px',
                    border: '2px dashed #ced2d6'
                }}
            >
                💡 Click the district to see more info
            </Text>
        )}

        {showKeyFactsLink && !isDc && (
            <Button
                size="sm"
                variant="filled"
                style={{marginTop: '0.5rem', alignSelf: 'center'}}
                onClick={() => {
                    window.open(reportCardUrl, '_blank');
                }}
            >
                Open Fact Sheet
            </Button>
        )}

    </Flex>
}


function generateGrantIDCGrantsHover({
                                         hoverInfo,
                                         state,
                                         county,
                                         repName,
                                         district,
                                         senatorNames
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

    return <Flex direction="column" gap="xs" justify={'left'}>
        {state &&
            <Text size="lg" ta="center" style={{color: 'black'}}><b>{state}{district && ` (${district})`}</b></Text>}
        {county && <Text size="md" ta="left" style={{color: 'black'}}><b>County:</b> {county}</Text>}
        {repName && <Text size="md" ta="left" style={{color: 'black'}}><b>Representative:</b> {repName}</Text>}
        {senatorNames.map((senatorName, index) => (
            <Text key={index} size="md" ta="left" style={{color: 'black'}}><b>Senator:</b> {senatorName}</Text>
        ))}
        <Text size="md" ta="left" style={{color: 'black'}}><b>Current
            Loss:</b> {currentEconLossString} and {currentJobLossString} jobs</Text>
        <Text size="md" ta="left" style={{color: 'black'}}><b>Annual Future Loss:</b>
            {" "} {futureEconLossString} and {futureJobLossString} jobs</Text>
    </Flex>;
}

function generateTotalHover({
                                hoverInfo,
                                state,
                                county,
                                repName,
                                senatorNames
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
    const futureEconLossString = generateEconLossString(futureEconLoss)
    const currentJobLossString = generateJobLossString(currentJobLoss);
    const futureJobLossString = generateJobLossString(futureJobLoss)

    return <Flex direction="column" gap="xs" justify={'left'}>
        {state && <Text size="lg" ta="center" style={{color: 'black'}}><b>{state}</b></Text>}
        {county && <Text size="md" ta="left" style={{color: 'black'}}><b>County:</b> {county}</Text>}
        {repName && <Text size="md" ta="left" style={{color: 'black'}}><b>Representative:</b> {repName}</Text>}
        {senatorNames.map((senatorName, index) => (
            <Text key={index} size="md" ta="left" style={{color: 'black'}}><b>Senator:</b> {senatorName}</Text>
        ))}

        <Text size="md" ta="left" style={{color: 'black'}}><b>Total
            Loss:</b> {totalEconLossString} and {totalJobLossString} jobs</Text>
        <Text size="md" ta="left" style={{color: 'black'}}><b>Current
            Loss:</b> {currentEconLossString} and {currentJobLossString} jobs</Text>
        <Text size="md" ta="left" style={{color: 'black'}}><b>Annual Future Loss:</b>
            {" "} {futureEconLossString} and {futureJobLossString} jobs</Text>
    </Flex>;
}

function generateTermHover({
                               hoverInfo,
                               state,
                               county,
                               repName,
                               district,
                               senatorNames
                           }: HoverContentProps) {

    const tileProperties = hoverInfo.properties as GrantTileProperties;

    const currentEconLoss: number = tileProperties.terminated_econ_loss;
    const currentJobLoss = tileProperties.terminated_job_loss;

    const currentEconLossString = generateEconLossString(currentEconLoss);
    const currentJobLossString = generateJobLossString(currentJobLoss);

    return <Flex direction="column" gap="xs" justify={'left'}>
        {state &&
            <Text size="lg" ta="center" style={{color: 'black'}}><b>{state}{district && ` (${district})`}</b></Text>}
        {county && <Text size="md" ta="left" style={{color: 'black'}}><b>County:</b> {county}</Text>}
        {repName && <Text size="md" ta="left" style={{color: 'black'}}><b>Representative:</b> {repName}</Text>}
        {senatorNames.map((senatorName, index) => (
            <Text key={index} size="md" ta="left" style={{color: 'black'}}><b>Senator:</b> {senatorName}</Text>
        ))}
        <Text size="md" ta="left" style={{color: 'black'}}><b>Current
            Loss:</b> {currentEconLossString} and {currentJobLossString} jobs</Text>
    </Flex>;
}

export const HoverInfoComponent: React.FC<Props> = ({
                                                        mode,
                                                        layer,
                                                        hoverInfo,
                                                        showJobs,
                                                        displayMode,
                                                        isPinned = false,
                                                        onClose
                                                    }) => {
    if (!hoverInfo) {
        return null;
    }

    let county: string | null = null;
    if ('county' in hoverInfo.properties) {
        county = hoverInfo.properties.county;
    }

    let state = hoverInfo.properties.state;
    if (state === 'US Virgin Islands') {
        state = 'USVI';
    }

    let repName: string | null = null;
    if ('rep_name' in hoverInfo.properties) {
        const district = hoverInfo.properties.CD119FP;
        const stateCode = hoverInfo.properties.state_code;
        const key = `${stateCode}-${district}`;
        const rep = getHouseRep(key)
        repName = processPoliticianName(rep?.name, rep?.party);
    }

    let district: string | null = null;
    if ('GEOID' in hoverInfo.properties) {
        const geoid = String(hoverInfo.properties.GEOID);
        const districtNumber = geoid.slice(-2);
        district = districtNumber === '00' ? 'At-Large' : `District ${parseInt(districtNumber, 10)}`;
    }

    let senators: { name: string, party: string }[] = []
    if (mode === 'districts') {
        senators = getSenatorsList(hoverInfo.properties.state_code);
    } else if (mode === 'state') {
        senators = getSenatorsList(hoverInfo.properties.state_code);
    }

    const senatorNames: string[] = senators.map(senator => {
        return processPoliticianName(senator.name, senator.party);
    }).filter(name => name !== null) as string[];

    let contentFn;
    if (displayMode === HoverDisplayMode.IDC_GRANTS) {
        contentFn = generateGrantIDCGrantsHover;
    } else if (displayMode === HoverDisplayMode.TOTAL) {
        contentFn = generateTotalHover;
    } else if (displayMode === HoverDisplayMode.TERM) {
        contentFn = generateTermHover;
    } else {
        contentFn = generateDefaultHover;
    }

    const contentProps: HoverContentProps & { mode: string, isPinned?: boolean } = {
        hoverInfo,
        mode,
        layer,
        showJobs,
        displayMode,
        county,
        state,
        repName,
        district,
        senatorNames,
        isPinned,
        onClose
    };

    const content = contentFn(contentProps);

    // Positioning logic to keep the hover close to the cursor and within viewport bounds
    const viewportW = typeof window !== 'undefined' ? document.documentElement.clientWidth : 1920;
    const viewportH = typeof window !== 'undefined' ? document.documentElement.clientHeight : 1080;

    const cursorOffset = 6; // small offset to avoid covering the cursor
    const maxCardWidth = 360; // clamp width to reduce overflow artifacts
    const minCardWidth = 320; // ensure tooltip never looks too narrow
    const estCardHeight = 220; // rough estimate; helps prevent going off-screen bottom

    let desiredLeft = hoverInfo.x + cursorOffset;
    let desiredTop = hoverInfo.y + cursorOffset;

    // Flip horizontally if near right edge
    if (desiredLeft + maxCardWidth > viewportW - 8) {
        desiredLeft = Math.max(8, hoverInfo.x - maxCardWidth - cursorOffset);
    }
    // Clamp within viewport horizontally
    desiredLeft = Math.max(8, Math.min(desiredLeft, viewportW - maxCardWidth - 8));

    // Flip vertically if near bottom edge
    if (desiredTop + estCardHeight > viewportH - 100) {
        desiredTop = Math.max(8, hoverInfo.y - estCardHeight - cursorOffset);
    }
    // Clamp within viewport vertically
    desiredTop = Math.max(8, Math.min(desiredTop, viewportH - estCardHeight - 8));

    const baseCardStyle = {
        position: 'absolute' as const,
        top: desiredTop,
        left: desiredLeft,
        zIndex: 1000,
        maxWidth: `${maxCardWidth}px`,
        minWidth: `${minCardWidth}px`,
        overflow: 'hidden', // avoid ugly overflow edges
        borderRadius: '0px',
        backgroundColor: 'rgba(255,255,255,0.98)',
        backdropFilter: 'saturate(120%) blur(0px)',
        WebkitFontSmoothing: 'antialiased' as const,
    };

    const cardStyle = isPinned
        ? {
            ...baseCardStyle,
            pointerEvents: 'auto' as const,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
        }
        : {
            ...baseCardStyle,
            pointerEvents: (isMobile) ? 'auto' as const : 'none' as const, // Allow interaction on mobile when fact sheet button is shown
            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.14)',
        };

    return (
        <Card
            withBorder
            shadow="md"
            style={cardStyle}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            onMouseMove={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
        >
            {isPinned && onClose && (
                <ActionIcon
                    size="sm"
                    variant="subtle"
                    style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                    }}
                    onClick={() => {
                        console.log("Closing")
                        onClose()
                    }}
                >
                    <IconX size={14}/>
                </ActionIcon>
            )}
            {content}
        </Card>
    );
};