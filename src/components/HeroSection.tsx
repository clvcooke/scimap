import React from 'react';
import { Box, Flex, Text, TextInput } from '@mantine/core';

const HeroSection: React.FC = () => {
    return (
        <Box style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f0f4f8' }}>
            <Flex direction="column" align="center">
                <Text size="2.5rem" weight={700} style={{ marginBottom: '1rem' }}>
                    Explore your climate story
                </Text>
                <Text size="1.2rem" style={{ marginBottom: '2rem', maxWidth: '600px' }}>
                    Climate change is global but the impacts are local. Search your city or state to learn the many ways a warming world is affecting your place now.
                </Text>
                <TextInput
                    placeholder="Enter your city or state"
                    style={{ width: '100%', maxWidth: '400px' }}
                />
            </Flex>
        </Box>
    );
};

export default HeroSection;
