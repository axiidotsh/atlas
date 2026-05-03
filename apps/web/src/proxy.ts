import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const SIGN_IN_PATH = '/sign-in';
const CHAT_PATH = '/chat';
const AUTH_SESSION_PATH = '/api/auth/get-session';
const AUTH_PATHS = [
  SIGN_IN_PATH,
  '/sign-up',
  '/forgot-password',
  '/reset-password',
] as const;

async function hasValidSession() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return false;
  }

  try {
    const sessionUrl = new URL(AUTH_SESSION_PATH, apiUrl);
    const response = await fetch(sessionUrl, {
      headers: await headers(),
    });

    if (!response.ok) {
      return false;
    }

    const session = await response.json();
    return Boolean(session);
  } catch {
    return false;
  }
}

function isAuthPath(pathname: string) {
  return AUTH_PATHS.some((path) => pathname === path);
}

function redirectToSignIn(request: NextRequest) {
  const redirectUrl = new URL(SIGN_IN_PATH, request.url);
  redirectUrl.searchParams.set(
    'callbackURL',
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  );

  return NextResponse.redirect(redirectUrl);
}

export async function proxy(request: NextRequest) {
  const isAuthenticated = await hasValidSession();
  const { pathname } = request.nextUrl;

  if (isAuthenticated && isAuthPath(pathname)) {
    return NextResponse.redirect(new URL(CHAT_PATH, request.url));
  }

  if (!isAuthenticated && !isAuthPath(pathname)) {
    return redirectToSignIn(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/forgot-password',
    '/reset-password',
    '/chat/:path*',
    '/metrics/:path*',
    '/reports/:path*',
    '/studio/:path*',
  ],
};
