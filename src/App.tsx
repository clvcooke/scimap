import './App.css'
import 'maplibre-gl/dist/maplibre-gl.css';
import LossMap from "./components/LossMap.tsx";
import ActionMenu, { TabOption } from "./components/ActionMenu.tsx";
import { Flex, Modal, ScrollArea } from '@mantine/core';
import { useEffect, useState } from "react";
import ImpactStatement from "./components/ImpactStatement.tsx";
import LearnMore from "./components/LearnMore.tsx";
import About from "./components/About.tsx";
import Advocacy from "./components/Advocacy.tsx";

import Quiz from "./components/Quiz.tsx";
import { ANALYTICS_ACTIONS, BaseLayer, Overlay } from "./constants.ts";
import { initializeGA, initializePostHog, trackEvent } from "./utils/analytics.ts";


function App() {
    // Initialize both Google Analytics and PostHog
    initializeGA("G-CCM3BQY1WQ");
    initializePostHog();

    const [currentTab, setCurrentTab] = useState<TabOption>("map");
    const [impactOpen, setImpactOpen] = useState(false);
    const [baseLayer, setBaseLayer] = useState<BaseLayer>("IDC");
    const [overlayLayer, setOverlayLayer] = useState<Overlay>("GRANTS");
    const [disabledTabs, setDisabledTabs] = useState<TabOption[]>([]);
    const [showFY26, setShowFY26] = useState<boolean>(false)
    useEffect(() => {
        const url = window.location.pathname;
        setShowFY26(url?.toLowerCase().includes('fy2026'))
    }, [])

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const conditionParam = urlParams.get('CONDITION') || urlParams.get('condition') || urlParams.get('Condition');
        const skipWelcome = urlParams.get('SKIP_WELCOME') || urlParams.get('skip_welcome') || urlParams.get('Skip_Welcome');
        const prolificPidParam = urlParams.get('PROLIFIC_PID') || urlParams.get('prolific_pid') || urlParams.get('Prolific_PID');

        const [baseLayer, overlayLayer] = conditionParam?.split("_") ?? [];

        setBaseLayer((baseLayer?.toUpperCase() ?? "IDC") as BaseLayer);
        setOverlayLayer((overlayLayer?.toUpperCase() ?? "GRANTS") as Overlay);
        console.log({ baseLayer, overlayLayer, skipWelcome });
        if (skipWelcome?.toLocaleLowerCase() === "true") {
            setImpactOpen(false);
        } else {
            setImpactOpen(true);
        }

        // Record PROLIFIC_PID in both Google Analytics and PostHog if it exists
        if (prolificPidParam) {
            trackEvent(
                ANALYTICS_ACTIONS.experiment,
                'PROLIFIC_PID',
                prolificPidParam
            );
        }
        if (conditionParam) {
            trackEvent(
                ANALYTICS_ACTIONS.experiment,
                'CONDITION',
                conditionParam
            );
            setDisabledTabs(['quiz']);
        }
    }, []);

    const showMap = currentTab === "map";
    const showQuiz = currentTab === "quiz";
    const showLearn = currentTab === "learn";
    const showAbout = currentTab === "about";
    const takeAction = currentTab === "action";


    if (showFY26) {
        return  <iframe
                style={{
                    width: 0,
                    minWidth: '100%',
                    height: 0,
                    minHeight: '100%',
                }}
                scrolling='no'
                frameBorder={"0"}
                title="Economic Loss due to NIH Budget Cuts by Congressional District" aria-label="Map" id="datawrapper-chart-ESgj3" src="https://datawrapper.dwcdn.net/ESgj3/4/" data-external="1"></iframe>
    } else {

        return <>
            <Flex
                direction="column" justify="space-between" align="center"
                style={{ minHeight: '100svh', maxHeight: '100svh', width: '100%', position: 'relative' }}
            >
                {showMap &&
                    <div className="Map Container" style={{ width: '100%', flex: 1, position: 'relative' }}>
                        <LossMap baseLayer={baseLayer} overlay={overlayLayer} />
                    </div>
                }
                {!showMap && <ScrollArea
                    // style={{flex: 1}}
                    style={{ height: "calc(100svh - 3rem)" }}
                >
                    {showLearn && <LearnMore />}
                    {showAbout && <About />}
                    {takeAction && <Advocacy />}
                    {showQuiz && <Quiz setActiveTab={setCurrentTab} />}
                </ScrollArea>}

                <div style={{ height: "2.7rem" }}>
                    <ActionMenu currentTab={currentTab ?? "map"} setCurrentTab={setCurrentTab} disabledTabs={disabledTabs} />
                </div>
                <Modal closeOnClickOutside={false} size={"lg"} opened={impactOpen} zIndex={1050}
                    onClose={() => setImpactOpen(false)} withCloseButton={false} centered>
                    <ImpactStatement close={() => {
                        trackEvent(
                            ANALYTICS_ACTIONS.action,
                            'CLOSE_IMPACT_STATEMENT'
                        );
                        setImpactOpen(false)
                    }} />
                </Modal>
            </Flex>

        </>
    }

}

export default App
