import {
    Container,
    Title,
    Text,
    Button,
    Card, Modal,
    List,
} from '@mantine/core';
import {IconShare} from '@tabler/icons-react';
import SharePage from "./SharePage.tsx";
import {useState} from 'react';
import {useAdvocacyContent} from "../hooks/useContent.ts";
import { DocumentRenderer } from '@keystatic/core/renderer';

function Advocacy() {
    const [showShare, setShowShare] = useState(false);
    const content = useAdvocacyContent();

    return (
        <Container size="md">
            <Title ta="center" mt="xl" mb="md">
                {content.title}
            </Title>

            <Text size="md" mb="md">
                <DocumentRenderer document={content.headerText} />
            </Text>

            <Card withBorder shadow="sm" mb="lg">
                <Card.Section withBorder p="md">
                    <Text fw={700} size="lg">
                        {content.contactCardTitle}
                    </Text>
                </Card.Section>
                <Card.Section p="md">
                    <Text size="md" ta={'left'} mb="sm">
                        <DocumentRenderer document={content.contactCardText} />
                    </Text>
                    
                    <List ta={"left"} withPadding>
                        {content.contactCardList.map((item: any, index: number) => (
                            <List.Item key={index}>
                                <DocumentRenderer document={item} />
                            </List.Item>
                        ))}
                    </List>
                </Card.Section>
            </Card>

            <Card withBorder shadow="sm" mb="lg">
                <Card.Section withBorder p="md">
                    <Text fw={700} size="lg">
                        {content.shareCardTitle}
                    </Text>
                </Card.Section>
                <Card.Section p="md">
                    <Text size="md" mb="sm" ta={'left'}>
                        <DocumentRenderer document={content.shareCardText} />
                    </Text>
                    <Button rightSection={<IconShare size={16}/>} onClick={() => setShowShare(true)}>Share</Button>
                </Card.Section>
            </Card>
            <Modal title={"Share"} closeOnClickOutside={true} opened={showShare}
                   onClose={() => setShowShare(false)} withCloseButton={false}
                   centered>
                <SharePage
                    title={"See national impact of federal health research cuts"}
                />
            </Modal>

        </Container>
    );
}

export default Advocacy;
