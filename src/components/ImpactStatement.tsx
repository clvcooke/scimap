import { Flex, Text, Button, Checkbox, Group, Box } from '@mantine/core';
import { useLayoutEffect, useRef, useState } from "react";
import { ANALYTICS_ACTIONS } from "../constants.ts";
import { trackEvent } from "../utils/analytics.ts";


const ImpactStatementPart1 = ({ active, ref }: { active: boolean, ref: any }) => {
    return <Box
        ref={ref}
        style={{
            position: 'absolute',
            visibility: active ? 'visible' : 'hidden',
            zIndex: active ? 1 : 0, // Ensure active is on top
        }}
    >
        <Text size="md" c="dark" ta="left" mb="md">
            The <b>National Institutes of Health</b> (NIH) funds crucial health research to address
            cancer, diabetes, dementia, and more.
        </Text>
        <Text size='md' c='dark' ta='left' mb={'md'}>
            NIH funding also boosts the economy, returning &gt;250% of the
            value invested.
        </Text>
        <Text size="md" c="dark" ta="left">
            The White House has ordered major cuts to NIH funding nationwide, which would <b>take back
                funds</b> promised to the states.
        </Text>
    </Box>
}

const ImpactStatementPart2 = ({ active, ref }: { active: boolean, ref: any }) => {
    return <Box
    ref={ref}
        style={{
            position: 'absolute',
            visibility: active ? 'visible' : 'hidden',
            zIndex: active ? 1 : 0, // Ensure active is on top
        }}
    >
        <Text size="md" c="dark" ta="left" mb="md">
            Many NIH grants for health research have been cancelled, interrupting ongoing studies and clinical
            trials <b>(current losses)</b>. The administration also ordered across-the-board cuts to NIH funding
            for
            "indirect costs" of research, which covers essential facilities, equipment, staff, and safety checks
            <b> (future losses)</b>.
        </Text>
        <Text size="md" c="dark" ta="left">
            This website shows the current and future <b>economic impact of funding cuts</b>.
        </Text>
    </Box>
}


function ImpactStatement({ close }: { close: () => void }) {
    const [consent, setConsent] = useState(true);
    const [active, setActive] = useState(0);

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
            <Text size="xl" c="dark" ta="center">Medical Research is at Risk</Text>
            <Box mih={height} style={{
                position: 'relative'
            }}>
                <ImpactStatementPart1 active={active === 0} ref={textBox1}/>
                <ImpactStatementPart2 active={active === 1} ref={textBox2}/>
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
                label="We collect anonymous data from users for research purposes. Please check this box if you are 18+ years of age and agree to share anonymous data. (Not required to use the website)" />
        </Flex>
    );
}

export default ImpactStatement;
