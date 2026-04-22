import { describe, it, expect, vi } from 'vitest';
import { onRequest } from './_middleware.js';

const BASE_URL = "https://example.com";
const DEFAULT_HTML = `
<!DOCTYPE html>
<html>
<head>
    <title>__TITLE__</title>
    <meta name="description" content="__DESCRIPTION__">
    <meta property="og:image" content="__PREVIEW_IMAGE__">
</head>
<body>
    <h1>Hello World</h1>
</body>
</html>`;

const mockContext = (path, headers = { "content-type": "text/html" }) => ({
    request: {
        url: `${BASE_URL}${path}`
    },
    next: vi.fn().mockResolvedValue(new Response(DEFAULT_HTML, { headers })),
});


describe('Middleware', () => {
    it('should return default meta tags for the root path', async () => {
        const context = mockContext('/');
        const response = await onRequest(context);
        const html = await response.text();

        expect(html).toContain('<title>SCIMaP - Impacts of Federal Cuts to Science and Medical Research</title>');
        expect(html).toContain('<meta name="description" content="Developed by an interdisciplinary research team, this website shows how funding cuts reduce economic activity and employment nationwide">');
        expect(html).toContain('<meta property="og:image" content="https://data.scienceimpacts.org/FY27-preview.jpg">');

    });

    it('should return budget meta tags for the /fy26 path', async () => {
        const context = mockContext('/fy26');
        const response = await onRequest(context);
        const html = await response.text();

        expect(html).toContain('<title>SCIMaP - Impacts of Federal Cuts to Science and Medical Research</title>');
        expect(html).toContain('<meta name="description" content="View Projected Impact of the FY2026 Budget Cuts to the NIH">');
        expect(html).toContain('<meta property="og:image" content="https://data.scienceimpacts.org/FY26-preview.png">');
    });

    it('should return budget meta tags for the /fy2026 path', async () => {
        const context = mockContext('/fy2026');
        const response = await onRequest(context);
        const html = await response.text();

        expect(html).toContain('<title>SCIMaP - Impacts of Federal Cuts to Science and Medical Research</title>');
        expect(html).toContain('<meta name="description" content="View Projected Impact of the FY2026 Budget Cuts to the NIH">');
        expect(html).toContain('<meta property="og:image" content="https://data.scienceimpacts.org/FY26-preview.png">');
    });

    it('should return budget meta tags for the /fy27 path', async () => {
        const context = mockContext('/fy27');
        const response = await onRequest(context);
        const html = await response.text();

        expect(html).toContain('<title>SCIMaP - Impacts of Federal Cuts to Science and Medical Research</title>');
        expect(html).toContain('<meta name="description" content="View Projected Impact of the FY2027 Budget Cuts to the NIH and NSF">');
        expect(html).toContain('<meta property="og:image" content="https://data.scienceimpacts.org/FY27-preview.jpg">');
    });

    it('should return budget meta tags for the /fy2027 path', async () => {
        const context = mockContext('/fy2027');
        const response = await onRequest(context);
        const html = await response.text();

        expect(html).toContain('<title>SCIMaP - Impacts of Federal Cuts to Science and Medical Research</title>');
        expect(html).toContain('<meta name="description" content="View Projected Impact of the FY2027 Budget Cuts to the NIH and NSF">');
        expect(html).toContain('<meta property="og:image" content="https://data.scienceimpacts.org/FY27-preview.jpg">');
    });

    it('should return scorecard meta tags for a valid scorecard path', async () => {
        const context = mockContext('/scorecard?stateCode=CA&districtId=01');
        const response = await onRequest(context);
        const html = await response.text();

        expect(html).toContain('<title>SCIMaP - Fact Sheet</title>');
        expect(html).toContain('<meta name="description" content="FY26 Fact Sheet for CA-01">');
        expect(html).toContain('<meta property="og:image" content="https://data.scienceimpacts.org/report-cards-v6/report-card-CA-01.png">');
    });

    it('should handle at-large districts correctly', async () => {
        const context = mockContext('/scorecard?stateCode=AL&districtId=00');
        const response = await onRequest(context);
        const html = await response.text();

        expect(html).toContain('<title>SCIMaP - Fact Sheet</title>');
        expect(html).toContain('<meta name="description" content="FY26 Fact Sheet for AL-AL">');
        expect(html).toContain('<meta property="og:image" content="https://data.scienceimpacts.org/report-cards-v6/report-card-AL-00.png">');
    });

    it('should fall back to default meta tags for scorecard path without query params', async () => {
        const context = mockContext('/scorecard');
        const response = await onRequest(context);
        const html = await response.text();

        expect(html).toContain('<title>SCIMaP - Impacts of Federal Cuts to Science and Medical Research</title>');
        expect(html).toContain('<meta name="description" content="Developed by an interdisciplinary research team, this website shows how funding cuts reduce economic activity and employment nationwide">');
        expect(html).toContain('<meta property="og:image" content="https://data.scienceimpacts.org/FY27-preview.jpg">');
    });

    it('should not modify non-html responses', async () => {
        const context = mockContext('/data.json', { "content-type": "application/json" });
        const response = await onRequest(context);
        const text = await response.text();
        expect(text).toBe(DEFAULT_HTML);
    });

    it('should not modify other parts of the html', async () => {
        const context = mockContext('/');
        const response = await onRequest(context);
        const html = await response.text();
        expect(html).toContain('<h1>Hello World</h1>');
    });

});
