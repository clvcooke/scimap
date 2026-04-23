const DEFAULT_DESCRIPTION = "Developed by an interdisciplinary research team, this website shows how funding cuts reduce economic activity and employment nationwide";
const DEFAULT_TITLE = "SCIMaP - Impacts of Federal Cuts to Science and Medical Research";
const DEFAULT_IMAGE = "https://data.scienceimpacts.org/FY27-preview.jpg";

const URL_PREVIEWS = {
    fy26: {
        description: "View Projected Impact of the FY2026 Budget Cuts to the NIH",
        title: DEFAULT_TITLE,
        image: "https://data.scienceimpacts.org/FY26-preview.png",
    },
    fy27: {
        description: "View Projected Impact of the FY2027 Budget Cuts to the NIH and NSF",
        title: DEFAULT_TITLE,
        image: "https://data.scienceimpacts.org/FY27-preview.jpg",
    },
    default: {
        description: DEFAULT_DESCRIPTION,
        title: DEFAULT_TITLE,
        image: DEFAULT_IMAGE,
    }
}

function getScorecardPreview(url) {
    const searchParams = url.searchParams;
    const stateCode = searchParams.get('stateCode');
    const districtId = searchParams.get('districtId');

    if (stateCode && districtId) {
        return {
            description: `FY26 Fact Sheet for ${stateCode}-${districtId === "00" ? 'AL' : districtId}`,
            title: "SCIMaP - Fact Sheet",
            image: `https://data.scienceimpacts.org/report-cards-v6/report-card-${stateCode}-${districtId}.png`,
        };
    } else if (stateCode) {
        return {
            description: `FY26 Fact Sheet for ${stateCode}`,
            title: "SCIMaP - Fact Sheet",
            image: `https://data.scienceimpacts.org/report-cards-v6/report-card-${stateCode}.png`,
        };
    }

    return null;
}


export async function onRequest(context) {
    const response = await context.next();
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("text/html")) {
        return response;
    }
    let html = await response.text();
    let url_preview_data = URL_PREVIEWS.default;

    const url = new URL(context.request.url);
    const pathPart = url.pathname.toLowerCase();

    if (pathPart === "/scorecard") {
        const scorecardPreview = getScorecardPreview(url);
        if (scorecardPreview) {
            url_preview_data = scorecardPreview;
        }
    } else if (["/fy26", "/fy2026"].includes(pathPart)) {
        url_preview_data = URL_PREVIEWS.fy26;
    } else if (["/fy27", "/fy2027"].includes(pathPart)) {
        url_preview_data = URL_PREVIEWS.fy27;
    }

    html = html.replace(/__TITLE__/g, url_preview_data.title);
    html = html.replace(/__DESCRIPTION__/g, url_preview_data.description);
    html = html.replace(/__PREVIEW_IMAGE__/g, url_preview_data.image);
    return new Response(html, {
        headers: response.headers,
    });
}
