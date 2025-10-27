import React from 'react';
import { Box, Flex, Text } from '@mantine/core';

const HeroSection: React.FC = () => {
    return (
        <Box style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f0f4f8' }}>
            <Flex direction="column" align="center">
                <Text size="2.5rem" weight={700} style={{ marginBottom: '1rem' }}>
                    See the Impact of Science Funding Cuts in Your Community
                </Text>
                <Text size="1.2rem" style={{ marginBottom: '2rem', maxWidth: '600px' }}>
                    The White House has ordered major cuts to federal funding for scientific research. These cuts will impact your community. See how.
                </Text>
            </Flex>
        </Box>
    );
};

export default HeroSection;
