'use client';

import { queryAtom } from '@/app/(protected)/chat/atoms';
import { TokenUsage } from '@/app/(protected)/chat/components/token-usage';
import { ChatInput } from '@/components/chat-input';
import { useFocusOnSlash } from '@/hooks/use-focus-on-slash';
import {
  MOCK_AD_ACCOUNTS,
  MOCK_AD_SETS,
  MOCK_ADS,
  MOCK_CAMPAIGNS,
} from '@/mock-data/ad-data';
import { useAtom } from 'jotai';
import { usePathname } from 'next/navigation';
import { ReactNode, useRef, useState } from 'react';
import { AdAccountSelector } from './ad-account-selector';
import { ModeSelector } from './mode-selector';

interface ChatComposerProps {
  caption?: ReactNode;
  placeholder?: string;
}

const MENTION_DATA = [
  ...MOCK_AD_ACCOUNTS.map((item) => ({ ...item, type: 'ad-account' })),
  ...MOCK_CAMPAIGNS.map((item) => ({ ...item, type: 'campaign' })),
  ...MOCK_AD_SETS.map((item) => ({ ...item, type: 'ad-set' })),
  ...MOCK_ADS.map((item) => ({ ...item, type: 'ad' })),
];

export const ChatComposer = ({ caption, placeholder }: ChatComposerProps) => {
  const [query, setQuery] = useAtom(queryAtom);
  const [selectedAdAccountIds, setSelectedAdAccountIds] = useState<string[]>(
    MOCK_AD_ACCOUNTS.map((adAccount) => adAccount.id)
  );
  const pathname = usePathname();

  const isChatDetailPage = /^\/chat\/[^/]+$/.test(pathname);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useFocusOnSlash(inputRef);

  return (
    <ChatInput
      value={query}
      onValueChange={setQuery}
      placeholder={placeholder}
      caption={isChatDetailPage ? undefined : caption}
      textareaRef={inputRef}
      mentionData={MENTION_DATA}
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
