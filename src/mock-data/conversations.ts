import { MOCK_CHATS } from '@/mock-data/chats';
import { MOCK_STUDIO_PROJECTS } from '@/mock-data/studio-projects';
import type {
  MockConversation,
  MockStandardConversation,
  MockStudioConversation,
} from '@/mock-data/types';

export const MOCK_CONVERSATIONS: MockConversation[] = [
  ...MOCK_CHATS,
  ...MOCK_STUDIO_PROJECTS,
];

export function isStandardConversation(
  conversation: MockConversation
): conversation is MockStandardConversation {
  return conversation.type === 'standard';
}

export function isStudioConversation(
  conversation: MockConversation
): conversation is MockStudioConversation {
  return conversation.type === 'studio';
}

export function getConversation(conversationId: string) {
  return MOCK_CONVERSATIONS.find(
    (conversation) => conversation.id === conversationId
  );
}

export function getStandardConversation(conversationId: string) {
  const conversation = getConversation(conversationId);

  if (!conversation || !isStandardConversation(conversation)) {
    return undefined;
  }

  return conversation;
}

export function getStudioConversation(conversationId: string) {
  const conversation = getConversation(conversationId);

  if (!conversation || !isStudioConversation(conversation)) {
    return undefined;
  }

  return conversation;
}

export function getStandardConversations() {
  return MOCK_CONVERSATIONS.filter(isStandardConversation);
}

export function getStudioConversations() {
  return MOCK_CONVERSATIONS.filter(isStudioConversation);
}
