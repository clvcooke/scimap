import {Card, Group, Stack, Text} from "@mantine/core";
import {generateJobLossString} from "../../utils/info.ts";
import {generateEconLossString} from "../../utils/info.ts";
import {TopImpact} from "../../data/report-card-data.ts";

export const ReportInfoCard = ({
                                   representativeName,
                                   juniorSenator,
                                   seniorSenator,
                                   econLossFY26,
                                   agingLossFY26,
                                   cancerLossFY26,
                                   infectLossFY26,
                                   jobLossFY26,
                                   topFiveImpact,
                               }: {
    state?: string,
    districtId?: string,
    representativeName: string,
    juniorSenator: string;
    seniorSenator: string;
    econLossIDC: number,
    jobLossIDC: number,
    econLossFY26: number,
    jobLossFY26: number,
    agingLossFY26: number,
    cancerLossFY26: number,
    infectLossFY26: number,
    terminatedLoss: number,
    topFiveImpact: TopImpact[],
}) => {

    return <Card shadow="sm" padding="sm" radius="md" withBorder>
        <Stack gap="lg">
            {/* Representatives - Consistent alignment */}
            <Stack gap={1}>
                <Text size="md" fw={600} c="dark" tt="uppercase" mb={'xs'}>Congressional Representatives</Text>
                <Group justify="space-between" gap="xs">
                    <Text size="sm" c="dark">House Representative:</Text>
                    <Text size="sm" fw={500} c="dark" ta="right" style={{flex: 1}}>{representativeName}</Text>
                </Group>
                <Group justify="space-between" gap="xs">
                    <Text size="sm" c="dark">Junior Senator:</Text>
                    <Text size="sm" fw={500} c="dark" ta="right" style={{flex: 1}}>{juniorSenator}</Text>
                </Group>
                <Group justify="space-between" gap="xs">
                    <Text size="sm" c="dark">Senior Senator:</Text>
                    <Text size="sm" fw={500} c="dark" ta="right" style={{flex: 1}}>{seniorSenator}</Text>
                </Group>
            </Stack>

            {/* Economic Impact - Compact */}
            <Stack gap={2}>
                <Text size="md" fw={600} c="dark" mb='xs' tt="uppercase">Projected Losses from NIH Budget Cuts</Text>
                <Group justify="space-between" gap="xs">
                    <Text size="sm" fw={500} c="dark">Job Loss:</Text>
                    <Text size="sm" fw={600} c="red.9">{generateJobLossString(jobLossFY26)}</Text>
                </Group>
                <Group justify="space-between" gap="xs">
                    <Text size="sm" fw={500} c="dark">Total Economic Loss:</Text>
                    <Text size="sm" fw={600} c="red.9">{generateEconLossString(econLossFY26)}</Text>
                </Group>

                {/* Research Areas - Consistent alignment */}
                <Stack gap={1} ml="xs">
                    <Group justify="space-between" gap="xs">
                        <Text size="xs" c="dark">• Aging Research:</Text>
                        <Text size="xs" fw={500} c="orange.8">{generateEconLossString(agingLossFY26)}</Text>
                    </Group>
                    <Group justify="space-between" gap="xs">
                        <Text size="xs" c="dark">• Cancer Research:</Text>
                        <Text size="xs" fw={500} c="orange.8">{generateEconLossString(cancerLossFY26)}</Text>
                    </Group>
                    <Group justify="space-between" gap="xs">
                        <Text size="xs" c="dark">• Infectious Disease Research:</Text>
                        <Text size="xs" fw={500} c="orange.8">{generateEconLossString(infectLossFY26)}</Text>
                    </Group>
                </Stack>
            </Stack>

            {/* Top 5 Institutions - Consistent alignment */}
            {topFiveImpact && topFiveImpact.length > 0 && (
                <Stack gap={2}>
                    <Text size="md" fw={600} c="dark" tt="uppercase" mb={'sm'}>Top 5 Institutions Driving regional Loss</Text>
                    <Stack gap={1}>
                        {topFiveImpact.slice(0, 5).map((institution, index) => (
                            <Group key={index} justify="space-between" align="flex-start" gap="xs" wrap="nowrap">
                                <Text size="sm" c="dark">
                                    {institution.org_name}
                                </Text>
                                <Text size="sm" fw={600} c="red.9" style={{
                                    whiteSpace: 'nowrap',
                                    marginLeft: '4px'
                                }}>
                                    {generateEconLossString(institution.budg_NIH_cuts_econ_loss)}
                                </Text>
                            </Group>
                        ))}
                    </Stack>
                </Stack>
            )}
        </Stack>
    </Card>
};