import './App.css'
import 'maplibre-gl/dist/maplibre-gl.css';
import LossMap from "./components/LossMap.tsx";
import ActionMenu, {TabOption} from "./components/ActionMenu.tsx";
import {Button, Flex, ScrollArea} from '@mantine/core';
import {useEffect, useState} from "react";
import ImpactStatement from "./components/ImpactStatement.tsx";
import LearnMore from "./components/LearnMore.tsx";
import About from "./components/About.tsx";


function App() {
    const [opened, setOpened] = useState(true);
    const [currentTab, setCurrentTab] = useState<TabOption | null>("map");

    useEffect(() => {
        setOpened(true);
    }, []);

    const showMap = currentTab === "map";
    const showQuiz = currentTab === "quiz";
    const showLearn = currentTab === "learn";
    const showAbout = currentTab === "about";

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
                {showQuiz && <Button>Quiz</Button>}
                {showLearn && <LearnMore/>}
                {showAbout && <About/>}
            </ScrollArea>}

            <div style={{height: "2.5rem"}}>
                <ActionMenu currentTab={currentTab ?? "map"} setCurrentTab={setCurrentTab}/>
            </div>
        </Flex>
        {opened && <Flex justify="center" align="center"
                         onClick={() => setOpened(false)}
                         style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2}}>

            <Flex direction="column" gap="xs">
                <ImpactStatement/>
            </Flex>
        </Flex>}


    </>
}

export default App
