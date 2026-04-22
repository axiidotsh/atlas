'use client';

import { queryAtom } from '@/app/(protected)/chat/atoms';
import { TokenUsage } from '@/app/(protected)/chat/components/token-usage';
import { ChatInput, EditorHandle } from '@/components/chat/chat-input';
import { useFocusOnSlash } from '@/hooks/use-focus-on-slash';
import { MOCK_AD_ACCOUNTS } from '@/mock-data/ad-data';
import { MENTION_OPTIONS } from '@/mock-data/mention-data';
import { useAtom } from 'jotai';
import { usePathname } from 'next/navigation';
import { ReactNode, useRef, useState } from 'react';
import { AdAccountSelector } from './ad-account-selector';
import { ModeSelector } from './mode-selector';

interface ChatComposerProps {
  caption?: ReactNode;
  placeholder?: string;
}

export const ChatComposer = ({ caption, placeholder }: ChatComposerProps) => {
  const [query, setQuery] = useAtom(queryAtom);
  const [selectedAdAccountIds, setSelectedAdAccountIds] = useState<string[]>(
    MOCK_AD_ACCOUNTS.map((adAccount) => adAccount.id)
  );
  const pathname = usePathname();

  const isChatDetailPage = /^\/chat\/[^/]+$/.test(pathname);
  const inputRef = useRef<EditorHandle>(null);

  useFocusOnSlash(inputRef);

  function handleSubmit() {
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }
    console.log('[chat] submit', trimmed);
    setQuery('');
  }

  return (
    <ChatInput
      value={query}
      onValueChange={setQuery}
      onSubmit={handleSubmit}
      placeholder={placeholder}
      caption={isChatDetailPage ? undefined : caption}
      editorRef={inputRef}
      mentionData={MENTION_OPTIONS}
      leftActions={
        <>
          <ModeSelector />
          <AdAccountSelector
            selectedAdAccountIds={selectedAdAccountIds}
            onSelectedAdAccountIdsChange={setSelectedAdAccountIds}
            variant="ghost"
          />
        </>
      }
      rightActions={<TokenUsage usedTokens={20} maxTokens={100} />}
    />
  );
};
