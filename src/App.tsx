import './App.css'
import 'maplibre-gl/dist/maplibre-gl.css';
import LossMap from "./components/LossMap.tsx";
import ActionMenu, {TabOption} from "./components/ActionMenu.tsx";
import {Button, Card, Flex} from '@mantine/core';
import {useEffect, useState} from "react";
import ImpactStatement from "./components/ImpactStatement.tsx";
import LearnMore from "./components/LearnMore.tsx";


function App() {
    const [opened, setOpened] = useState(true);
    const [currentTab, setCurrentTab] = useState<TabOption | null>("map");

    useEffect(() => {
        setOpened(true);
    }, []);

    const showMap = currentTab === "map";
    const showQuiz = currentTab === "quiz";
    const showLearn = currentTab === "learn";

    return <>

        <Flex direction="column" justify="center" align="center" style={{minHeight: '100vh'}}>
            <div className="Loss Map" style={{width: '100%', flex: 1, position: 'relative'}}>
                {showMap && <LossMap/>}
                {showQuiz && <Button>Quiz</Button>}
                {showLearn && <LearnMore/>}
            </div>
            <ActionMenu currentTab={currentTab ?? "map"} setCurrentTab={setCurrentTab}/>
        </Flex>
        {opened && <Flex justify="center" align="center"
                         onClick={() => setOpened(false)}
                         style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2}}>
            <Card shadow="sm" padding="md" radius="md" withBorder
                  style={{color: 'black', textAlign: 'left', width: '50%'}}>
                <Flex direction="column" gap="xs">
                    <ImpactStatement/>
                </Flex>
            </Card>
        </Flex>}


    </>
}

export default App
