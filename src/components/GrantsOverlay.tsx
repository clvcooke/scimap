import {
    Modal,
    Card,
    Text,
    ScrollArea,
    Title,
    Anchor,
    Stack,
    Group,
} from '@mantine/core';
import { useMemo } from 'react';

type GrantLossCounty = {
    reporter_url: string;
    award_remaining: number;
    termination_date: string;
    org_name: string;
    project_title: string;
    cancellation_source: string;
    centroid: [longitude: number, latitude: number];
};

interface GrantsOverlayProps {
    grants: GrantLossCounty[];
    opened: boolean;
    onClose: () => void;
}

// Function to title case a string
const titleCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};


function GrantsOverlay({ grants, opened, onClose }: GrantsOverlayProps) {

    const groupedGrants = useMemo(() => {
        const grouped: { [orgName: string]: GrantLossCounty[] } = {};
        grants?.forEach((grant) => {
            if (!grouped[grant.org_name]) {
                grouped[grant.org_name] = [];
            }
            grouped[grant.org_name].push(grant);
        });

        // Sort organizations by total award remaining
        const sortedOrgNames = Object.keys(grouped).sort((a, b) => {
            const totalA = grouped[a].reduce((sum, grant) => sum + grant.award_remaining, 0);
            const totalB = grouped[b].reduce((sum, grant) => sum + grant.award_remaining, 0);
            return totalB - totalA;
        });

        // Create a sorted array of grouped grants
        return sortedOrgNames.map((orgName) => ({
            orgName,
            grants: grouped[orgName],
        }));
    }, [grants]);

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Grants"
            size="lg"
            closeOnClickOutside={true}
            withinPortal={false}
        >
            <ScrollArea style={{ height: 500 }}>
                <Stack>
                    {groupedGrants.map(({ orgName, grants }) => (
                        <Card key={orgName} shadow="sm" padding="lg" radius="md" withBorder>
                            <Title order={4}>{titleCase(orgName)}</Title>
                            <Stack>
                                {grants.map((grant) => (
                                    <Card
                                        key={grant.project_title}
                                        shadow="xs"
                                        padding="sm"
                                        radius="md"
                                        withBorder
                                    >
                                        <Anchor href={grant.reporter_url} target="_blank">
                                            {grant.project_title}
                                        </Anchor>
                                        <Group gap={'sm'} justify="center"
                                        >
                                            <Text size="sm" color="dimmed">
                                                Lost amount: ${grant.award_remaining}
                                            </Text>
                                            <Text size="sm" color="dimmed">
                                                Termination Date: {grant.termination_date}
                                            </Text>
                                        </Group>

                                    </Card>
                                ))}
                            </Stack>
                        </Card>
                    ))}
                </Stack>
            </ScrollArea>
        </Modal>
    );
}

export default GrantsOverlay;
