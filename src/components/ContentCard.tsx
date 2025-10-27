import React from 'react';
import { Card, Image, Text, Badge, Group } from '@mantine/core';

interface ContentCardProps {
    imageUrl: string;
    category: string;
    title: string;
    description: string;
}

const ContentCard: React.FC<ContentCardProps> = ({ imageUrl, category, title, description }) => {
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ maxWidth: 350, margin: '1rem' }}>
            <Card.Section>
                <Image
                    src={imageUrl}
                    height={160}
                    alt={title}
                />
            </Card.Section>

            <Group position="apart" mt="md" mb="xs">
                <Text weight={500}>{title}</Text>
                <Badge color="pink" variant="light">
                    {category}
                </Badge>
            </Group>

            <Text size="sm" color="dimmed">
                {description}
            </Text>
        </Card>
    );
};

export default ContentCard;
