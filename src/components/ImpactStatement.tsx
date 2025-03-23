import {Card, Flex, Text, Button} from '@mantine/core';

function ImpactStatement() {
    return (
        <Flex justify="center" align="center"
              style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'
                      ,position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2}}>
            <Card shadow="xl" padding="lg" radius="md" withBorder
                  style={{width: '80%', maxWidth: '600px', backgroundColor: 'white'}}>
                <Flex direction="column" gap="sm">
                    <Text size="xl" c="dark" ta="center">Medical Research is at Risk</Text>
                    <Text size="md" c="dark" ta="left">
                        The National Institutes of Health (NIH) funds crucial health research to address cancer, diabetes, dementia, and more. NIH funding also boosts the economy, returning &gt;250% of the value invested.
                    </Text>
                    <Text size="md" c="dark" ta="left">
                        The Trump Administration has ordered across-the-board cuts to NIH funding, which would cause economic losses and reduce jobs across the nation. </Text>
                    <Button size="md">
                        See Impact
                    </Button>
                </Flex>
            </Card>
        </Flex>
    );
}

export default ImpactStatement;
