import { makeGenericAPIRouteHandler } from '@keystatic/core/api/generic';
import config from '../../keystatic.config';

export default {
  async fetch(request: Request, env: Record<string, string>): Promise<Response> {
    const keystaticApiHandler = makeGenericAPIRouteHandler({
      config,
      clientId: env.KEYSTATIC_GITHUB_CLIENT_ID,
      clientSecret: env.KEYSTATIC_GITHUB_CLIENT_SECRET,
      secret: env.KEYSTATIC_SECRET,
    });

    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/keystatic')) {
      const keystaticResponse = await keystaticApiHandler(request as any);

      return keystaticResponse as any as Response;
    }

    return new Response("Not found", { status: 404 });
  },
};
