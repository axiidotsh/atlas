'use client';

import { useChat } from '@/app/(protected)/chat/hooks/use-chat';
import { Conversation } from '@/components/chat/conversation';
import { Skeleton } from '@/components/ui/skeleton';
import { useParams } from 'next/navigation';

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const { data: chat, isLoading, isError } = useChat(id);

  if (isLoading) {
    return (
      <div className="space-y-8 py-8">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="ml-auto h-12 w-2/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isError || !chat) {
    return (
      <div className="text-muted-foreground py-16 text-center text-sm">
        Chat not found
      </div>
    );
  }

  return <Conversation messages={chat.messages} />;
}
