import {Container, Flex, Text, Title} from "@mantine/core";
import {isMobile} from "react-device-detect";
import {BaseLayer, formattedCost, formattedJobs, Overlay} from "../constants.ts";
import {Icon} from "@radix-ui/themes/components/callout";

const textSize = isMobile ? 'sm' : 'md'
const basicTextStyle = {
    fontFamily: 'Open Sans, sans-serif',
    color: 'rgba(0, 0, 0, 0.8)',
    textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)' // Subtle text shadow
}

function idcOnly() {
    return <Flex justify="center" gap="md" align="center" style={{marginTop: '5px', marginBottom: '5px'}}>
        <Text>
            <div>
                <Text span size={textSize} style={basicTextStyle}>
                    <b>Future Economic Loss:</b> $16B and 68K jobs per year
                </Text>
            </div>
        </Text>
    </Flex>
}

function idcGrants() {
    return <Flex justify="center" gap="md" align="center" style={{marginTop: '5px', marginBottom: '5px'}}>
        <Text>
            <div>
                <Text
                    size={textSize}
                    span
                    style={basicTextStyle}
                > <b>Current Economic Loss:</b> $4.9B and 21K jobs</Text>
            </div>
            <div>
                <Text span size={textSize} style={basicTextStyle}>
                    <b>Future Economic Loss:</b> $16B and 68K jobs per year
                </Text>
            </div>
        </Text>
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

export function TitleHeader({baseLayer, overlay}: { baseLayer?: BaseLayer, overlay?: Overlay }) {

    return <Container>
        <div style={{position: 'relative', width: '100%'}}>
            <div style={{textAlign: 'center'}}>
                <Title
                    size={isMobile ? 'h4' : 'h2'}
                    style={{
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 700,
                        color: 'rgba(0, 0, 0, 0.9)',
                        marginBottom: '5px',
                    }}
                >
                    <Icon></Icon>
                    SCIMaP: Health Research Cuts
                </Title>
            </div>
        </div>

        {baseLayer === "IDC" && overlay === "GRANTS" && idcGrants()}
        {baseLayer === "IDC" && overlay !== "GRANTS" && idcOnly()}
        {baseLayer === "TERM" && overlay === "GRANTS" && termGrants()}
        {baseLayer === "TOTAL" && totalOnly()}
        {(!overlay || !baseLayer) && defaultText()}
    </Container>
}

export default TitleHeader;