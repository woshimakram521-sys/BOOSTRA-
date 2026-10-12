import type { Plugin } from 'vite';
import { createApiApp } from './app';

export function boostaraApiPlugin(): Plugin {
  return {
    name: 'boostara-api-plugin',
    configureServer(server) {
      const app = createApiApp();
      // Mount the express app on the vite dev server middlewares
      server.middlewares.use(app);
    },
  };
}
