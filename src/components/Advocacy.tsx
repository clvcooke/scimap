import {
    Container,
    Title,
    Text,
    Button,
    Card,
    List,
    Box,
} from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';

function Advocacy() {
    return (
        <Container size="md">
            <Title ta="center" mt="xl" mb="md">
                Take Action
            </Title>

            <Text size="md" mb="md">
                You can take action to help stop the cuts to federal funding for scientific research.
            </Text>

            <Card withBorder shadow="sm" mb="lg">
                <Card.Section withBorder p="md">
                    <Text fw={700} size="md">
                        Spread the Word
                    </Text>
                </Card.Section>
                <Card.Section p="md">
                    <List
                        spacing="sm"
                        size="sm"
                        ta={'left'}
                    >
                        <List.Item>Talk to your friends and family.</List.Item>
                        <List.Item>Share our website on social media.</List.Item>
                        <List.Item>Urge Congress to oppose the cuts.</List.Item>
                    </List>
                </Card.Section>
            </Card>

            <Card withBorder shadow="sm" mb="lg">
                <Card.Section withBorder p="md">
                    <Text fw={700} size="md">
                        Contact Your Representatives
                    </Text>
                </Card.Section>
                <Card.Section p="md">
                    <Text size="sm" mb="sm" ta={'left'}>
                        We encourage you to contact your representatives in Congress to ask them to oppose these
                        funding cuts.
                    </Text>
                    <Button
                        component="a"
                        href="https://www.usa.gov/elected-officials"
                        target="_blank"
                        rel="noopener noreferrer"
                        rightSection={<IconExternalLink size={16} />}
                        variant="outline"
                    >
                        Find Contact Information
                    </Button>
                </Card.Section>
            </Card>
            <Card withBorder shadow="sm" mb="xl">
                <Card.Section withBorder p="md">
                    <Text fw={700} size="md">
                        Sample Message
                    </Text>
                </Card.Section>
                <Card.Section p="md">
                    <Text size="sm" ta="left" fw={500}>
                        Dear [Congress Member’s Name],
                    </Text>
                    <Box mt="sm">
                        <Text size="sm" ta="left" fs="italic">
                            My name is [NAME] and I am one of your constituents. I am contacting you to urge you to
                            oppose cuts to federal funding for science and health research. Recent executive orders,
                            proposed funding cuts, and mass layoffs led by DOGE are dismantling crucial federal
                            research institutions, the NIH and NSF. Science is a strategic investment for America,
                            not a drain on the economy. In 2024, every dollar invested in the NIH produced about
                            $2.56 in new economic activity, more than 250% gain. In addition to this economic impact,
                            scientific research generates cures for diseases and new technologies that benefit all
                            Americans. We must take action to protect Americans’ health and jobs, and keep our
                            position as a world leader in science and technological innovation.
                        </Text>
                    </Box>
                </Card.Section>
            </Card>

        </Container>
    );
}

export default Advocacy;