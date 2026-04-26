import { api } from '@/lib/rpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CHATS_QUERY_KEY } from './use-chats';

interface RenameChatInput {
  id: string;
  title: string;
}

export function useRenameChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title }: RenameChatInput) => {
      const response = await api.chats[':id'].$patch({
        param: { id },
        json: { title },
      });

      if (!response.ok) {
        throw new Error('Failed to rename chat');
      }

      const data = await response.json();
      return data.chat;
    },
    onSuccess: (chat) => {
      queryClient.invalidateQueries({ queryKey: CHATS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['chats', chat.id] });
    },
  });
}
