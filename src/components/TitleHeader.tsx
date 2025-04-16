import {Container, Flex, Text, Title} from "@mantine/core";
import {isMobile} from "react-device-detect";


function TitleHeader({jobsLost, costImpact}: { jobsLost: number, costImpact: number }) {


    const formattedJobs = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short'
    }).format(jobsLost);

    const formattedCost = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short'
    }).format(costImpact);

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

        <Flex justify="center" gap="sm" align="center" style={{marginTop: '5px', marginBottom: '5px'}}>
            <Text>
                <Text
                    size={isMobile ? 'sm' : 'md'}
                    span
                    fw={700}
                    style={{
                        fontFamily: 'Open Sans, sans-serif',
                        color: 'rgba(0, 0, 0, 0.8)',
                        textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)' // Subtle text shadow
                    }}
                >National Impact per year: </Text>
                <Text span size={isMobile ? "sm" : "md"} style={{
                    fontFamily: 'Open Sans, sans-serif',
                    color: 'rgba(0, 0, 0, 0.8)',
                    textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)' // Subtle text shadow
                }}>
                    ${formattedCost} and {formattedJobs} Jobs Lost
                </Text>
            </Text>
        </Flex>
    </Container>


}

export default TitleHeader;