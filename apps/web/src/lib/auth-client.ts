import { adminClient, lastLoginMethodClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  plugins: [lastLoginMethodClient(), adminClient()],
});

export const {
  signIn,
  signUp,
  signOut,
  requestPasswordReset,
  resetPassword,
  useSession,
  isLastUsedLoginMethod,
} = authClient;
