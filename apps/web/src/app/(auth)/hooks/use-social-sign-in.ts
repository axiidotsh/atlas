import { signIn } from '@/lib/auth-client';
import { getAuthSuccessRedirect } from '@/lib/redirects';
import { getAuthErrorMessage } from '@/utils/auth-error';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

interface SignInSocialParams {
  provider: 'google';
}

export function useSignInSocial() {
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: async ({ provider }: SignInSocialParams) => {
      const result = await signIn.social({
        provider,
        callbackURL: getAuthSuccessRedirect(searchParams.get('callbackURL')),
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
