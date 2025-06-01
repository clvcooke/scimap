import {Drawer, Group, Radio, Switch, Text, Divider, Title, Stack} from '@mantine/core';

type MapControlsProps = {
    baseLayer: 'state' | 'districts' | 'county' | '';
    setBaseLayer: (layer: 'state' | 'districts' | 'county' | '') => void;
    isNormalized: boolean;
    setIsNormalized: (normalized: boolean) => void;
    showAnnotations: boolean;
    setShowAnnotations: (show: boolean) => void;
}

type MapControlsDrawerProps = {
    opened: boolean;
    onClose: () => void;

} & MapControlsProps;

function MapControls({
                         baseLayer,
                         setBaseLayer,
                         isNormalized,
                         setIsNormalized,
                         showAnnotations,
                         setShowAnnotations,
                     }: MapControlsProps) {
    return (

            <Stack
                align="stretch"
                justify="flex-start"
                style={{
                    background: 'white',
                    height: '100%'
                }}>
                <Title mt='sm' order={3}>Base Layer</Title>
                <Stack gap={'lg'}>
                    <Title order={4}>Region</Title>
                    <Radio.Group
                        name="baseLayer"
                        value={baseLayer}

                        onChange={(value) => setBaseLayer(value as 'state' | 'districts' | 'county' | '')}
                    >
                        <Stack>
                            <Radio value="county" label="County"/>
                            <Radio value="state" label="State"/>
                            <Radio value="districts" label="House Districts"/>
                            <Radio value="" label="Off"/>
                        </Stack>
                    </Radio.Group>
                    <Title order={4}>Economic Impact</Title>
                    <Stack>
                        <Radio value="county" label="Total Losses"/>
                        <Radio value="state" label="Indirect Cost Losses"/>
                        <Radio value="districts" label="Terminated Grants"/>
                    </Stack>
                    <Group justify="apart">
                        <Text size="sm">Per-Capita</Text>
                        <Switch
                            checked={isNormalized}
                            onChange={(event) => setIsNormalized(event.currentTarget.checked)}
                            label={isNormalized ? 'On' : 'Off'}
                        />
                    </Group>
                </Stack>

                <Divider mt="md" mb="md"/>

                <Title order={4} mb={'md'}>Markers</Title>
                <Group justify="apart">
                    <Text size="sm">Show Terminated Grants</Text>
                    <Switch
                        checked={showAnnotations}
                        onChange={(event) => setShowAnnotations(event.currentTarget.checked)}
                        label={showAnnotations ? 'On' : 'Off'}
                    />
                </Group>
            </Stack>
    );
}

export function MapControlsDrawer({opened, onClose, ...props}: MapControlsDrawerProps) {
    return (
        <Drawer
            position={'left'}
            opened={opened}
            onClose={onClose}
            title="Map Controls"
            padding="md"
            size="sm"
        >
            <MapControls {...props}/>
        </Drawer>
    )
}

export default MapControls;