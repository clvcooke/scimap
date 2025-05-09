import './App.css'
import 'maplibre-gl/dist/maplibre-gl.css';
import LossMap from "./components/LossMap.tsx";
import ActionMenu, {TabOption} from "./components/ActionMenu.tsx";
import {Flex, Modal, ScrollArea} from '@mantine/core';
import {useEffect, useState} from "react";
import ImpactStatement from "./components/ImpactStatement.tsx";
import LearnMore from "./components/LearnMore.tsx";
import About from "./components/About.tsx";
import Advocacy from "./components/Advocacy.tsx";

import ReactGA from 'react-ga4';
import Quiz from "./components/Quiz.tsx";
import {ANALYTICS_ACTIONS, BaseLayer, Overlay} from "./constants.ts";


function App() {
    ReactGA.initialize("G-CCM3BQY1WQ");
    const [currentTab, setCurrentTab] = useState<TabOption>("map");
    const [impactOpen, setImpactOpen] = useState(false);
    const [baseLayer, setBaseLayer] = useState<BaseLayer>(null);
    const [overlayLayer, setOverlayLayer] = useState<Overlay>(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const conditionParam = urlParams.get('CONDITION') || urlParams.get('condition') || urlParams.get('Condition');
        const skipWelcome = urlParams.get('SKIP_WELCOME') || urlParams.get('skip_welcome') || urlParams.get('Skip_Welcome');
        const prolificPidParam = urlParams.get('PROLIFIC_PID') || urlParams.get('prolific_pid') || urlParams.get('Prolific_PID');

        const [baseLayer, overlayLayer] = conditionParam?.split("_") ?? [];

        setBaseLayer(baseLayer?.toUpperCase() as BaseLayer);
        setOverlayLayer(overlayLayer?.toUpperCase() as Overlay);
        console.log({baseLayer, overlayLayer, skipWelcome});
        if (skipWelcome?.toLocaleLowerCase() === "true") {
            setImpactOpen(false);
        } else {
            setImpactOpen(true);
        }

        // Record PROLIFIC_PID in Google Analytics if it exists
        if (prolificPidParam) {
            ReactGA.event({
                category: ANALYTICS_ACTIONS.consent,
                action: 'PROLIFIC_PID',
                label: prolificPidParam
            });
        }
        if (conditionParam) {
            ReactGA.event({
                category: ANALYTICS_ACTIONS.condition,
                action: 'CONDITION',
                label: conditionParam
            });
        }
    }, []);

    const showMap = currentTab === "map";
    const showQuiz = currentTab === "quiz";
    const showLearn = currentTab === "learn";
    const showAbout = currentTab === "about";
    const takeAction = currentTab === "action";

    return <>
        <Flex direction="column" justify="space-between" align="center"
              style={{minHeight: '100svh', maxHeight: '100svh', width: '100%', position: 'relative'}}>
            {showMap &&
                <div className="Map Container" style={{width: '100%', flex: 1, position: 'relative'}}>
                    <LossMap baseLayer={baseLayer} overlay={overlayLayer} />
                </div>
            }
            {!showMap && <ScrollArea
                // style={{flex: 1}}
                style={{height: "calc(100svh - 3rem)"}}
            >
                {showLearn && <LearnMore/>}
                {showAbout && <About/>}
                {takeAction && <Advocacy/>}
                {showQuiz && <Quiz setActiveTab={setCurrentTab}/>}
            </ScrollArea>}

            <div style={{height: "2.5rem"}}>
                <ActionMenu currentTab={currentTab ?? "map"} setCurrentTab={setCurrentTab}/>
            </div>
        </Flex>
        <Modal closeOnClickOutside={false} size={"lg"} withinPortal={false} opened={impactOpen} onClose={() => setImpactOpen(false)} withCloseButton={false} centered>
            <ImpactStatement close={() => {
                ReactGA.event({
                    category: ANALYTICS_ACTIONS.action,
                    action: `CLOSE_IMPACT_STATEMENT`,
                });
                setImpactOpen(false)
            }}/>
        </Modal>
    </>
}

export default App
