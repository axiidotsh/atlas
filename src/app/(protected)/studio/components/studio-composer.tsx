'use client';

import { studioQueryAtom } from '@/app/(protected)/studio/atoms';
import { TokenUsage } from '@/app/(protected)/chat/components/token-usage';
import { ChatInput } from '@/components/chat-input';
import { useAtom } from 'jotai';
import { ReactNode } from 'react';

interface StudioComposerProps {
  caption?: ReactNode;
  placeholder?: string;
}

export const StudioComposer = ({
  caption,
  placeholder,
}: StudioComposerProps) => {
  const [query, setQuery] = useAtom(studioQueryAtom);

  return (
    <ChatInput
      value={query}
      onValueChange={setQuery}
      placeholder={placeholder}
      caption={caption}
      shouldShowAttachment
      rightActions={<TokenUsage usedTokens={20} maxTokens={100} />}
    />
  );
};
