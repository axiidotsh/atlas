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

export const AUTH_SUCCESS_REDIRECT = constructRedirectUrl(ROUTES.CHAT);
export const AUTH_FAILURE_REDIRECT = constructRedirectUrl(ROUTES.SIGN_IN);
export const PASSWORD_RESET_REDIRECT = constructRedirectUrl(ROUTES.SIGN_IN);
export const PASSWORD_RESET_PAGE_REDIRECT = constructRedirectUrl(
  ROUTES.RESET_PASSWORD
);
export const NOT_FOUND_REDIRECT = constructRedirectUrl(ROUTES.CHAT);
