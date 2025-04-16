import {Flex, Text, Button, Checkbox} from '@mantine/core';
import {useState} from "react";
import ReactGA from "react-ga4";
import {ANALYTICS_ACTIONS} from "../constants.ts";

function ImpactStatement({close}: { close: () => void }) {
    const [consent, setConsent] = useState(true);

    return (
        <Flex direction="column" gap="sm">
            <Text size="xl" c="dark" ta="center">Medical Research is at Risk</Text>
            <Text size="md" c="dark" ta="left">
                The <b>National Institutes of Health</b> (NIH) funds crucial health <b>research</b> to address
                cancer, diabetes, dementia, and more. NIH funding also boosts the economy, returning &gt;250% of
                the value invested.
            </Text>
            <Text ta={"left"}>On Feb. 7th, 2025, the White House ordered across-the-board cuts to NIH funded
                research. This website shows how funding cuts reduce economic activity and employment nationwide.
            </Text>

            <Button size="md" onClick={() => close()}>
                See Annual Impact
            </Button>
            <Checkbox
                checked={consent}
                onChange={(event) => {
                    const consented = event.currentTarget.checked;
                    if (!consented) {
                        ReactGA.event({
                            category: ANALYTICS_ACTIONS.consent,
                            action: `OPT_OUT`,
                        });
                    } else {
                        ReactGA.event({
                            category: ANALYTICS_ACTIONS.consent,
                            action: `OPT_IN`,
                        });
                    }
                    setConsent(consented);
                }}
                ta={'left'}
                size={'xs'}
                label="We collect anonymous data from users for research purposes. Please check this box if you are 18+ years of age and agree to share anonymous data. (Not required to use the website)"/>
        </Flex>
    );
}

export default ImpactStatement;
