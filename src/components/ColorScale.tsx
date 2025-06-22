import {scaleLinear} from 'd3-scale';
import {interpolateOrRd, interpolateMagma} from 'd3-scale-chromatic';
import {Text, Flex} from '@mantine/core';
import {isMobile} from "react-device-detect";

interface ColorScaleProps {
    width?: number;
    height?: number;
    domain: [number, number];
    buckets?: number;
    logScale?: boolean;
    useMagma?: boolean
}

let previousValue = "";

function ColorScale({width = 10, height = 200, domain, buckets = 6, logScale = true, useMagma}: ColorScaleProps) {
    const steps = Array.from({length: buckets});

    const colorScale = scaleLinear()
        .domain([0, buckets - 1])
        .range([0, 1])
        .clamp(true);


    const formatter = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short'
    });


    const logMax = Math.log(domain[1]);
    const logMin = domain[0] > 1 ? Math.log(domain[0]) : 0;


    // I have values from 0 -> 9MM
    // I want to know what the 1/5 point is on the log of this
    //
    const formattedValues = steps.map((_, i) => {
        let formattedValue = "ABC";
        if (i < steps.length - 1) {
            let value;
            if (logScale) {
                value = logMax - i * (logMax - logMin) / (steps.length);
                value = Math.exp(value);
            } else {
                value = domain[1] - i * (domain[1]) / (steps.length);
            }

            formattedValue = `$${formatter.format(Math.round(value / 100) * 100)}`;
        }

        let suffix = "";
        if (i === 0) {
            suffix = "+"
        }
        if (i === steps.length - 1) {
            previousValue = `<${previousValue}`;
        } else {
            previousValue = `${formattedValue}${suffix}`;
        }
        return previousValue;
    });

    return (
        <Flex align="flex-start" style={{height: height, background: "rgba(255, 255, 255, 0.5)", borderRadius: "8px"
        }}>
            <svg width={width} height={height}
            >
                {steps.map((_, i) => {
                    const y1 = i * (height / buckets);
                    const y2 = (i + 1) * (height / buckets);
                    let color;
                    if (useMagma) {
                        color = interpolateMagma(1 - colorScale(buckets - 1 - i));
                    } else {
                        color = interpolateOrRd(colorScale(buckets - 1 - i));
                    }

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

            <div>
                {formattedValues.map((formattedValue) => {
                    return (
                        <div
                            key={formattedValue}
                            style={{
                                height: `${height / buckets}px`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-between',
                            }}
                        >
                            <Text size={isMobile ? "12px" : 'xs'}
                                  style={{
                                      textAlign: 'left',
                                      marginLeft: '5px',
                                      fontWeight: 'semibold',
                                      color: 'black',
                                      marginRight: '5px',
                                  }}

                            >
                                {`${formattedValue}`}
                            </Text>
                        </div>
                    );
                })}
            </div>
        </Flex>


    );
}

export default ColorScale;
