import {Helmet} from 'react-helmet';

export const SocialMetaTags = () => {

    // Define the image URL based on the path
    const getImageUrl = () => {
        if (["/fy26", "/fy2026"].includes(window.location.pathname.toLowerCase())) {
            return 'https://data.scienceimpacts.org/FY2026-Loss-CD.png';

        }
        return 'https://data.scienceimpacts.org/preview2.png';
    };

    return (
        <Helmet>
            <meta property="og:image" content={getImageUrl()}/>
            <meta name="twitter:image" content={getImageUrl()}/>
            <title>SCIMaP</title>
            <meta name="description" content="The Science & Community Impacts Mapping Project"/>
        </Helmet>
    );
};
