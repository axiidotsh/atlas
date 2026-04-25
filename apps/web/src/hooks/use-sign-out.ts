import { signOut } from '@/lib/auth-client';
import { AUTH_FAILURE_REDIRECT } from '@/lib/redirects';
import { getAuthErrorMessage } from '@/utils/auth-error';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useSignOut() {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const result = await signOut();

      if (result.error) {
        const errorMessage = getAuthErrorMessage(
          result.error,
          'Unable to sign out. Please try again.'
        );
        throw new Error(errorMessage);
      }

      return result.data;
    },
    onSuccess: () => {
      router.push(AUTH_FAILURE_REDIRECT);
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
