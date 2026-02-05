import {Container, Title, Text, Accordion, AccordionItem, Group} from '@mantine/core';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import {isMobile} from "react-device-detect";
import NewsItem from "./NewsItem.tsx";
import newsItemsData from "../data/newsItems.json";
import {useAboutContent, useNewsContent} from "../hooks/useContent.ts";
import { DocumentRenderer } from '@keystatic/core/renderer';

const textOrder = isMobile ? 4 : 3;

interface CopyrightHeaderProps {
    year?: number;
}

function CopyrightHeader({year = 2025}: CopyrightHeaderProps) {
    return (
        <Title order={6} mb="md">
            <Group gap={4} justify="center" wrap="nowrap">
                <Text component="a" href="https://scienceimpacts.org/" inherit>
                    SCIMaP
                </Text>
                <Text span inherit>
                    © {year} is licensed under
                </Text>
                <Text component="a" href="https://creativecommons.org/licenses/by/4.0/" inherit>
                    CC BY 4.0
                </Text>
                <img
                    src="https://mirrors.creativecommons.org/presskit/icons/cc.svg"
                    alt="Creative Commons License"
                    style={{maxWidth: '1em', maxHeight: '1em'}}
                />
                <img
                    src="https://mirrors.creativecommons.org/presskit/icons/by.svg"
                    alt="Attribution License"
                    style={{maxWidth: '1em', maxHeight: '1em'}}
                />
            </Group>
        </Title>
    );
}

function About() {
    const content = useAboutContent();
    const keystaticNews = useNewsContent();
    
    // Merge static data with Keystatic data for PoC
    const newsItems = [...keystaticNews, ...newsItemsData];

    return (
        <Container size="md">
            <Title mt="md" mb={'sm'}>
                {content.title}
            </Title>
            <CopyrightHeader/>

            <Accordion variant="contained" radius="md" defaultValue="visualization-video">
                <AccordionItem value="visualization-video">
                    <Accordion.Control>
                        <Title order={textOrder}>
                            Overview Video
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <video
                            controls
                            poster="https://data.scienceimpacts.org/00_Thumbnails_00001.png"
                            style={{
                                width: '100%',
                                maxWidth: '100%',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                border: '1px solid #e0e0e0'
                            }}
                            src="https://data.scienceimpacts.org/SCIMaP_NIH_cuts.mp4"
                        >
                            Your browser does not support the video tag.
                        </video>
                    </Accordion.Panel>
                </AccordionItem>
                <AccordionItem value="mission">
                    <Accordion.Control>
                        <Title order={textOrder}>Mission</Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            <DocumentRenderer document={content.mission} />
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>

                <AccordionItem value="team">
                    <Accordion.Control>
                        <Title order={textOrder}>
                            The Team
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            <DocumentRenderer document={content.team} />
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>
                <AccordionItem value="current-impact-term-grants">
                    <Accordion.Control>
                        <Title order={textOrder}>
                            Current Impact: Cancelled and Frozen Grants
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            <DocumentRenderer document={content.currentImpact} />
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>
                <AccordionItem value="future-impact-indirect-costs">
                    <Accordion.Control>
                        <Title order={textOrder}>
                            Future Impact: Indirect Costs
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            <DocumentRenderer document={content.futureImpact} />
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>
                <AccordionItem value="what-if-cuts">
                    <Accordion.Control>
                        <Title order={textOrder}>
                            Estimating Local Economic Impact
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            <DocumentRenderer document={content.economicImpact} />
                        </Text>
                        <Text ta={"left"} mt="sm">
                            View an illustrated summary of our method here.
                        </Text>
                        <Zoom>
                            <img
                                alt="Calculation Methods"
                                src="https://data.scienceimpacts.org/methodsFigsV2.png"
                                width="50%"
                            />
                        </Zoom>
                    </Accordion.Panel>
                </AccordionItem>
                <AccordionItem value="fy-2026">
                    <Accordion.Control>
                        <Title order={textOrder}>
                            Proposed Impact: FY2026 Budget
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            <DocumentRenderer document={content.fy26Budget} />
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>

                <AccordionItem value="code-and-data">
                    <Accordion.Control>
                        <Title order={textOrder}>
                            Source Code
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            <DocumentRenderer document={content.sourceCode} />
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>

                <AccordionItem value="contact-us">
                    <Accordion.Control>
                        <Title order={textOrder}>
                            Contact Us
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            <DocumentRenderer document={content.contactUs} />
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>
                <AccordionItem value="in-the-news">
                    <Accordion.Control>
                        <Title order={textOrder}>
                            News and Policy Mentions
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        {newsItems.map(newsItem => (
                            <NewsItem key={newsItem.title} {...newsItem} />
                        ))}
                    </Accordion.Panel>
                </AccordionItem>
                <AccordionItem value="data-updates">
                    <Accordion.Control>
                        <Title order={textOrder}>
                            Updates
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            <DocumentRenderer document={content.updates} />
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>
            </Accordion>
        </Container>
    )
        ;
}

export default About;
