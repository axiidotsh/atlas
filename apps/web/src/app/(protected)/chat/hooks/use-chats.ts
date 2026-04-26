import { api } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';

export const CHATS_QUERY_KEY = ['chats'] as const;

export function useChats() {
  return useQuery({
    queryKey: CHATS_QUERY_KEY,
    queryFn: async () => {
      const response = await api.chats.$get();

      if (!response.ok) {
        throw new Error('Failed to fetch chats');
      }

      const data = await response.json();
      return data.chats;
    },
  });
}
