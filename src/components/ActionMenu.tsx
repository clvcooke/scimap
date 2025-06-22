import {Tabs} from '@mantine/core';
import {isMobile} from 'react-device-detect';
import {trackPageView} from "../utils/analytics.ts";

export type TabOption = 'map' | 'quiz' | 'learn' | 'about' | 'action' | 'budget' | 'more';

type Tab = {
    tab: TabOption, name: string, desktopOnly?: boolean, mobileOnly?: boolean
}

function ActionMenu({currentTab, setCurrentTab, disabledTabs}: {
    currentTab: TabOption,
    setCurrentTab: (tab: TabOption) => void,
    disabledTabs?: TabOption[]
}) {

    const tabValues: Tab[] = [
        {
            tab: 'map',
            name: 'Map',
            desktopOnly: false
        },
        {
            tab: 'budget',
            name: 'FY26 Budget Map',
            desktopOnly: false
        },
        {
            tab: 'learn',
            name: isMobile ? 'Learn' : 'Learn More',
            desktopOnly: false
        },
        {
            tab: 'quiz',
            name: 'Quiz',
            desktopOnly: true
        },
        {
            tab: 'action',
            name: 'Take Action',
            desktopOnly: true
        },
        {
            tab: 'about',
            name: 'About',
            desktopOnly: true
        }, {
            tab: 'more',
            name: 'More',
            mobileOnly: true
        }
    ];

    const shouldShowTab = (tabInfo: Tab) => {
        if (disabledTabs?.includes(tabInfo.tab)) return false;
        if (tabInfo.desktopOnly && isMobile) return false;
        return !(tabInfo.mobileOnly && !isMobile);
    };


    return (
        <Tabs value={currentTab} color="teal" variant="pills" radius="xs" onChange={(tab) => {
            trackPageView(tab, tab);
            if (tab && ["map", "quiz", "learn", "about", 'action', 'budget', 'more'].includes(tab)) {
                setCurrentTab(tab as TabOption);
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
                {tabValues
                    .filter(shouldShowTab)
                    .map(tabInfo => (
                        <Tabs.Tab
                            key={tabInfo.tab}
                            value={tabInfo.tab}
                        >
                            {tabInfo.name}
                        </Tabs.Tab>
                    ))
                }
            </Tabs.List>

        </Tabs>
    );
}

export default ActionMenu;
