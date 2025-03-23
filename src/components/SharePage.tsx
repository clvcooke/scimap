import {isMobile} from "react-device-detect";
import {ActionIcon, Card, Group, Text} from "@mantine/core";
import {IconShare} from "@tabler/icons-react";
import {ANALYTICS_ACTIONS, formattedCost, formattedJobs} from "../constants.ts";
import ReactGA from "react-ga4";

import {
    FacebookShareButton,
    TwitterShareButton,
    EmailShareButton,
    FacebookIcon,
    TwitterIcon,
    EmailIcon,
    BlueskyShareButton,
    BlueskyIcon, ThreadsShareButton, ThreadsIcon, WhatsappShareButton, WhatsappIcon
} from 'react-share';


function SharePage({title}: { title: string}) {
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


    return <Card shadow="sm" padding="lg" radius="md" withBorder style={{ display: 'flex', justifyContent: 'center' }}>
        <Text size="lg" fw={500}>
            Share on your preferred platform
        </Text>
        <Group mt="md" gap="xs" align="center" style={{width: '100%'}}>
            <FacebookShareButton url={pageUrl} title={title} hashtag="#SCiMaP">
                <FacebookIcon size={32} round/>
            </FacebookShareButton>
            <BlueskyShareButton url={pageUrl} title={title}>
                <BlueskyIcon size={32} round/>
            </BlueskyShareButton>

            <TwitterShareButton url={pageUrl} title={title}>
                <TwitterIcon size={32} round/>
            </TwitterShareButton>

            <ThreadsShareButton url={pageUrl} title={title}>
                <ThreadsIcon size={32} round/>
            </ThreadsShareButton>
            <WhatsappShareButton url={pageUrl} title={title}>
                <WhatsappIcon size={32} round/>
            </WhatsappShareButton>
            <EmailShareButton url={pageUrl} subject={title} body={title}>
                <EmailIcon size={32} round/>
            </EmailShareButton>
            {isMobile && (
                <ActionIcon onClick={handleShare} variant={'subtle'}>
                    <IconShare size={32}/>
                </ActionIcon>
            )}
        </Group>
    </Card>

}

export default SharePage;