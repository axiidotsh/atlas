'use client';

import { queryAtom } from '@/app/(protected)/chat/atoms';
import { AdAccountSelector } from '@/app/(protected)/chat/components/adaccount-selector';
import { ModeSelector } from '@/app/(protected)/chat/components/mode-selector';
import { TokenUsage } from '@/app/(protected)/chat/components/token-usage';
import { ChatInput } from '@/components/chat-input';
import { usePathname } from 'next/navigation';
import { useAtom } from 'jotai';
import { ReactNode } from 'react';

interface ChatComposerProps {
  caption?: ReactNode;
  placeholder?: string;
}

export const ChatComposer = ({
  caption,
  placeholder,
}: ChatComposerProps) => {
  const [query, setQuery] = useAtom(queryAtom);
  const pathname = usePathname();
  const isChatDetailPage = /^\/chat\/[^/]+$/.test(pathname);

  return (
    <ChatInput
      value={query}
      onValueChange={setQuery}
      placeholder={placeholder}
      caption={isChatDetailPage ? undefined : caption}
      leftActions={
        <>
          <ModeSelector />
          <AdAccountSelector />
        </>
      }
      rightActions={<TokenUsage usedTokens={20} maxTokens={100} />}
    />
  );
};
