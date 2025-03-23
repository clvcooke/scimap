import {
    Container,
    Title,
    Text,
    Button,
    Card,
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
                        Contact Your Representatives
                    </Text>
                </Card.Section>
                <Card.Section p="md">
                    <Text size="sm" mb="sm" ta={'left'}>
                        We encourage you to <b>contact your representatives</b> in Congress to share your opinion and call attention to these funding cuts
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

            <Card withBorder shadow="sm" mb="lg">
                <Card.Section withBorder p="md">
                    <Text fw={700} size="md">
                        Share this information
                    </Text>
                </Card.Section>
                <Card.Section p="md">
                    <Text size="sm" mb="sm" ta={'left'}>
                        We also encourage you to share our website with friends, family, and followers
                    </Text>
                </Card.Section>
            </Card>


        </Container>
    );
}

export default Advocacy;