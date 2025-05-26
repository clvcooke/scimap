import {Container, Flex, Text, Title} from "@mantine/core";
// import {isMobile} from "react-device-detect";
import {BaseLayer, formattedCost, formattedJobs, Overlay} from "../constants.ts";

const isMobile = true;

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
                    <b>Future Economic Losses:</b> $16B and 68K jobs lost per year
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
                > <b>Current Economic Losses:</b> $4.9B and 21K jobs lost</Text>
            </div>
            <div>
                <Text span size={textSize} style={basicTextStyle}>
                    <b>Future Economic Losses:</b> $16B and 68K jobs lost per year
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
            ><b>Current Economic Losses:</b> $4.9B and 21K jobs lost</Text>
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
            ><b>Current + Future Economic Losses:</b> $20.9B and 89K jobs lost</Text>
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
                    size={isMobile ? 'h3' : 'h2'}
                    style={{
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 700,
                        color: 'rgba(0, 0, 0, 0.9)',
                        marginBottom: '5px',
                    }}
                >
                    SCIMaP: View Impact of Federal Health Research Cuts
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

//
// function TitleHeader({jobsLost, costImpact, futureJobs, futureLosses}: { jobsLost: number, costImpact: number, futureLosses?: number, futureJobs?: number }) {
//
//
//     const formattedJobs = new Intl.NumberFormat('en-US', {
//         notation: 'compact',
//         compactDisplay: 'short'
//     }).format(jobsLost);
//
//     const formattedFutureJobs = futureJobs ? new Intl.NumberFormat('en-US', {
//         notation: 'compact',
//         compactDisplay: 'short'
//     }).format(futureJobs) : "";
//
//     const formattedCost = new Intl.NumberFormat('en-US', {
//         notation: 'compact',
//         compactDisplay: 'short'
//     }).format(costImpact);
//
//     const formattedFutureCost = futureLosses ? new Intl.NumberFormat('en-US', {
//         notation: 'compact',
//         compactDisplay: 'short'
//     }).format(futureLosses) : "";
//
//     return <Container>
//         <div style={{position: 'relative', width: '100%'}}>
//             <div style={{textAlign: 'center'}}>
//                 <Title
//                     size={isMobile ? 'h3' : 'h2'}
//                     style={{
//                         fontFamily: 'Roboto, sans-serif',
//                         fontWeight: 700,
//                         color: 'rgba(0, 0, 0, 0.9)',
//                         marginBottom: '5px',
//                     }}
//                 >
//                     SCIMaP: View Impact of Federal Health Research Cuts
//                 </Title>
//             </div>
//         </div>
//
//         <Flex justify="center" gap="sm" align="center" style={{marginTop: '5px', marginBottom: '5px'}}>
//             <Text>
//                 <Text
//                     size={isMobile ? 'sm' : 'md'}
//                     span
//                     fw={700}
//                     style={{
//                         fontFamily: 'Open Sans, sans-serif',
//                         color: 'rgba(0, 0, 0, 0.8)',
//                         textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)' // Subtle text shadow
//                     }}
//                 >National Impact per year: </Text>
//                 <Text span size={isMobile ? "sm" : "md"} style={{
//                     fontFamily: 'Open Sans, sans-serif',
//                     color: 'rgba(0, 0, 0, 0.8)',
//                     textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)' // Subtle text shadow
//                 }}>
//                     ${formattedCost} and {formattedJobs} Jobs Lost
//                 </Text>
//             </Text>
//         </Flex>
//     </Container>
//
//
// }

export default TitleHeader;