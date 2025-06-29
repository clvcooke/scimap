export async function onRequest(context) {
    // Get the original response by continuing the middleware chain
    const response = await context.next();
    const url = new URL(context.request.url);

    // Only modify the HTML for the root path "/"
    if (url.pathname !== '/') {
        return response;
    }

    // Ensure we are only modifying HTML responses
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("text/html")) {
        return response;
    }

    // Get the current time
    const currentTime = new Date().toISOString();

    // Read the original HTML response
    let html = await response.text();

    // Replace the placeholder with the current time
    html = html.replace('__OG_DESCRIPTION__', `Page generated at: ${currentTime}`);

    // Return a new response with the modified HTML
    return new Response(html, {
        headers: response.headers,
    });
}