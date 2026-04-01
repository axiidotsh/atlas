import { Conversation } from '@/app/(protected)/chat/[id]/components/conversation';
import { MOCK_CHATS } from '@/mock-data/chats';
import { notFound } from 'next/navigation';

interface ChatPageProps {
  params: Promise<{
    id: string;
  }>;
}

function getMockChat(chatId: string) {
  return MOCK_CHATS.find((chat) => chat.id === chatId);
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;
  const chat = getMockChat(id);

  if (!chat) {
    notFound();
  }

  return <Conversation messages={chat.messages} />;
}
