import {scaleLinear} from 'd3-scale';
import {interpolateOrRd} from 'd3-scale-chromatic';
import {Text, Flex} from '@mantine/core';

interface ColorScaleProps {
    width?: number;
    height?: number;
    domain: [number, number];
    buckets?: number;
}

function ColorScale({width = 20, height = 200, domain, buckets = 5}: ColorScaleProps) {
    const steps = Array.from({length: buckets});

    const colorScale = scaleLinear()
        .domain([0, buckets - 1])
        .range([0, 1])
        .clamp(true);


    // useEffect(() => {
    //     const numStops = 10; // Adjust for smoother gradient
    //     const stops = Array.from({length: numStops}, (_, i) => {
    //         let value = 0;
    //         if (i > 0) {
    //             value = Math.log(domain[0] + (domain[1] - domain[0]) * (i / (numStops - 1)));
    //         }
    //         const color = interpolateOrRd(scaleLinear().domain([domain[0], Math.log(domain[1])]).range([0, 1])(value));
    //         return `${color} ${i * (100 / (numStops - 1))}%`;
    //     });
    //     setGradient(`linear-gradient(to top, ${stops.join(', ')})`);
    // }, [domain]);


    const formatter = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short'
    });


    const logMax = Math.log(domain[1]);


    // I have values from 0 -> 9MM
    // I want to know what the 1/5 point is on the log of this
    //


    return (
        <Flex align="flex-start" style={{height: height}}>
            <svg width={width} height={height}>
                {steps.map((_, i) => {
                    const y1 = i * (height / buckets);
                    const y2 = (i + 1) * (height / buckets);
                    const color = interpolateOrRd(colorScale(buckets - 1 - i));

                    return (
                        <rect
                            key={i}
                            x={0}
                            y={y1}
                            width={width}
                            height={y2 - y1}
                            style={{fill: color}}
                        />
                    );
                })}
            </svg>

            <div style={{width: '50px'}}>
                {steps.map((_, i) => {
                    let value = 0;
                    if (i < steps.length - 1) {
                        value = logMax - i * logMax / (steps.length);
                        value = Math.exp(value);
                    }
                    // const value = valueScale(buckets - 1 - i);
                    const formattedValue = formatter.format(value);
                    let suffix = "";
                    if (i === 0) {
                        suffix = "+"
                    }
                    return (
                        <div
                            key={i}
                            style={{
                                height: `${height / buckets}px`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                            }}
                        >
                            <Text size="xs" style={{textAlign: 'left', marginLeft: '5px'}}>
                                {`$${formattedValue}${suffix}`}
                            </Text>
                        </div>
                    );
                })}
            </div>
        </Flex>


    );
}

export default ColorScale;
