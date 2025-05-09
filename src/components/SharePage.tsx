import {isMobile} from "react-device-detect";
import {ActionIcon, Card, Group, Text} from "@mantine/core";
import {IconShare} from "@tabler/icons-react";
import {ANALYTICS_ACTIONS, formattedCost, formattedJobs} from "../constants.ts";
import { trackEvent } from "../utils/analytics.ts";

import {
    FacebookShareButton,
    TwitterShareButton,
    EmailShareButton,
    FacebookIcon,
    EmailIcon,
    BlueskyShareButton,
    BlueskyIcon, ThreadsShareButton, ThreadsIcon, WhatsappShareButton, WhatsappIcon, XIcon
} from 'react-share';


function SharePage({title}: { title: string }) {
    const pageUrl = window.location.href;

    const trackShare = (platform: string) => {
        trackEvent(
            ANALYTICS_ACTIONS.action,
            `Share - ${platform} - ${title}`
        );
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Federal Health Research Cuts',
                    text: `Impact: $${formattedCost} and ${formattedJobs} Jobs Lost`,
                    url: pageUrl,
                });
                trackShare("Generic")
            } catch (error) {
                console.error('Error sharing:', error);
                alert("Error sharing. Please copy the link to your clipboard.");
            }
        }
    };


    return <Card shadow="sm" padding="lg" radius="md" withBorder style={{display: 'flex', justifyContent: 'center'}}>
        <Text size="lg" fw={500}>
            Share on your preferred platform
        </Text>
        <Group mt="md" gap="xs" align="center" style={{width: '100%'}}>
            <FacebookShareButton url={pageUrl} title={title} hashtag="#SCIMaP" onClick={() => trackShare('Facebook')}
            >
                <FacebookIcon size={32} round/>
            </FacebookShareButton>
            <BlueskyShareButton url={pageUrl} title={title} onClick={() => trackShare('BlueSky')}
            >
                <BlueskyIcon size={32} round/>
            </BlueskyShareButton>

            <TwitterShareButton url={pageUrl} title={title} onClick={() => trackShare('X/Twitter')}
            >
                <XIcon size={32} round/>
            </TwitterShareButton>
            <ThreadsShareButton url={pageUrl} title={title} onClick={() => trackShare('Threads')}
            >
                <ThreadsIcon size={32} round/>
            </ThreadsShareButton>
            <WhatsappShareButton url={pageUrl} title={title} onClick={() => trackShare('WhatsApp')}>
                <WhatsappIcon size={32} round/>
            </WhatsappShareButton>
            <EmailShareButton url={pageUrl} subject={title} body={title} onClick={() => trackShare('Email')}>
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
