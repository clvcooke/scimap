import {ActionIcon, Card, Group, Text} from "@mantine/core";
import {IconShare} from "@tabler/icons-react";
import {ANALYTICS_ACTIONS, formattedCost, formattedJobs} from "../constants.ts";
import {trackEvent} from "../utils/analytics.ts";

import {
    FacebookShareButton,
    TwitterShareButton,
    FacebookIcon,
    BlueskyShareButton,
    BlueskyIcon, ThreadsShareButton, ThreadsIcon, WhatsappShareButton, WhatsappIcon, XIcon
} from 'react-share';


function SharePage({title, text, summary}: { title: string, text?: string, summary?: string }) {
    const pageUrl = window.location.href;

    const trackShare = (platform: string) => {
        trackEvent(
            ANALYTICS_ACTIONS.action,
            `Share - ${platform} - ${title}`
        );
    };

    const shareText = text ?? `Impact: $${formattedCost} and ${formattedJobs} Jobs Lost`;
    const shareTitle = summary ?? 'Federal Health Research Cuts';
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: shareText,
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
            <FacebookShareButton url={pageUrl} title={shareTitle} hashtag="#SCIMaP"
                                 onClick={() => trackShare('Facebook')}
            >
                <FacebookIcon size={32} round/>
            </FacebookShareButton>
            <BlueskyShareButton url={pageUrl} title={shareTitle} onClick={() => trackShare('BlueSky')}
            >
                <BlueskyIcon size={32} round/>
            </BlueskyShareButton>

            <TwitterShareButton url={pageUrl} title={shareTitle} onClick={() => trackShare('X/Twitter')}
            >
                <XIcon size={32} round/>
            </TwitterShareButton>
            <ThreadsShareButton url={pageUrl} title={shareTitle} onClick={() => trackShare('Threads')}
            >
                <ThreadsIcon size={32} round/>
            </ThreadsShareButton>
            <WhatsappShareButton url={pageUrl} title={shareTitle} onClick={() => trackShare('WhatsApp')}>
                <WhatsappIcon size={32} round/>
            </WhatsappShareButton>

            <ActionIcon onClick={handleShare} variant={'subtle'}>
                <IconShare size={32}/>
            </ActionIcon>
        </Group>
    </Card>

}

export default SharePage;
