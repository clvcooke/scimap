import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
// import './index.css'
import App from './App.tsx'
import {MantineProvider} from "@mantine/core";
import '@mantine/core/styles.css';
import {Helmet} from "react-helmet";
import * as Sentry from "@sentry/react";

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

Sentry.init({
    dsn: "https://5cc6625eac8a4075e42341deefc42135@o4509086741889024.ingest.us.sentry.io/4509086742872064",
    enabled: !isLocalhost
});


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
