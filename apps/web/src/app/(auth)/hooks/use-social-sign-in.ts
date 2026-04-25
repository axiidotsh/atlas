import { signIn } from '@/lib/auth-client';
import { AUTH_SUCCESS_REDIRECT } from '@/lib/redirects';
import { getAuthErrorMessage } from '@/utils/auth-error';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface SignInSocialParams {
  provider: 'google';
}

export function useSignInSocial() {
  return useMutation({
    mutationFn: async ({ provider }: SignInSocialParams) => {
      const result = await signIn.social({
        provider,
        callbackURL: AUTH_SUCCESS_REDIRECT,
      });

      if (result.error) {
        const errorMessage = getAuthErrorMessage(result.error);
        throw new Error(errorMessage);
      }

      return result.data;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
