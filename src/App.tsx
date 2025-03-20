import './App.css'
import 'maplibre-gl/dist/maplibre-gl.css';
import LossMap from "./components/LossMap.tsx";
import ActionMenu from "./components/ActionMenu.tsx";
import { Flex } from '@mantine/core';


function App() {
    return <Flex direction="column" justify="center" align="center" style={{height: '100vh'}}>
        <div className="Loss Map" style={{width: '100%',flex: 1, position: 'relative'}}>
            <LossMap/>
        </div>
        <ActionMenu/>
    </Flex>
}

export default App
