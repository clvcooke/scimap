import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {MantineProvider} from "@mantine/core";
import '@mantine/core/styles.css';
import {Helmet} from "react-helmet";
import {PostHogProvider} from 'posthog-js/react'
import {REACT_APP_PUBLIC_POSTHOG_HOST, REACT_APP_PUBLIC_POSTHOG_KEY} from "./constants.ts";

const options = {
    api_host: REACT_APP_PUBLIC_POSTHOG_HOST,
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <PostHogProvider
            apiKey={REACT_APP_PUBLIC_POSTHOG_KEY}
            options={options}>

            <MantineProvider>
                <Helmet>
                    <title>SCIMaP</title>
                    <meta name="description" content="The Science & Community Impacts Mapping Project"/>
                </Helmet>
                <App/>
            </MantineProvider>
        </PostHogProvider>
    </StrictMode>,
)
