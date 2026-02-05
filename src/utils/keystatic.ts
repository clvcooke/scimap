import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

// Note: createReader with 'local' storage requires 'fs' which only works in Node.js (or during build time).
// For a Vite client-side app, we might need a different approach for production.
// But for development/PoC, we can use it if we are in a Node environment (like Vitest).

export const getReader = () => {
  return createReader(process.cwd(), keystaticConfig);
};
