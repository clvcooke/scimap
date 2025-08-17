import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const plugins = [react(), tailwindcss()];

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
      allowedHosts: ["robco.mammoth-atlas.ts.net"]
    },
    build: {
      sourcemap: true
    }
  };
});