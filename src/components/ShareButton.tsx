import { isMobile } from "react-device-detect";
import {Button} from "@mantine/core";
import {IconLink, IconShare} from "@tabler/icons-react";
import {ANALYTICS_ACTIONS, formattedCost, formattedJobs} from "../constants.ts";
import ReactGA from "react-ga4";

function ShareButton() {
    const pageUrl = window.location.href;
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Federal Health Research Cuts',
                    text: `Impact: $${formattedCost} and ${formattedJobs} Jobs Lost`,
                    url: pageUrl,
                });
                ReactGA.event({
                    category: ANALYTICS_ACTIONS.action, // Required
                    action: 'Share',     // Required
                });
            } catch (error) {
                console.error('Error sharing:', error);
                alert("Error sharing. Please copy the link to your clipboard.");
            }
        }
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(pageUrl);
        ReactGA.event({
            category: ANALYTICS_ACTIONS.action, // Required
            action: 'Copy',     // Required
        });
        alert("Link copied to clipboard.");
    }

    if (isMobile) {
        return <Button onClick={handleShare} size={"sm"} rightSection={<IconShare size={16}/>}>Share</Button>
    } else {
        return <Button onClick={handleCopy} size={"sm"} rightSection={<IconLink size={16}/>}>Copy Page Link</Button>
    }
}

export default ShareButton;