import {Flex, Text, Button, Checkbox, Group, Box} from '@mantine/core';
import {useLayoutEffect, useRef, useState} from "react";
import {ANALYTICS_ACTIONS} from "../constants.ts";
import {trackEvent} from "../utils/analytics.ts";
import {useImpactStatementContent} from "../hooks/useContent.ts";
import { DocumentRenderer } from '@keystatic/core/renderer';


const FY26ImpactStatement = ({active, ref, content}: { active: boolean, ref: any, content: any }) => {
    return <Box
        ref={ref}
        style={{
            position: 'absolute',
            visibility: active ? 'visible' : 'hidden',
            zIndex: active ? 1 : 0, // Ensure active is on top
        }}
    >
        <Text size="md" c="dark" ta="left" mb="md">
            <DocumentRenderer document={content} />
        </Text>
    </Box>
}

const ImpactStatementPart1 = ({active, ref, content}: { active: boolean, ref: any, content: any }) => {
    return <Box
        ref={ref}
        style={{
            position: 'absolute',
            visibility: active ? 'visible' : 'hidden',
            zIndex: active ? 1 : 0, // Ensure active is on top
        }}
    >
        <Text size="md" c="dark" ta="left" mb="md">
            <DocumentRenderer document={content} />
        </Text>
    </Box>
}

const ImpactStatementPart2 = ({active, ref, content}: { active: boolean, ref: any, content: any }) => {
    return <Box
        ref={ref}
        style={{
            position: 'absolute',
            visibility: active ? 'visible' : 'hidden',
            zIndex: active ? 1 : 0, // Ensure active is on top
        }}
    >
        <Text size="md" c="dark" ta="left" mb="md">
            <DocumentRenderer document={content} />
        </Text>
    </Box>
}


function ImpactStatement({close, fy26}: { close: () => void, fy26?: boolean }) {
    const [consent, setConsent] = useState(true);
    const [active, setActive] = useState(0);
    const content = useImpactStatementContent();

    const nextStep = () => setActive((current) => (current < 1 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));
    const [height, setHeight] = useState<number | undefined>(undefined)
    const textBox1 = useRef<HTMLDivElement>(null);
    const textBox2 = useRef<HTMLDivElement>(null);


    useLayoutEffect(() => {
        const height0 = textBox1.current?.clientHeight ?? 0;
        const height1 = textBox2.current?.clientHeight ?? 0;
        if (height0 > 0 || height1 > 0) {
            setHeight(Math.max(height0, height1));
        }
    }, []);


    return (
        <Flex direction="column" gap="sm">
            <Text size="xl" c="dark" ta="center">{content.modalTitle}</Text>
            <Box mih={height} style={{
                position: 'relative'
            }}>
                <ImpactStatementPart1 active={active === 0} ref={textBox1} content={content.part1}/>
                {!fy26 && <ImpactStatementPart2 active={active === 1} ref={textBox2} content={content.part2}/>}
                {fy26 && <FY26ImpactStatement active={active === 1} ref={textBox2} content={content.fy26Content}/>}
            </Box>

            <Group justify="center" mt="sm">
                {active === 0 ? (
                    <Button size="md" onClick={nextStep} fullWidth>Next</Button>
                ) : (
                    <Group grow w="100%">
                        <Button size="md" variant="default" onClick={prevStep}>Back</Button>
                        <Button size="md" onClick={() => close()}>See Impact</Button>
                    </Group>
                )}
            </Group>
            <Checkbox
                checked={consent}
                onChange={(event) => {
                    const consented = event.currentTarget.checked;
                    if (!consented) {
                        trackEvent(
                            ANALYTICS_ACTIONS.consent,
                            'OPT_OUT'
                        );
                    } else {
                        trackEvent(
                            ANALYTICS_ACTIONS.consent,
                            'OPT_IN'
                        );
                    }
                    setConsent(consented);
                }}
                ta={'left'}
                size={'xs'}
                label={content.consentLabel}/>
        </Flex>
    )
}

export default ImpactStatement;
