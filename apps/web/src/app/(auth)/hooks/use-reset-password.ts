import { resetPassword } from '@/lib/auth-client';
import { PASSWORD_RESET_REDIRECT } from '@/lib/redirects';
import { getAuthErrorMessage } from '@/utils/auth-error';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ResetPasswordParams {
  newPassword: string;
  token: string;
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ newPassword, token }: ResetPasswordParams) => {
      const result = await resetPassword({
        newPassword,
        token,
      });

      if (result.error) {
        const errorMessage = getAuthErrorMessage(result.error);
        throw new Error(errorMessage);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success('Password reset successfully');
      router.push(PASSWORD_RESET_REDIRECT);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
