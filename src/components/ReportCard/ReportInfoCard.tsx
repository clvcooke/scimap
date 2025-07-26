import {Card, Group, Stack, Text} from "@mantine/core";
import {generateJobLossString} from "../../utils/info.ts";
import {generateEconLossString} from "../../utils/info.ts";

export const ReportInfoCard = ({
                                   state,
                                   districtId,
                                   representativeName,
                                   juniorSenator,
    seniorSenator,
                                   econLoss,
                                   jobsLoss,
                                   terminatedLoss

                               }: {
    state: string,
    districtId: string,
    representativeName?: string,
    juniorSenator: string;
    seniorSenator: string;
    econLoss: number,
    jobsLoss: number,
    terminatedLoss: number,
}) => {
    const districtName = districtId == '00' ? 'At Large' : `District ${districtId}`;

    return <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
            <Group justify="space-between" align="flex-start">
                <Text size="xl" fw={700} c="dark">
                    {state} {districtName}
                </Text>
            </Group>

            <Stack gap="sm">
                <Text size="lg" fw={600} c="dark">Representatives</Text>
                {representativeName && (
                    <Group justify="space-between">
                        <Text size="sm" c="dimmed">Representative:</Text>
                        <Text size="sm" fw={500}>{representativeName}</Text>
                    </Group>
                )}
                <Group justify="space-between">
                    <Text size="sm" c="dimmed">Junior Senator:</Text>
                    <Text size="sm" fw={500}>{juniorSenator}</Text>
                </Group>
                <Group justify="space-between">
                    <Text size="sm" c="dimmed">Senior Senator:</Text>
                    <Text size="sm" fw={500}>{seniorSenator}</Text>
                </Group>
            </Stack>

            <Stack gap="sm">
                <Text size="lg" fw={600} c="dark">Economic Impact</Text>
                <Group justify="space-between">
                    <Text size="sm" c="dimmed">Total Economic Loss:</Text>
                    <Text size="sm" fw={600}>{generateEconLossString(econLoss)}</Text>
                </Group>
                <Group justify="space-between">
                    <Text size="sm" c="dimmed">Jobs Lost:</Text>
                    <Text size="sm" fw={600}>{generateJobLossString(jobsLoss)}</Text>
                </Group>
                <Group justify="space-between">
                    <Text size="sm" c="dimmed">Terminated Funding:</Text>
                    <Text size="sm" fw={600}>{generateEconLossString(terminatedLoss)}</Text>
                </Group>
            </Stack>
        </Stack>
    </Card>
};