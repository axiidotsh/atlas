import { api } from '@/lib/rpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { CHATS_QUERY_KEY } from './use-chats';

export function useDeleteChat() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.chats[':id'].$delete({ param: { id } });

      if (!response.ok) {
        throw new Error('Failed to delete chat');
      }

      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: CHATS_QUERY_KEY });
      queryClient.removeQueries({ queryKey: ['chats', id] });

      if (pathname === `/chat/${id}`) {
        router.push('/chat');
      }
    },
  });
}
