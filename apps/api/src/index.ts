import { serve } from '@hono/node-server';
import { app } from './app';
import './env';
import { logger } from './logger';

const DEFAULT_PORT = 8080;
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
