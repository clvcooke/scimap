import {Flex, Text, Button, Checkbox} from '@mantine/core';
import {useState} from "react";
import {ANALYTICS_ACTIONS} from "../constants.ts";
import {trackEvent} from "../utils/analytics.ts";

function ImpactStatement({close}: { close: () => void }) {
    const [consent, setConsent] = useState(true);

    return (
        <Flex direction="column" gap="sm">
            <Text size="xl" c="dark" ta="center">Medical Research is at Risk</Text>
            <Text size="md" c="dark" ta="left">
                The <b>National Institutes of Health</b> (NIH) funds crucial health research to address
                cancer, diabetes, dementia, and more. NIH funding also boosts the economy, returning &gt;250% of the
                value
                invested. The White House has ordered major cuts to NIH funding nationwide, which would <b>take back
                funds</b>
                already promised to the states.
            </Text>
            <Text size="md" c="dark" ta={"left"}>
                Many NIH grants for health research have been cancelled, interrupting ongoing studies and clinical
                trials (current losses). The administration also ordered across-the-board cuts to NIH funding for
                “indirect costs” of research, which covers essential facilities, equipment, staff, and safety checks
                (future losses). This website shows the economic impact of <b>current and proposed funding cuts</b> nationwide.
            </Text>

            <Button size="md" onClick={() => close()}>
                See Impact
            </Button>
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
                label="We collect anonymous data from users for research purposes. Please check this box if you are 18+ years of age and agree to share anonymous data. (Not required to use the website)"/>
        </Flex>
    );
}

export default ImpactStatement;
