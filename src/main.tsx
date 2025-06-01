import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
// import './index.css'
import App from './App.tsx'
import {MantineProvider} from "@mantine/core";
import '@mantine/core/styles.css';
import {Helmet} from "react-helmet";
import * as Sentry from "@sentry/react";

Sentry.init({
    dsn: "https://5cc6625eac8a4075e42341deefc42135@o4509086741889024.ingest.us.sentry.io/4509086742872064"
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
