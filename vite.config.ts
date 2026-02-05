import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { makeGenericAPIRouteHandler } from '@keystatic/core/api/generic';
import keystaticConfig from './keystatic.config';

function keystaticPlugin(): Plugin {
  const handler = makeGenericAPIRouteHandler({
    config: keystaticConfig,
    localType: 'node-fs',
  } as any);

  return {
    name: 'keystatic-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && (req.url === '/api/keystatic' || req.url.startsWith('/api/keystatic/'))) {
          try {
            const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
            
            let body: any = null;
            if (req.method === 'POST') {
              const buffers = [];
              for await (const chunk of req) {
                buffers.push(chunk);
              }
              body = Buffer.concat(buffers);
            }

            const keystaticReq = {
              method: req.method || 'GET',
              url: url.toString(),
              headers: new Headers(req.headers as any),
              body,
              json: async () => JSON.parse(body?.toString() || '{}')
            };

            const result = await handler(keystaticReq as any);
            res.statusCode = result.status || 200;
            if (result.headers) {
              if (typeof (result.headers as any).forEach === 'function') {
                (result.headers as any).forEach((value: string, key: string) => {
                  res.setHeader(key, value);
                });
              } else {
                for (const [key, value] of Object.entries(result.headers)) {
                  res.setHeader(key, value as string);
                }
              }
            }
            
            res.end(result.body);
          } catch (e: any) {
            console.error('Keystatic API Error Detail:', e.message, e.stack);
            res.statusCode = 500;
            res.end(`API Error: ${e.message}`);
          }
          return;
        }
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const plugins = [react(), tailwindcss(), keystaticPlugin()];

  if (command === 'build' && process.env.SENTRY_ENABLED === 'true') {
    plugins.push(sentryVitePlugin({
      org: "scimap",
      project: "javascript-react"
    }));
  }

  return {
    plugins,
    server: {
      host: true,
      port: 5173,
      allowedHosts: ["robco.mammoth-atlas.ts.net"],
    },
    build: {
      sourcemap: true
    }
  };
});