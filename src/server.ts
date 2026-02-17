import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
    etag: false,
    lastModified: false,
    setHeaders: (res, path) => {
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-store');
      }
    },
  })
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.get('*', (req, res, next) => {
  const hostname = req.get('host') || '';

  // Establecer el hostname en globalThis para que Angular SSR pueda accederlo (opcional)
  (globalThis as unknown as { __SSR_HOSTNAME__?: string }).__SSR_HOSTNAME__ = hostname;

  angularApp
    .handle(req)
    .then((response) => {
      delete (globalThis as unknown as { __SSR_HOSTNAME__?: string }).__SSR_HOSTNAME__;
      return response ? writeResponseToNodeResponse(response, res) : next();
    })
    .catch((error) => {
      delete (globalThis as unknown as { __SSR_HOSTNAME__?: string }).__SSR_HOSTNAME__;
      console.error('SSR Error:', error);
      next(error);
    });
});

/**
 * Start the server if this module is the main entry point.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);
