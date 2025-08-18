/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config'
import { mergeConfig } from 'vite'

const resolvedViteConfig = typeof viteConfig === 'function'
  ? viteConfig({ command: 'serve', mode: 'test' })
  : viteConfig;

export default mergeConfig(resolvedViteConfig, defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
}))
