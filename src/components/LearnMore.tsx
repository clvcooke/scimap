import {
    Accordion,
    AccordionItem,
    Container,
    Title,
    Text,
} from '@mantine/core';
import {isMobile} from "react-device-detect";
import {useLearnMoreContent} from "../hooks/useContent.ts";
import { DocumentRenderer } from '@keystatic/core/renderer';

const textOrder = isMobile ? 4 : 3;

function LearnMore() {
    const content = useLearnMoreContent();

    return (
        <Container size="md">
            <Title mt="md" mb="sm">
                {content.title}
            </Title>

            <Accordion variant="contained" radius="md">
                {content.sections.map((section: any, index: number) => (
                    <AccordionItem key={index} value={`section-${index}`}>
                        <Accordion.Control>
                            <Title order={textOrder}>{section.title}</Title>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Text ta={"left"}>
                                <DocumentRenderer document={section.content} />
                            </Text>
                        </Accordion.Panel>
                    </AccordionItem>
                ))}
            </Accordion>
        </Container>
    );
}

export default LearnMore;
