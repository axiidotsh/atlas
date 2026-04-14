'use client';

import { studioQueryAtom } from '@/app/(protected)/studio/atoms';
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
import { type ReactNode, useRef } from 'react';
import { AspectRatioSelector } from './aspect-ratio-selector';

interface StudioComposerProps {
  caption?: ReactNode;
  placeholder?: string;
}

const MENTION_DATA = [
  ...MOCK_AD_ACCOUNTS.map((item) => ({ ...item, type: 'ad-account' })),
  ...MOCK_CAMPAIGNS.map((item) => ({ ...item, type: 'campaign' })),
  ...MOCK_AD_SETS.map((item) => ({ ...item, type: 'ad-set' })),
  ...MOCK_ADS.map((item) => ({ ...item, type: 'ad' })),
];

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
      mentionData={MENTION_DATA}
      shouldShowAttachment
      leftActions={<AspectRatioSelector />}
      rightActions={<TokenUsage usedTokens={20} maxTokens={100} />}
    />
  );
};
