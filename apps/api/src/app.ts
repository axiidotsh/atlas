import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { requestId } from 'hono/request-id';
import { secureHeaders } from 'hono/secure-headers';
import { auth } from './auth';
import { httpLogger } from './logger';
import { apiRateLimiter, authRateLimiter } from './middleware/rate-limit';
import { chatRouter } from './routers/chat-router';

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

export const router = app
  .on(['POST', 'GET'], '/auth/*', authRateLimiter, (c) =>
    auth.handler(c.req.raw)
  )
  .use('/chats/*', apiRateLimiter)
  .route('/chats', chatRouter);

export type AppType = typeof router;
