'use client';

import { studioQueryAtom } from '@/app/(protected)/studio/atoms';
import { ChatInput, EditorHandle } from '@/components/chat/chat-input';
import { TokenUsage } from '@/components/token-usage';
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
  const inputRef = useRef<EditorHandle>(null);

  useFocusOnSlash(inputRef);

  function handleSubmit() {
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }
    console.log('[studio] submit', trimmed);
    setQuery('');
  }

  return (
    <ChatInput
      value={query}
      onValueChange={setQuery}
      onSubmit={handleSubmit}
      placeholder={placeholder}
      caption={caption}
      editorRef={inputRef}
      mentionData={MENTION_OPTIONS}
      shouldShowAttachment
      leftActions={<AspectRatioSelector />}
      rightActions={<TokenUsage usedTokens={20} maxTokens={100} />}
    />
  );
};
