import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {MantineProvider} from "@mantine/core";
import '@mantine/core/styles.css';
import {Helmet} from "react-helmet";


createRoot(document.getElementById('root')!).render(
    <StrictMode>
            <MantineProvider>
                <Helmet>
                    <title>SCIMaP</title>
                    <meta name="description" content="The Science & Community Impacts Mapping Project"/>
                </Helmet>
                <App/>
            </MantineProvider>
    </StrictMode>,
)
