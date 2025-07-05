import {
    Modal,
    Card,
    Text,
    ScrollArea,
    Title,
    Stack,
    Flex,
} from '@mantine/core';
import { useMemo } from 'react';
import {GrantTermination} from "../data/grant-losses.ts";


interface GrantsOverlayProps {
    grants: GrantTermination[];
    opened: boolean;
    onClose: () => void;
}


function GrantsOverlay({ grants, opened, onClose }: GrantsOverlayProps) {

    const groupedGrants = useMemo(() => {
        const grouped: { [orgName: string]: GrantTermination[] } = {};
        grants?.forEach((grant) => {
            if (!grouped[grant.org_name]) {
                grouped[grant.org_name] = [];
            }
            grouped[grant.org_name].push(grant);
        });

        // Sort organizations by total award remaining
        const sortedOrgNames = Object.keys(grouped).sort((a, b) => {
            const totalA = grouped[a].reduce((sum, grant) => sum + (grant.terminated_loss ?? 0), 0);
            const totalB = grouped[b].reduce((sum, grant) => sum + (grant.terminated_loss ?? 0), 0);
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
            title={
                <Title size={'h2'}>
                    Cancelled & Frozen NIH Grants
                </Title>

            }
            size="md"
            closeOnClickOutside={true}
        >
            <Stack gap={'sm'}>

            <Text ta={'left'}>
                <i>Note: This does not include canceled and frozen grants from other federal agencies</i>
            </Text>
            <ScrollArea style={{ height: "80%" }}>
                <Stack>
                    {groupedGrants.map(({ orgName, grants }) => {
                        const totalDollarsLost = grants.reduce((sum, grant) => sum + (grant.terminated_loss ?? 0), 0);
                        const formattedDollarsLost = new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            maximumFractionDigits: 0
                        }).format(totalDollarsLost);


                        return (
                            <Card key={orgName} shadow="sm" padding="lg" radius="md" withBorder>
                                <Title order={4}>{orgName}</Title>
                                <Flex
                                    mt="md"
                                    direction="column" // Stack on smaller screens
                                    align="start"
                                    justify="space-between"
                                >
                                    <Text fw={400}>Grants Cancelled/Frozen: {grants.length}</Text>
                                    <Text fw={400}>Funding Lost: {formattedDollarsLost}</Text>
                                </Flex>
                            </Card>
                        );

                    })}
                </Stack>
            </ScrollArea>
            </Stack>
        </Modal>
    );
}

export default GrantsOverlay;
