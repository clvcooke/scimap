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

// Function to title case a string
const titleCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};


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
            title="Terminated NIH Grants"
            size="md"
            closeOnClickOutside={true}
            withinPortal={false}
        >
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
                                <Title order={4}>{titleCase(orgName)}</Title>
                                <Flex
                                    mt="md"
                                    direction="column" // Stack on smaller screens
                                    align="start"
                                    justify="space-between"
                                >
                                    <Text fw={500}>Grants Cancelled: {grants.length}</Text>
                                    <Text fw={500}>Funding Lost: {formattedDollarsLost}</Text>
                                </Flex>
                            </Card>
                        );

                    })}
                </Stack>
            </ScrollArea>
        </Modal>
    );
}

export default GrantsOverlay;
