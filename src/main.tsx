import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
// import './index.css'
import App from './App.tsx'
import {MantineProvider} from "@mantine/core";
import '@mantine/core/styles.css';
import * as Sentry from "@sentry/react";
import {SocialMetaTags} from "./components/SocialMetaTags.tsx";

if (window.location.hostname === 'scienceimpacts.org') {
    Sentry.init({
        dsn: "https://5cc6625eac8a4075e42341deefc42135@o4509086741889024.ingest.us.sentry.io/4509086742872064",
    });
}


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <MantineProvider>
            <SocialMetaTags/>
            <App/>
        </MantineProvider>
    </StrictMode>,
)
