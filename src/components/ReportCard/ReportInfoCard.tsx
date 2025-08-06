import {Card, Group, Stack, Text} from "@mantine/core";
import {generateJobLossString} from "../../utils/info.ts";
import {generateEconLossString} from "../../utils/info.ts";
import {TopImpact} from "../../data/report-card-data.ts";

export const ReportInfoCard = ({
                                   state,
                                   districtId,
                                   representativeName,
                                   juniorSenator,
                                   seniorSenator,
                                   econLoss,
                                   jobsLoss,
                                   terminatedLoss,
                                   topFiveImpact,
                               }: {
    state: string,
    districtId: string,
    representativeName?: string,
    juniorSenator: string;
    seniorSenator: string;
    econLoss: number,
    jobsLoss: number,
    terminatedLoss: number,
    topFiveImpact: TopImpact[],
}) => {
    const districtName = districtId == '00' ? 'At Large' : `District ${districtId}`;

    return <Card shadow="sm" padding="md" radius="md" withBorder>
        <Stack gap="sm">
            <Text size="xl" fw={700} c="dark" mb={2}>
                {state} {districtName}
            </Text>

            <Stack gap={2}>
                <Text size="md" fw={600} c="dark" mb={2}>Representatives</Text>
                {representativeName && (
                    <Group justify="space-between" gap="xs">
                        <Text size="sm" c="dark">Representative:</Text>
                        <Text size="sm" fw={500} ta="right" style={{ flex: 1 }}>{representativeName}</Text>
                    </Group>
                )}
                <Group justify="space-between" gap="xs">
                    <Text size="sm" c="dark">Junior Senator:</Text>
                    <Text size="sm" fw={500} ta="right" style={{ flex: 1 }}>{juniorSenator}</Text>
                </Group>
                <Group justify="space-between" gap="xs">
                    <Text size="sm" c="dark">Senior Senator:</Text>
                    <Text size="sm" fw={500} ta="right" style={{ flex: 1 }}>{seniorSenator}</Text>
                </Group>
            </Stack>

            <Stack gap={2}>
                <Text size="md" fw={600} c="dark" mb={2}>Economic Impact</Text>
                <Group justify="space-between" gap="xs">
                    <Text size="sm" c="dark">Total Economic Loss:</Text>
                    <Text size="sm" fw={600} c="red.7" ta="right">{generateEconLossString(econLoss)}</Text>
                </Group>
                <Group justify="space-between" gap="xs">
                    <Text size="sm" c="dark">Jobs Lost:</Text>
                    <Text size="sm" fw={600} c="red.7" ta="right">{generateJobLossString(jobsLoss)}</Text>
                </Group>
                <Group justify="space-between" gap="xs">
                    <Text size="sm" c="dark">Terminated Funding:</Text>
                    <Text size="sm" fw={600} c="red.7" ta="right">{generateEconLossString(terminatedLoss)}</Text>
                </Group>
            </Stack>

            {topFiveImpact && topFiveImpact.length > 0 && (
                <Stack gap={2}>
                    <Text size="md" fw={600} c="dark" mb={2}>Most Affected Institutions</Text>
                    <Stack gap={1}>
                        {topFiveImpact.slice(0, 5).map((institution, index) => (
                            <Group key={index} justify="space-between" align="flex-start" gap="xs" wrap="nowrap">
                                <Text ta={'left'} size="sm"  c="dark" style={{
                                    flex: 1,
                                    lineHeight: 1.3,
                                    minWidth: 0 // Allows text to shrink
                                }}>
                                    {institution.org_name}
                                </Text>
                                <Text size="sm" fw={600} c="red.7" ta="right" style={{
                                    whiteSpace: 'nowrap',
                                    marginLeft: '8px'
                                }}>
                                    {generateEconLossString(institution.terminated_econ_loss + institution.IDC_econ_loss)}
                                </Text>
                            </Group>
                        ))}
                    </Stack>
                </Stack>
            )}
        </Stack>
    </Card>
};