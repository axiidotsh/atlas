import { Conversation } from '@/components/conversation';
import { getStandardConversation } from '@/mock-data/conversations';
import { notFound } from 'next/navigation';

interface ChatPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;
  const chat = getStandardConversation(id);

  if (!chat) {
    notFound();
  }

  return <Conversation messages={chat.messages} />;
}
