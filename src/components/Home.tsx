import React from 'react';
import { Accordion, Box, Button, Card, Container, Flex, Group, List, Modal, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconShare } from '@tabler/icons-react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { useState } from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import SharePage from './SharePage';
import { trackEvent } from '../utils/analytics';
import NewsItem from './NewsItem';

const newsItems = [
    {
        date: 'Ongoing',
        title: 'Stand Up for Science, "Powered by SCIMaP"',
        url: 'https://www.standupforscience.net/resources',
        isOngoing: true,
    },
    {
        date: 'September 15th, 2025',
        title: 'Open Philanthropy Awards $336K to Map the Impact of Scientific Funding Cuts',
        url: 'https://cmns.umd.edu/news-events/news/open-philanthropy-award-joshua-weitz-scimap',
    },
    {
        date: 'July 29th, 2025',
        title: 'SCIMaP Visualizes the True Cost of Science Funding Cuts',
        url: 'https://www.the-scientist.com/scimap-visualizes-the-true-cost-of-science-funding-cuts-73211',
    },
];

const Home: React.FC = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [showShare, setShowShare] = useState(false);

    const trackElectedOfficialsClick = () => {
        trackEvent('Outbound Link', 'Clicked Elected Officials Link', 'usa.gov/elected-officials');
    };

    return (
        <Box>
            <Header />
            <HeroSection />
            <Container size="lg" style={{ padding: '2rem 0' }}>
                <Title order={2} ta="center" mb="xl">
                    Science & Community Impacts Mapping Project (SCIMaP)
                </Title>

                <Accordion variant="contained" radius="md" defaultValue="mission">
                    {/* Mission Section */}
                    <Accordion.Item value="mission">
                        <Accordion.Control>
                            <Title order={isMobile ? 4 : 3}>Our Mission</Title>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Text ta="left">
                                Science transforms our world. But the process and impacts of scientific research are often hidden.
                                We use interactive, data-driven visualizations to help you explore how science and health research
                                fuels our economy, supports jobs, and improves health.
                            </Text>
                        </Accordion.Panel>
                    </Accordion.Item>

                    {/* Video Section */}
                    <Accordion.Item value="visualization-video">
                        <Accordion.Control>
                            <Title order={isMobile ? 4 : 3}>Watch Our Overview Video</Title>
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
                                    border: '1px solid #e0e0e0',
                                }}
                                src="https://data.scienceimpacts.org/SCIMaP_NIH_cuts.mp4"
                            >
                                Your browser does not support the video tag.
                            </video>
                        </Accordion.Panel>
                    </Accordion.Item>

                    {/* What does the NIH do? Section */}
                    <Accordion.Item value="what-does-nih-do">
                        <Accordion.Control>
                            <Title order={isMobile ? 4 : 3}>What Does the NIH Do?</Title>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Text ta="left">
                                The <b>National Institutes of Health</b> (NIH) funds crucial research to tackle our biggest health challenges:
                                cancer, diabetes, dementia, heart disease, and more.
                            </Text>
                        </Accordion.Panel>
                    </Accordion.Item>

                    {/* How does the NIH contribute to the U.S. economy? Section */}
                    <Accordion.Item value="how-does-nih-contribute">
                        <Accordion.Control>
                            <Title order={isMobile ? 4 : 3}>How Does the NIH Impact the U.S. Economy?</Title>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Text ta="left">
                                NIH funding is a smart investment. For every $1 invested, our economy gets $2.56 in return.
                                In 2024 alone, the NIH supported almost half a million jobs and generated billions in economic activity.
                            </Text>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>

                {/* Take Action Section */}
                <Box mt="xl" id="take-action">
                    <Title order={2} ta="center" mb="lg">
                        Take Action Now
                    </Title>
                    <Text size="md" mb="md" ta="center">
                        You have the power to protect scientific research. Congress and the courts can stop these cuts.
                    </Text>
                    <Flex direction={isMobile ? 'column' : 'row'} gap="md" justify="center">
                        <Card withBorder shadow="sm" style={{ flex: 1 }}>
                            <Card.Section withBorder p="md">
                                <Text fw={700} size="lg">
                                    Contact Your Representatives
                                </Text>
                            </Card.Section>
                            <Card.Section p="md">
                                <Text size="md" ta="left">
                                    Make your voice heard. Contact your local elected officials and representatives in Congress
                                    and tell them to protect science funding.
                                    <a href="https://www.usa.gov/elected-officials" target="_blank" onClick={trackElectedOfficialsClick}>
                                        Find your representatives here.
                                    </a>
                                </Text>
                            </Card.Section>
                        </Card>
                        <Card withBorder shadow="sm" style={{ flex: 1 }}>
                            <Card.Section withBorder p="md">
                                <Text fw={700} size="lg">
                                    Share the SCIMaP
                                </Text>
                            </Card.Section>
                            <Card.Section p="md">
                                <Text size="md" mb="sm" ta="left">
                                    Spread the word. Share our work with your friends, family, and followers.
                                </Text>
                                <Button rightSection={<IconShare size={16} />} onClick={() => setShowShare(true)}>
                                    Share Now
                                </Button>
                            </Card.Section>
                        </Card>
                    </Flex>
                </Box>

                {/* News Section */}
                <Box mt="xl">
                    <Title order={2} ta="center" mb="lg">
                        In the News
                    </Title>
                    {newsItems.map((item) => (
                        <NewsItem key={item.title} {...item} />
                    ))}
                </Box>
            </Container>

            <Modal title="Share" opened={showShare} onClose={() => setShowShare(false)} centered>
                <SharePage title="See the national impact of federal health research cuts" />
            </Modal>
        </Box>
    );
};

export default Home;
