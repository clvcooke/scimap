import React from 'react';
import { Box, Flex, Button, Text } from '@mantine/core';

const Header: React.FC = () => {
    return (
        <Box style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
            <Flex justify="space-between" align="center">
                <Text size="xl" weight={700}>SCIMAP</Text>
                <Flex align="center">
                    <Button component="a" href="#take-action" variant="subtle" style={{ marginRight: '1rem' }}>Take Action</Button>
                </Flex>
            </Flex>
        </Box>
    );
};

export default Header;
