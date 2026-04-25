import { signUp } from '@/lib/auth-client';
import { getAuthErrorMessage } from '@/utils/auth-error';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface SignUpEmailParams {
  name: string;
  email: string;
  password: string;
}

export function useSignUpEmail() {
  return useMutation({
    mutationFn: async ({ name, email, password }: SignUpEmailParams) => {
      const result = await signUp.email({
        name,
        email,
        password,
      });

      if (result.error) {
        const errorMessage = getAuthErrorMessage(result.error);
        throw new Error(errorMessage);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success('Account created! Please check your email to verify.');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
