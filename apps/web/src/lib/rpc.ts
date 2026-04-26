import type { AppType } from '@atlas/api/app';
import { hc } from 'hono/client';

const client = hc<AppType>(process.env.NEXT_PUBLIC_API_URL!, {
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, { ...init, credentials: 'include' }),
});
export const api = client.api;
