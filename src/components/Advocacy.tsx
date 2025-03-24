import {
    Container,
    Title,
    Text,
    Button,
    Card, Modal,
} from '@mantine/core';
import {IconExternalLink, IconShare} from '@tabler/icons-react';
import SharePage from "./SharePage.tsx";
import { useState } from 'react';

function Advocacy() {
    const [showShare, setShowShare] = useState(false);
    return (
        <Container size="md">
            <Title ta="center" mt="xl" mb="md">
                Take Action
            </Title>

            <Text size="md" mb="md">
                You can <b>take action</b> to help stop the cuts to federal funding for scientific research.
            </Text>

            <Card withBorder shadow="sm" mb="lg">
                <Card.Section withBorder p="md">
                    <Text fw={700} size="lg">
                        Contact Your Representatives
                    </Text>
                </Card.Section>
                <Card.Section p="md">
                    <Text size="md" mb="sm" ta={'left'}>
                        We encourage you to <b>contact your representatives</b> in Congress to share your opinion and call attention to these funding cuts
                    </Text>
                    <Button
                        component="a"
                        href="https://www.usa.gov/elected-officials"
                        target="_blank"
                        rel="noopener noreferrer"
                        rightSection={<IconExternalLink size={16} />}
                    >
                        Find Contact Information
                    </Button>
                </Card.Section>
            </Card>

            <Card withBorder shadow="sm" mb="lg">
                <Card.Section withBorder p="md">
                    <Text fw={700} size="lg">
                        Share this information
                    </Text>
                </Card.Section>
                <Card.Section p="md">
                    <Text size="md" mb="sm" ta={'left'}>
                        We also encourage you to share our website with friends, family, and followers
                    </Text>
                    <Button rightSection={<IconShare size={16}/>} onClick={() => setShowShare(true)}>Share</Button>

                </Card.Section>
            </Card>
            <Modal withinPortal={false} opened={showShare} onClose={() => setShowShare(false)} withCloseButton={false} centered>
                <SharePage
                    title={"See national impact of federal health research cuts"}
                />
            </Modal>

        </Container>
    );
}

export default Advocacy;