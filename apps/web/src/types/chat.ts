export type ChatMessageRole = 'USER' | 'ASSISTANT';

export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  content: string;
}
