import { requestPasswordReset } from '@/lib/auth-client';
import { PASSWORD_RESET_PAGE_REDIRECT } from '@/lib/redirects';
import { getAuthErrorMessage } from '@/utils/auth-error';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface RequestPasswordResetParams {
  email: string;
}

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: async ({ email }: RequestPasswordResetParams) => {
      const result = await requestPasswordReset({
        email,
        redirectTo: PASSWORD_RESET_PAGE_REDIRECT,
      });

      if (result.error) {
        const errorMessage = getAuthErrorMessage(result.error);
        throw new Error(errorMessage);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success('Password reset link sent to your email.');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
