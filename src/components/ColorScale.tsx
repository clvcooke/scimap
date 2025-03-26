import {scaleLinear} from 'd3-scale';
import {interpolateOrRd} from 'd3-scale-chromatic';
import {useEffect, useState} from 'react';
import {Text, useMantineTheme, Stack, Box, Flex} from '@mantine/core';

interface ColorScaleProps {
    width?: number;
    height?: number;
    domain: [number, number];
}

function ColorScale({width = 20, height = 200, domain}: ColorScaleProps) {
    const theme = useMantineTheme();
    const [gradient, setGradient] = useState<string>('');

    useEffect(() => {
        const numStops = 2; // Adjust for smoother gradient
        const stops = Array.from({length: numStops}, (_, i) => {
            let value = 0;
            if (i > 0) {
                value = Math.log(domain[0] + (domain[1] - domain[0]) * (i / (numStops - 1)));
            }
            const color = interpolateOrRd(scaleLinear().domain([domain[0], Math.log(domain[1])]).range([0, 1])(value));
            return `${color} ${i * (100 / (numStops - 1))}%`;
        });
        setGradient(`linear-gradient(to top, ${stops.join(', ')})`);
    }, [domain]);


    const formattedLow = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short'
    }).format(domain[0]);

    const formattedHigh = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short'
    }).format(domain[1]);

    return (
        <Flex align={"center"} style={{
            height: height
        }}>
            <Box
                style={{
                    width: width,
                    height: height,
                    background: gradient,
                    border: `1px solid ${theme.colors.gray[4]}`,
                }}
            />
            <Stack align="stretch"
                   justify="space-between" style={{
                height: '100%'
            }}>
                <Text size="xs">${formattedHigh}</Text>
                <Text size="xs">${formattedLow}</Text>
            </Stack>

        </Flex>

    );
}

export default ColorScale;
