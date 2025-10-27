import React from 'react';
import { Box, Flex, Button, Text, TextInput } from '@mantine/core';

const Header: React.FC = () => {
    return (
        <Box style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
            <Flex justify="space-between" align="center">
                <Text size="xl" weight={700}>SCIMAP</Text>
                <Flex align="center">
                    <Button variant="subtle" style={{ marginRight: '1rem' }}>About us</Button>
                    <Button variant="subtle" style={{ marginRight: '1rem' }}>Our work</Button>
                    <Button variant="subtle" style={{ marginRight: '1rem' }}>Tools</Button>
                    <Button variant="subtle" style={{ marginRight: '1rem' }}>Impact</Button>
                    <Button variant="subtle" style={{ marginRight: '1rem' }}>Donate</Button>
                    <Button variant="subtle" style={{ marginRight: '1rem' }}>Resources</Button>
                </Flex>
                <TextInput
                    placeholder="Search"
                    style={{ width: '200px' }}
                />
            </Flex>
        </Box>
    );
};

export default Header;
