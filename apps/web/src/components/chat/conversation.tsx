import type { ChatMessage } from '@/types/chat';
import { Message } from './message';

interface ChatFlowProps {
  messages: ChatMessage[];
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
