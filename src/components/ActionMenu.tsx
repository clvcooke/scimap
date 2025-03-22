import {Tabs} from '@mantine/core';


export type TabOption = 'map' | 'quiz' | 'learn' | 'about';


function ActionMenu({currentTab, setCurrentTab}: { currentTab: TabOption, setCurrentTab: (tab: TabOption) => void }) {
    return (
        <Tabs value={currentTab} color="teal" variant="pills" radius="xs" onChange={(tab) => {
            if (tab && ["map", "quiz", "learn", "about"].includes(tab)) {
                // @ts-expect-error: bad TS
                setCurrentTab(tab);
            } else {
                setCurrentTab("map");
            }

        }} styles={{
            tab: {
                'padding': '12px 24px',
                'fontSize': '14px',

            },
        }}
        >
            <Tabs.List>
                <Tabs.Tab value="map">
                    Map
                </Tabs.Tab>
                {/*<Tabs.Tab value="quiz">*/}
                {/*    Quiz*/}
                {/*</Tabs.Tab>*/}
                <Tabs.Tab value="learn">
                    Learn More
                </Tabs.Tab>
                <Tabs.Tab value="about">
                    About
                </Tabs.Tab>
            </Tabs.List>
        </Tabs>
    );
}

export default ActionMenu;