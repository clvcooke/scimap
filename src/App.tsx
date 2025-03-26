import './App.css'
import 'maplibre-gl/dist/maplibre-gl.css';
import LossMap from "./components/LossMap.tsx";
import ActionMenu, {TabOption} from "./components/ActionMenu.tsx";
import {Flex, Modal, ScrollArea} from '@mantine/core';
import {useState} from "react";
import ImpactStatement from "./components/ImpactStatement.tsx";
import LearnMore from "./components/LearnMore.tsx";
import About from "./components/About.tsx";
import Advocacy from "./components/Advocacy.tsx";

import ReactGA from 'react-ga4';
import Quiz from "./components/Quiz.tsx";


function App() {
    ReactGA.initialize("G-CCM3BQY1WQ");
    const [currentTab, setCurrentTab] = useState<TabOption>("map");
    const [impactOpen, setImpactOpen] = useState(true);

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
                    <LossMap/>
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
            <ImpactStatement close={() => setImpactOpen(false)}/>
        </Modal>
    </>
}

export default App
