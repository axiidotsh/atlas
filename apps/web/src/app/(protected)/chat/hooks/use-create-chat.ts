import { api } from '@/lib/rpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { CHATS_QUERY_KEY } from './use-chats';

export function useCreateChat() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.chats.$post();

      if (!response.ok) {
        throw new Error('Failed to create chat');
      }

      const data = await response.json();
      return data.chat;
    },
    onSuccess: (chat) => {
      queryClient.invalidateQueries({ queryKey: CHATS_QUERY_KEY });
      router.push(`/chat/${chat.id}`);
    },
  });
}
