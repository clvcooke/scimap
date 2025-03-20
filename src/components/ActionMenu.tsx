import {Tabs} from '@mantine/core';


export type TabOption = 'map' | 'quiz' | 'learn';


function ActionMenu({currentTab, setCurrentTab}: { currentTab: TabOption, setCurrentTab: (tab: TabOption) => void }) {
    return (
        <Tabs value={currentTab} color="teal" variant="pills" radius="xs" onChange={(tab) => {
            if (tab && ["map", "quiz", "learn"].includes(tab)) {
                // @ts-expect-error: bad TS
                setCurrentTab(tab);
            } else {
                setCurrentTab("map");
            }

        }}>
            <Tabs.List>
                <Tabs.Tab value="map">
                    Map
                </Tabs.Tab>
                <Tabs.Tab value="quiz">
                    Quiz
                </Tabs.Tab>
                <Tabs.Tab value="learn">
                    Learn More
                </Tabs.Tab>
            </Tabs.List>
        </Tabs>
    );
}

export default ActionMenu;