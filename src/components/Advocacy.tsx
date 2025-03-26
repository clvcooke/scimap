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

function Advocacy() {
    const [showShare, setShowShare] = useState(false);
    return (
        <Container size="md">
            <Title ta="center" mt="xl" mb="md">
                Take Action
            </Title>

            <Text size="md" mb="md">
                You can <b>take action</b> to support federal funding for scientific research.
            </Text>

            <Card withBorder shadow="sm" mb="lg">
                <Card.Section withBorder p="md">
                    <Text fw={700} size="lg">
                        Contact Your Representatives
                    </Text>
                </Card.Section>
                <Card.Section p="md">
                    <Text size="md" ta={'left'}>
                        We encourage you to <b> contact your local elected officials and representatives</b> in Congress
                        to share your opinion and call attention to these funding cuts. <a
                        href={"https://www.usa.gov/elected-officials"} target={"_blank"}>Click here to find contact
                        information for your representatives</a>. Here are some facts to keep in mind:
                    </Text>
                    <List ta={"left"} withPadding>
                        <List.Item>Less than 1% of the federal budget goes to NIH, but this investment has a big
                            impact. </List.Item>
                        <List.Item>Every dollar invested in scientific research through NIH produces, on average, $2.56
                            of economic activity in return – <b>over 250% gain.</b></List.Item>
                        <List.Item>NIH research supports over 400,000 jobs across the U.S.</List.Item>
                        <List.Item>Reducing indirect cost rates to 15% would undermine the ability of universities,
                            hospitals, and research institutes to conduct life saving, medical research.</List.Item>
                    </List>
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
                        We also encourage you to share the SCIMaP website with friends, family, and followers. You can
                        learn more about NIH impacts in your state via resources from <a
                        href={"https://www.unitedformedicalresearch.org/nih-in-your-state/"} target={"_blank"}>United for Medical
                        Research.</a>
                    </Text>
                    <Button rightSection={<IconShare size={16}/>} onClick={() => setShowShare(true)}>Share</Button>
                </Card.Section>
            </Card>
            <Modal withinPortal={false} opened={showShare} onClose={() => setShowShare(false)} withCloseButton={false}
                   centered>
                <SharePage
                    title={"See national impact of federal health research cuts"}
                />
            </Modal>

        </Container>
    );
}

export default Advocacy;