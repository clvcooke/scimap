import {Card, Group, Stack, Text, useMatches} from "@mantine/core";
import {generateJobLossString} from "../../utils/info.ts";
import {generateEconLossString} from "../../utils/info.ts";
import {TopImpact} from "../../data/report-card-data.ts";

import {isMobile} from "react-device-detect";

export const ReportInfoCard = ({
                                   stateCode,
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
    state?: string,
    stateCode?: string,
    districtId?: string,
    representativeName?: string,
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
    const districtCode = stateCode && districtId ? `${stateCode}-${districtId === "00" ? "AL" : districtId}` : stateCode;

    // Responsive title size and shortened labels for mobile
    const titleSize = useMatches({
        base: 'md',
        md: 'md',
        sm: 'sm',
    });
    const houseLabel = isMobile ? 'House Rep:' : 'House Representative:';
    const juniorLabel = isMobile ? 'Jr. Senator:' : 'Junior Senator:';
    const seniorLabel = isMobile ? 'Sr. Senator:' : 'Senior Senator:';
    const totalEconLabel = isMobile ? 'Economic Loss:' : 'Total Economic Loss:';
    const agingLabel = isMobile ? '• Aging:' : '• Aging Research:';
    const cancerLabel = isMobile ? '• Cancer:' : '• Cancer Research:';
    const infectLabel = isMobile ? '• Infectious Disease:' : '• Infectious Disease Research:';
    console.log("TITLE SIZE", {
        isMobile,
        titleSize
    })

    const projectedLossText = isMobile ? `Projected Losses from NIH Budget Cuts` : `Projected Losses from NIH Budget Cuts in ${districtCode}`;
    const top5Text = isMobile ? `Top Institutions Driving Economic Loss` :`Top 5 Institutions Driving ${districtCode} Economic Loss`

    return <Card shadow="sm" style={{ base: "xs", sm: "sm" }} radius="md" withBorder>
        <Stack style={{ base: "md", sm: "lg" }}>
            <Stack gap={1}>
                <Text size={titleSize} fw={600} c="dark" tt="uppercase" mb={'xs'}>
                    Congressional Representatives
                </Text>
                <Stack gap={4}>
                    {representativeName && <Group justify="space-between" gap="xs" wrap="nowrap">
                        <Text size={'sm'} c="dark" style={{ minWidth: 0 }}>{houseLabel}</Text>
                        <Text size={'sm'} fw={500} c="dark" ta="right" style={{ flex: 1, minWidth: 0 }}>
                            {representativeName}
                        </Text>
                    </Group>}
                    <Group justify="space-between" gap="xs" wrap="nowrap">
                        <Text size={'sm'} c="dark" style={{ minWidth: 0 }}>{juniorLabel}</Text>
                        <Text size={'sm'} fw={500} c="dark" ta="right" style={{ flex: 1, minWidth: 0 }}>
                            {juniorSenator}
                        </Text>
                    </Group>
                    <Group justify="space-between" gap="xs" wrap="nowrap">
                        <Text size={'sm'} c="dark" style={{ minWidth: 0 }}>{seniorLabel}</Text>
                        <Text size={'sm'} fw={500} c="dark" ta="right" style={{ flex: 1, minWidth: 0 }}>
                            {seniorSenator}
                        </Text>
                    </Group>
                </Stack>
            </Stack>

            {/* Economic Impact - Mobile optimized */}
            <Stack gap={2}>
                <Text size={titleSize} fw={600} c="dark" mb='xs' tt="uppercase">
                    {projectedLossText}
                </Text>
                <Stack gap={4}>
                    <Group justify="space-between" gap="xs" wrap="nowrap">
                        <Text size={'sm'} fw={500} c="dark">Job Loss:</Text>
                        <Text size={'sm'} fw={600} c="red.9" style={{ whiteSpace: 'nowrap' }}>
                            {generateJobLossString(jobLossFY26)}
                        </Text>
                    </Group>
                    <Group justify="space-between" gap="xs" wrap="nowrap">
                        <Text size={'sm'} fw={500} c="dark">{totalEconLabel}</Text>
                        <Text size={'sm'} fw={600} c="red.9" style={{ whiteSpace: 'nowrap' }}>
                            {generateEconLossString(econLossFY26)}
                        </Text>
                    </Group>

                    {/* Research Areas - Mobile optimized */}
                    <Stack gap={2} ml={{ base: "xs", sm: "xs" }}>
                        <Group justify="space-between" gap="xs" wrap="nowrap">
                            <Text size="xs" c="dark">{agingLabel}</Text>
                            <Text size="xs" fw={500} c="orange.8" style={{ whiteSpace: 'nowrap' }}>
                                {generateEconLossString(agingLossFY26)}
                            </Text>
                        </Group>
                        <Group justify="space-between" gap="xs" wrap="nowrap">
                            <Text size="xs" c="dark">{cancerLabel}</Text>
                            <Text size="xs" fw={500} c="orange.8" style={{ whiteSpace: 'nowrap' }}>
                                {generateEconLossString(cancerLossFY26)}
                            </Text>
                        </Group>
                        <Group justify="space-between" gap="xs" wrap="nowrap">
                            <Text size="xs" c="dark">{infectLabel}</Text>
                            <Text size="xs" fw={500} c="orange.8" style={{ whiteSpace: 'nowrap' }}>
                                {generateEconLossString(infectLossFY26)}
                            </Text>
                        </Group>
                    </Stack>
                </Stack>
            </Stack>

            {/* Top 5 Institutions - Mobile optimized */}
            {topFiveImpact && topFiveImpact.length > 0 && (
                <Stack gap={2}>
                    <Text size={titleSize} fw={600} c="dark" tt="uppercase" mb={ isMobile ? 'xs' : 'sm' }>
                        {top5Text}
                    </Text>
                    <Stack gap={1}>
                        {topFiveImpact.slice(0, 5).map((institution, index) => (
                            <Group key={index} justify="space-between" align="flex-start" gap="xs" wrap="nowrap">
                                <Text size={'sm'} ta={'left'} c="dark" style={{ minWidth: 0, flex: 1 }}>
                                    {institution.org_name}
                                </Text>
                                <Text size={'sm'} fw={600} c="red.9" style={{
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