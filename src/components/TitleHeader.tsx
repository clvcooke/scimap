import {Container, Flex, Text, Title, useMantineTheme} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";


function TitleHeader({jobsLost, costImpact}: { jobsLost: number, costImpact: number }) {


    const formattedJobs = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short'
    }).format(jobsLost);

    const formattedCost = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short'
    }).format(costImpact);

    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
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
                    Federal Health Research Cuts
                </Title>
            </div>
        </div>

        <Flex justify="center" gap="sm" align="center" style={{marginTop: '5px', marginBottom: '5px'}}>
            <Text>
                <Text
                    span
                    fw={700}
                    style={{
                        fontFamily: 'Open Sans, sans-serif',
                        color: 'rgba(0, 0, 0, 0.8)',
                        textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)' // Subtle text shadow
                    }}
                >National Impact: </Text>
                <Text span size="md" style={{
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