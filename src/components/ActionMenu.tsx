import {Tabs} from '@mantine/core';
import ReactGA from "react-ga4";
import {isMobile} from 'react-device-detect';

export type TabOption = 'map' | 'quiz' | 'learn' | 'about' | 'action';


function ActionMenu({currentTab, setCurrentTab}: { currentTab: TabOption, setCurrentTab: (tab: TabOption) => void }) {
    return (
        <Tabs value={currentTab} color="teal" variant="pills" radius="xs" onChange={(tab) => {
            ReactGA.send({ hitType: "pageview", page: tab, title: tab });
            if (tab && ["map", "quiz", "learn", "about", 'action'].includes(tab)) {
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
                <Tabs.Tab value="map">
                    Map
                </Tabs.Tab>
                <Tabs.Tab value="quiz">
                    Quiz
                </Tabs.Tab>
                <Tabs.Tab value="action">
                    Take Action
                </Tabs.Tab>
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