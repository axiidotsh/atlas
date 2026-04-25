import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { requestId } from 'hono/request-id';
import { secureHeaders } from 'hono/secure-headers';
import { auth } from './auth';
import { httpLogger } from './logger';
import { authRateLimiter } from './middleware/rate-limit';

export const app = new Hono().basePath('/api').use(
  '*',
  cors({
    origin: process.env.APP_URL!,
    credentials: true,
  }),
  secureHeaders(),
  requestId(),
  httpLogger()
);

export const router = app.on(['POST', 'GET'], '/auth/*', authRateLimiter, (c) =>
  auth.handler(c.req.raw)
);

export type AppType = typeof router;
