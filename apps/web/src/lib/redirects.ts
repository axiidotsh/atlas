const ROUTES = {
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  CHAT: '/chat',
} as const;

function constructRedirectUrl(path: string) {
  return process.env.NEXT_PUBLIC_APP_URL! + path;
}

function getSafeCallbackPath(callbackURL: string | null) {
  if (!callbackURL) {
    return ROUTES.CHAT;
  }

  try {
    const appUrl = new URL(process.env.NEXT_PUBLIC_APP_URL!);
    const redirectUrl = new URL(callbackURL, appUrl);
    const authPaths = [
      ROUTES.SIGN_IN,
      ROUTES.SIGN_UP,
      ROUTES.FORGOT_PASSWORD,
      ROUTES.RESET_PASSWORD,
    ];

    if (redirectUrl.origin !== appUrl.origin) {
      return ROUTES.CHAT;
    }

    if (
      authPaths.includes(redirectUrl.pathname as (typeof authPaths)[number])
    ) {
      return ROUTES.CHAT;
    }

    return `${redirectUrl.pathname}${redirectUrl.search}${redirectUrl.hash}`;
  } catch {
    return ROUTES.CHAT;
  }
}

export function getAuthSuccessRedirect(callbackURL: string | null) {
  return constructRedirectUrl(getSafeCallbackPath(callbackURL));
}

export function getAuthSuccessPath(callbackURL: string | null) {
  return getSafeCallbackPath(callbackURL);
}

export const AUTH_SUCCESS_REDIRECT = constructRedirectUrl(ROUTES.CHAT);
export const AUTH_FAILURE_REDIRECT = constructRedirectUrl(ROUTES.SIGN_IN);
export const PASSWORD_RESET_REDIRECT = constructRedirectUrl(ROUTES.SIGN_IN);
export const PASSWORD_RESET_PAGE_REDIRECT = constructRedirectUrl(
  ROUTES.RESET_PASSWORD
);
export const NOT_FOUND_REDIRECT = constructRedirectUrl(ROUTES.CHAT);
