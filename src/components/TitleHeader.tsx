import {ActionIcon, Container, Flex, Popover, Text, Title, Group, Stack, Anchor} from "@mantine/core";
import {isMobile} from "react-device-detect";
import {
    ANALYTICS_ACTIONS,
    BaseLayer,
    formattedCost,
    formattedJobs,
    formattedTermCost,
    formattedTermJobs,
    Overlay
} from "../constants.ts";
import {IconInfoCircleFilled} from "@tabler/icons-react";
import {FORMATTED_TILE_VERSION} from "../data/tile-version.ts";
import {trackEvent} from "../utils/analytics.ts";

const textSize = isMobile ? 'sm' : 'md'
const basicTextStyle = {
    fontFamily: 'Open Sans, sans-serif',
    color: 'rgba(0, 0, 0, 0.8)',
    textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)' // Subtle text shadow
}

function idcOnly() {
    return <Flex justify="center" gap="md" align="center" style={{marginTop: '5px', marginBottom: '5px'}}>
        <Text span size={textSize} style={basicTextStyle}>
            <b>Future Economic Loss:</b> $16B and 68K jobs per year
        </Text>
    </Flex>
}

function idcGrants() {
    return <Flex justify="center" gap="md" align="center" style={{marginTop: '5px', marginBottom: '5px'}}>
        <Stack gap={'0.1rem'}>
            <Text
                size={textSize}
                span
                style={basicTextStyle}
            > <b>Current Economic Loss:</b> ${formattedTermCost} and {formattedTermJobs} jobs</Text>
            <Text span size={textSize} style={basicTextStyle}>
                <b>Future Economic Loss:</b> ${formattedCost} and {formattedJobs} jobs per year
            </Text>
        </Stack>
    </Flex>
}

function termGrants() {
    return <Flex justify="center" gap="sm" align="center" style={{marginTop: '5px', marginBottom: '5px'}}>
        <Text>
            <Text
                size={textSize}
                span
                style={basicTextStyle}
            ><b>Current Economic Loss:</b> $4.9B and 21K jobs</Text>
        </Text>
    </Flex>
}

function totalOnly() {
    return <Flex justify="center" gap="sm" align="center" style={{marginTop: '5px', marginBottom: '5px'}}>
        <Text>
            <Text
                size={textSize}
                span
                style={basicTextStyle}
            ><b>Current + Future Economic Loss:</b> $20.9B and 89K jobs</Text>
        </Text>
    </Flex>
}

function defaultText() {
    return <Flex justify="center" gap="sm" align="center" style={{marginTop: '5px', marginBottom: '5px'}}>
        <Text>
            <Text
                size={textSize}
                span
                fw={700}
                style={{
                    fontFamily: 'Open Sans, sans-serif',
                    color: 'rgba(0, 0, 0, 0.8)',
                    textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)' // Subtle text shadow
                }}
            >National Impact per year: </Text>
            <Text span size={textSize} style={{
                fontFamily: 'Open Sans, sans-serif',
                color: 'rgba(0, 0, 0, 0.8)',
                textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)' // Subtle text shadow
            }}>
                ${formattedCost} and {formattedJobs} Jobs Lost
            </Text>
        </Text>
    </Flex>
}

export function FY26TitleHeader({onClickReport}: { onClickReport: () => void}) {
    return <Container>
        <div style={{position: 'relative', width: '100%'}}>
            <Group align={'center'} gap={'0.2rem'} justify={'center'}>
                <Title
                    size={isMobile ? 'h4' : 'h2'}
                    style={{
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 700,
                        color: 'rgba(0, 0, 0, 0.9)',
                    }}
                >
                    {isMobile && "NIH Budget Proposal Economic Impact"}
                    {!isMobile && "SCIMaP: View Impact of the FY26 NIH Budget Proposal"}
                </Title>


            </Group>
        </div>
        <Stack justify="center" gap="0" align="center" style={{marginTop: '5px', marginBottom: '5px'}}>
            <Text>
                <Text
                    size={textSize}
                    span
                    style={basicTextStyle}
                ><b>FY26{!isMobile && " Projected"} Economic Loss:</b> $47B and 202K Jobs Lost</Text>
            </Text>
            <Anchor underline={'always'} onClick={ () => {
                trackEvent(
                    ANALYTICS_ACTIONS.readReport,
                    'open_report_modal',
                )
                onClickReport()
            }}><b>Read the Full Report</b></Anchor>
        </Stack>
    </Container>

}

export function TitleHeader({baseLayer, overlay}: { baseLayer?: BaseLayer, overlay?: Overlay }) {
    return <Container>
        <div style={{position: 'relative', width: '100%'}}>
            <Group align={'center'} gap={'0.2rem'} justify={'center'}>
                <Title
                    size={isMobile ? 'h4' : 'h2'}
                    style={{
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 700,
                        color: 'rgba(0, 0, 0, 0.9)',
                    }}
                >
                    {isMobile && "Federal Health Research Cuts"}
                    {!isMobile && "SCIMaP: View Impact of Federal Health Research Cuts"}
                </Title>
                <Popover withArrow>
                    <Popover.Target>
                        <ActionIcon variant={'transparent'} size={isMobile ? 'xs' : 'md'}>
                            <IconInfoCircleFilled/>
                        </ActionIcon>
                    </Popover.Target>
                    <Popover.Dropdown>
                        <Text><span style={{fontWeight: 600}}>Data Last Updated: </span>
                            {FORMATTED_TILE_VERSION}</Text>
                    </Popover.Dropdown>
                </Popover>

            </Group>
        </div>

        {baseLayer === "IDC" && overlay === "GRANTS" && idcGrants()}
        {baseLayer === "IDC" && overlay !== "GRANTS" && idcOnly()}
        {baseLayer === "TERM" && overlay === "GRANTS" && termGrants()}
        {baseLayer === "TOTAL" && totalOnly()}
        {(!overlay || !baseLayer) && defaultText()}
    </Container>
}

export default TitleHeader;