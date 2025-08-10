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
                                   econLossFY26,
                                   agingLossFY26,
                                   cancerLossFY26,
                                   infectLossFY26,
                                   jobLossFY26,
                                   topFiveImpact,
                               }: {
    state: string,
    districtId: string,
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
    const districtName = districtId == '00' ? 'At Large' : `District ${districtId}`;

    return <Card shadow="sm" padding="sm" radius="md" withBorder>
        <Stack gap="xs">
            <Text size="lg" fw={700} c="dark" lh={1.2}>
                {state} {districtName}
            </Text>

            {/* Representatives - Consistent alignment */}
            <Stack gap={1}>
                <Text size="xs" fw={600} c="dark" tt="uppercase">Representatives</Text>
                <Group justify="space-between" gap="xs">
                    <Text size="xs" c="dark">House Representative:</Text>
                    <Text size="xs" fw={500} c="dark" ta="right" style={{flex: 1}}>{representativeName}</Text>
                </Group>
                <Group justify="space-between" gap="xs">
                    <Text size="xs" c="dark">Junior Senator:</Text>
                    <Text size="xs" fw={500} c="dark" ta="right" style={{flex: 1}}>{juniorSenator}</Text>
                </Group>
                <Group justify="space-between" gap="xs">
                    <Text size="xs" c="dark">Senior Senator:</Text>
                    <Text size="xs" fw={500} c="dark" ta="right" style={{flex: 1}}>{seniorSenator}</Text>
                </Group>
            </Stack>

            {/* Economic Impact - Compact */}
            <Stack gap={2}>
                <Text size="xs" fw={600} c="dark" tt="uppercase">FY26 Budget Impact</Text>
                <Group justify="space-between" gap="xs">
                    <Text size="xs" fw={500} c="dark">Job Loss:</Text>
                    <Text size="xs" fw={600} c="red.7">{generateJobLossString(jobLossFY26)}</Text>
                </Group>
                <Group justify="space-between" gap="xs">
                    <Text size="xs" fw={500} c="dark">Economic Loss:</Text>
                    <Text size="xs" fw={600} c="red.7">{generateEconLossString(econLossFY26)}</Text>
                </Group>

                {/* Research Areas - Consistent alignment */}
                <Stack gap={1} ml="xs">
                    <Group justify="space-between" gap="xs">
                        <Text size="xs" c="dark">• Aging:</Text>
                        <Text size="xs" fw={500} c="red.6">{generateEconLossString(agingLossFY26)}</Text>
                    </Group>
                    <Group justify="space-between" gap="xs">
                        <Text size="xs" c="dark">• Cancer:</Text>
                        <Text size="xs" fw={500} c="red.6">{generateEconLossString(cancerLossFY26)}</Text>
                    </Group>
                    <Group justify="space-between" gap="xs">
                        <Text size="xs" c="dark">• Infectious Disease:</Text>
                        <Text size="xs" fw={500} c="red.6">{generateEconLossString(infectLossFY26)}</Text>
                    </Group>
                </Stack>
            </Stack>

            {/* Top 5 Institutions - Consistent alignment */}
            {topFiveImpact && topFiveImpact.length > 0 && (
                <Stack gap={2}>
                    <Text size="xs" fw={600} c="dark" tt="uppercase">Top 5 Affected Institutions</Text>
                    <Stack gap={1}>
                        {topFiveImpact.slice(0, 5).map((institution, index) => (
                            <Group key={index} justify="space-between" align="flex-start" gap="xs" wrap="nowrap">
                                <Text size="xs" c="dark">
                                    {institution.org_name}
                                </Text>
                                <Text size="xs" fw={600} c="red.7" style={{
                                    whiteSpace: 'nowrap',
                                    marginLeft: '4px'
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