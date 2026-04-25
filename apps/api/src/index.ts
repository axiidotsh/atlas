import { serve } from '@hono/node-server';
import './env';

const DEFAULT_PORT = 8080;

async function startApi() {
  const [{ app }, { logger }] = await Promise.all([
    import('./app'),
    import('./logger'),
  ]);
  const parsedPort = Number.parseInt(process.env.PORT ?? '', 10);
  const port = Number.isNaN(parsedPort) ? DEFAULT_PORT : parsedPort;

  serve(
    {
      fetch: app.fetch,
      port,
    },
    (info) => {
      logger.info(`API listening on http://localhost:${info.port}`);
    }
  );
}

void startApi();
