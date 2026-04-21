'use client';

import { TokenUsage } from '@/app/(protected)/chat/components/token-usage';
import { studioQueryAtom } from '@/app/(protected)/studio/atoms';
import { ChatInput } from '@/components/chat/chat-input';
import { useFocusOnSlash } from '@/hooks/use-focus-on-slash';
import { MENTION_OPTIONS } from '@/mock-data/mention-data';
import { useAtom } from 'jotai';
import { type ReactNode, useRef } from 'react';
import { AspectRatioSelector } from './aspect-ratio/aspect-ratio-selector';

interface StudioComposerProps {
  caption?: ReactNode;
  placeholder?: string;
}

export const StudioComposer = ({
  caption,
  placeholder,
}: StudioComposerProps) => {
  const [query, setQuery] = useAtom(studioQueryAtom);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useFocusOnSlash(inputRef);

  return (
    <ChatInput
      value={query}
      onValueChange={setQuery}
      placeholder={placeholder}
      caption={caption}
      textareaRef={inputRef}
      mentionData={MENTION_OPTIONS}
      shouldShowAttachment
      leftActions={<AspectRatioSelector />}
      rightActions={<TokenUsage usedTokens={20} maxTokens={100} />}
    />
  );
};
