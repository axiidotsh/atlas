import { Message } from '@/app/(protected)/chat/[id]/components/message';
import type { MockChatMessage } from '@/mock-data/types';

interface ChatFlowProps {
  messages: MockChatMessage[];
}

export const Conversation = ({ messages }: ChatFlowProps) => {
  return (
    <div className="space-y-8 py-8">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
};
