const DEFAULT_DESCRIPTION = "Developed by an interdisciplinary research team, this website shows how funding cuts reduce economic activity and employment nationwide";
const DEFAULT_TITLE = "SCIMaP - Impacts of Federal Cuts to Science and Medical Research";
const DEFAULT_IMAGE = "https://data.scienceimpacts.org/preview2.png";

const URL_PREVIEWS = {
    fy26: {
        description: "View Projected Impact of the FY2026 Budget Cuts to the NIH",
        title: DEFAULT_TITLE,
        image: "https://data.scienceimpacts.org/FY26-preview.png",
    },
    default: {
        description: DEFAULT_DESCRIPTION,
        title: DEFAULT_TITLE,
        image: DEFAULT_IMAGE,
    }
}

function getReportCardPreview(url) {
    const searchParams = url.searchParams;
    const stateCode = searchParams.get('stateCode');
    const districtId = searchParams.get('districtId');

    if (stateCode && districtId) {
        return {
            description: `FY26 Fact Sheet for ${stateCode}-${districtId === "00" ? 'AL' : districtId}`,
            title: "SCIMaP - Fact Sheet",
            image: `https://data.scienceimpacts.org/report-cards-v5/report-card-${stateCode}-${districtId}.png`,
        };
    } else if (stateCode) {
        return {
            description: `FY26 Fact Sheet for ${stateCode}`,
            title: "SCIMaP - Fact Sheet",
            image: `https://data.scienceimpacts.org/report-cards-v5/report-card-${stateCode}.png`,
        };
    }

    return null; // Fall back to default
}


export async function onRequest(context) {
    // Get the original response by continuing the middleware chain
    const response = await context.next();
    // Ensure we are only modifying HTML responses
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("text/html")) {
        return response;
    }
    // Read the original HTML response
    let html = await response.text();
    let url_preview_data = URL_PREVIEWS.default;

    const url = new URL(context.request.url);
    const pathPart = url.pathname.toLowerCase();

    // Check for report card URLs
    if (pathPart === "/report") {
        const reportCardPreview = getReportCardPreview(url);
        if (reportCardPreview) {
            url_preview_data = reportCardPreview;
        }
    } else if (["/fy26", "/fy2026"].includes(pathPart)) {
        url_preview_data = URL_PREVIEWS.fy26;
    }

    // Replace the placeholder with the current time
    html = html.replace(/__TITLE__/g, url_preview_data.title);
    html = html.replace(/__DESCRIPTION__/g, url_preview_data.description);
    html = html.replace(/__PREVIEW_IMAGE__/g, url_preview_data.image);
    return new Response(html, {
        headers: response.headers,
    });
}
