import {Tabs} from '@mantine/core';
import {isMobile} from 'react-device-detect';
import {trackPageView} from "../utils/analytics.ts";

export type TabOption = 'map' | 'quiz' | 'learn' | 'about' | 'action' | 'budget';


function ActionMenu({currentTab, setCurrentTab, disabledTabs}: {
    currentTab: TabOption,
    setCurrentTab: (tab: TabOption) => void,
    disabledTabs?: TabOption[]
}) {
    return (
        <Tabs value={currentTab} color="teal" variant="pills" radius="xs" onChange={(tab) => {
            trackPageView(tab, tab);
            if (tab && ["map", "quiz", "learn", "about", 'action', 'budget'].includes(tab)) {
                // @ts-expect-error: bad TS
                setCurrentTab(tab);
            } else {
                setCurrentTab("map");
            }
        }} styles={{
            tab: {
                'padding': isMobile ? '8px 8px' : '12px 12px',
                'fontSize': isMobile ? '14px' : '16px',
            },
        }}
        >
            <Tabs.List>
                {!disabledTabs?.includes('map') && <Tabs.Tab value="map">
                    Map
                </Tabs.Tab>}
                {!disabledTabs?.includes('quiz') && <Tabs.Tab value="quiz">
                    Quiz
                </Tabs.Tab>}
                {!disabledTabs?.includes('action') && <Tabs.Tab value="action">
                    Take Action
                </Tabs.Tab>}
                {!disabledTabs?.includes('learn') && <Tabs.Tab value="learn">
                    Learn More
                </Tabs.Tab>}
                {!disabledTabs?.includes('about') && <Tabs.Tab value="about">
                    About
                </Tabs.Tab>}
                {!disabledTabs?.includes('budget') && <Tabs.Tab value="budget">
                    2026 Budget
                </Tabs.Tab>}
            </Tabs.List>
        </Tabs>
    );
}

export default ActionMenu;
