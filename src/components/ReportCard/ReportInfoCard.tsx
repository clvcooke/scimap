import {Card, Group, Stack, Text} from "@mantine/core";
import {generateJobLossString} from "../../utils/info.ts";
import {generateEconLossString} from "../../utils/info.ts";

export const ReportInfoCard = ({
                                 stateCode,
                                 districtId,
                                 representativeName,
                                 senatorNames,
                                 econLoss,
                                 jobsLoss,
                                 grantFunds,
                                 terminatedLoss

                             }: {
    stateCode: string,
    districtId: string,
    representativeName?: string,
    senatorNames?: string[],
    econLoss: number,
    jobsLoss: number,
    grantFunds: number,
    terminatedLoss: number,
}) => (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
            <Group justify="space-between" align="flex-start">
                <Text size="xl" fw={700} c="dark">
                    {stateCode} {districtId && `District ${districtId.split('-')[1]}`}
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
                {senatorNames?.map((senator, index) => (
                    <Group key={index} justify="space-between">
                        <Text size="sm" c="dimmed">Senator:</Text>
                        <Text size="sm" fw={500}>{senator}</Text>
                    </Group>
                ))}
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
                    <Text size="sm" c="dimmed">Grant Funding:</Text>
                    <Text size="sm" fw={600}>{generateEconLossString(grantFunds)}</Text>
                </Group>
                <Group justify="space-between">
                    <Text size="sm" c="dimmed">Terminated Funding:</Text>
                    <Text size="sm" fw={600}>{generateEconLossString(terminatedLoss)}</Text>
                </Group>
            </Stack>
        </Stack>
    </Card>
);