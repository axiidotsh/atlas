'use client';

import { studioQueryAtom } from '@/app/(protected)/studio/atoms';
import { TokenUsage } from '@/app/(protected)/chat/components/token-usage';
import { ChatInput } from '@/components/chat-input';
import { useFocusOnSlash } from '@/hooks/use-focus-on-slash';
import { useAtom } from 'jotai';
import { type ReactNode, useRef } from 'react';
import { AspectRatioSelector } from './aspect-ratio-selector';

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
      leftActions={<AspectRatioSelector />}
      shouldShowAttachment
      textareaRef={inputRef}
      rightActions={<TokenUsage usedTokens={20} maxTokens={100} />}
    />
  );
};
