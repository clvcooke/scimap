
import { Text, Anchor, Group, Badge } from '@mantine/core';
import { IconExternalLink, IconCalendar } from '@tabler/icons-react';

interface NewsItemProps {
    date: string;
    title: string;
    url: string;
    isOngoing?: boolean;
}

function NewsItem({ date, title, url, isOngoing = false }: NewsItemProps) {
    return (
        <Group gap="xs" align="flex-start" mt="sm" wrap="nowrap">
            <Badge
                variant={isOngoing ? "filled" : "light"}
                color={isOngoing ? "blue" : "dark"}

                size="sm"
                leftSection={<IconCalendar size={12} />}
                style={{ minWidth: '8rem',
                    justifyContent: 'center'
                }}
            >
                {date}
            </Badge>

            <Text ta="left" size="sm" flex={1}>
                <Anchor
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    c="blue.7"
                    td="none"
                    fw={500}
                >
                    <Group gap={4} wrap="nowrap" align="center">
                        <Text span inherit>
                            {title}
                        </Text>
                        <IconExternalLink
                            size={14}
                            style={{ opacity: 0.7, flexShrink: 0 }}
                        />
                    </Group>
                </Anchor>
            </Text>
        </Group>
    );
}

export default NewsItem;