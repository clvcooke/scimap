import React from 'react';
import { Box, Flex } from '@mantine/core';
import Header from './Header';
import HeroSection from './HeroSection';
import ContentCard from './ContentCard';

const Home: React.FC = () => {
    return (
        <Box>
            <Header />
            <HeroSection />
            <Flex wrap="wrap" justify="center" style={{ padding: '2rem' }}>
                <ContentCard
                    imageUrl="https://via.placeholder.com/350"
                    category="Science"
                    title="Science made clear"
                    description="Helping journalists bring climate science into reporting"
                />
                <ContentCard
                    imageUrl="https://via.placeholder.com/350"
                    category="Exploration"
                    title="Exploration made easy"
                    description="Powerful tools to understand impacts and solutions"
                />
                <ContentCard
                    imageUrl="https://via.placeholder.com/350"
                    category="Reporting"
                    title="Realtime reporting resources"
                    description="Production-ready, localized visuals just a click away"
                />
            </Flex>
        </Box>
    );
};

export default Home;
