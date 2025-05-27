import {ActionIcon, Button, Drawer, Group, Select, Stack, Switch, useMantineTheme} from "@mantine/core";
import {
    IconMapPinFilled,
    IconMapPinOff,
    IconSettings,
    IconShare
} from "@tabler/icons-react";
import {isMobile} from "react-device-detect";
import {ANALYTICS_ACTIONS} from "../constants.ts";
import {trackEvent} from "../utils/analytics.ts";
import {useState} from "react";

interface MapControlsProps {
    mode: "county" | "districts" | "state" | "";
    setMode: (mode: "county" | "districts" | "state") => void;
    showGrants: boolean;
    setShowGrants: (show: boolean) => void;
    setShowShare: (show: boolean) => void;

}


function MapControls({mode, setMode, showGrants, setShowGrants, setShowShare}: MapControlsProps) {
    const theme = useMantineTheme();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const modeLabel = mode.slice(0, 1).toUpperCase() + mode.slice(1) === "Districts" ? "House Districts" : mode.slice(0, 1).toUpperCase() + mode.slice(1);

    const handleModeChange = (value: string | null) => {
        if (!value) return;

        if (value === "House Districts") {
            value = "Districts";
        }
        const selectedMode = value.toLowerCase() as 'county' | 'state' | 'districts';
        setMode(selectedMode);
        trackEvent(
            ANALYTICS_ACTIONS.layer,
            selectedMode
        );
    };

    const controlsContent = (
        <Stack style={{
            backgroundColor: theme.colors.gray[0],
            padding: 10
        }} gap={"sm"}>
            <Select
                label="Background"
                ta={'left'}
                size={'xs'}
                inputSize={'xs'}
                w={'11rem'}
                value={modeLabel}
                onChange={handleModeChange}
                data={[
                    'County',
                    'State',
                    'House Districts',
                ]}
            />
            <Switch
                label={<Group gap={'xs'} wrap={'nowrap'} align={'center'}><span>Terminated Grants</span>
                    {showGrants && <IconMapPinFilled color={'#0073ff'} size={'1rem'}/>}
                    {!showGrants && <IconMapPinOff color={'#0073ff'} size={'1rem'}/>}
            </Group>}
                checked={showGrants}
                size={'xs'}
                onChange={(event) => setShowGrants(event.currentTarget.checked)}
            />

        </Stack>
    );

    if (isMobile) {
        return (
            <>
                <Group style={{
                    position: 'absolute',
                    top: 0, // Adjust as needed based on titleHeaderHeight
                    right: 0,
                    zIndex: 10,
                    pointerEvents: 'auto',
                }} gap="xs">
                    <ActionIcon
                        radius={'xl'}
                        onClick={() => setDrawerOpen(true)}
                        aria-label="Settings"
                        size={'lg'}
                    >
                        <IconSettings style={{width: '70%', height: '70%'}}/>
                    </ActionIcon>
                    <ActionIcon
                        radius="xl"
                        onClick={() => setShowShare(true)}
                        aria-label="Share"
                        size={'lg'}
                    >
                        <IconShare size={18}/>
                    </ActionIcon>
                </Group>
                <div style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                }}>
                    <Drawer
                        opened={drawerOpen}
                        position={"bottom"}
                        withinPortal={false}
                        onClose={() => setDrawerOpen(false)}
                        title="Map Settings"
                        size="sm"
                    >
                        {controlsContent}
                    </Drawer>
                </div>
            </>
        );
    }

    // Desktop view
    return (
        <Stack style={{
            position: 'absolute',
            top: 0, // Adjust based on titleHeaderHeight
            right: 0,
            zIndex: 10,
            pointerEvents: 'auto',
        }} gap="xs">
            {controlsContent}
            <Button size={"xs"} rightSection={<IconShare size={16}/>}
                    onClick={() => setShowShare(true)}>
                Share
            </Button>
        </Stack>
    );
}

export default MapControls;
