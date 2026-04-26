import { api } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';

export function chatQueryKey(id: string) {
  return ['chats', id] as const;
}

export function useChat(id: string) {
  return useQuery({
    queryKey: chatQueryKey(id),
    queryFn: async () => {
      const response = await api.chats[':id'].$get({ param: { id } });

      if (!response.ok) {
        throw new Error('Failed to fetch chat');
      }

      const data = await response.json();
      return data.chat;
    },
    enabled: Boolean(id),
  });
}
