'use client';

import { queryAtom } from '@/app/(protected)/chat/atoms';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Mention,
  MentionContent,
  MentionInput,
  MentionItem,
} from '@/components/ui/mention';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useFocusOnSlash } from '@/hooks/use-focus-on-slash';
import {
  MOCK_AD_ACCOUNTS,
  MOCK_AD_SETS,
  MOCK_ADS,
  MOCK_CAMPAIGNS,
} from '@/mock-data/ad-data';
import { useAtom } from 'jotai';
import { ArrowUpIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ReactNode, useRef } from 'react';
import { AdAccountSelector } from './adaccount-selector';
import { ModeSelector } from './mode-selector';
import { TokenUsage } from './token-usage';

interface ChatComposerProps {
  caption?: ReactNode;
  placeholder?: string;
}

export const ChatComposer = ({ caption, placeholder }: ChatComposerProps) => {
  const [query, setQuery] = useAtom(queryAtom);
  const pathname = usePathname();
  const isChatDetailPage = /^\/chat\/[^/]+$/.test(pathname);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useFocusOnSlash(inputRef);

  const data = [
    ...MOCK_AD_ACCOUNTS.map((item) => ({ ...item, type: 'ad-account' })),
    ...MOCK_CAMPAIGNS.map((item) => ({ ...item, type: 'campaign' })),
    ...MOCK_AD_SETS.map((item) => ({ ...item, type: 'ad-set' })),
    ...MOCK_ADS.map((item) => ({ ...item, type: 'ad' })),
  ];

  function formatType(value: string) {
    return value
      .split('-')
      .map((item) => item[0].toUpperCase().concat(item.substring(1)))
      .join(' ');
  }

  function getMentionLabel(item: { id: string; name: string; type: string }) {
    return `${item.name} [${item.id}] (${item.type})`;
  }

  return (
    <Mention
      trigger="@"
      className="w-full"
      inputValue={query}
      onInputValueChange={(value) => setQuery(value)}
    >
      <div className="flex w-full flex-col gap-3">
        {!isChatDetailPage && (
          <span className="text-muted-foreground text-center text-xs">
            {caption}
          </span>
        )}
        <div className="bg-chat-input-border rounded-t-[1.25rem] p-1.5 pb-0">
          <div className="bg-background border-primary/20 dark:border-primary/10 flex flex-col gap-2 rounded-t-2xl border border-b-0 p-1">
            <MentionInput asChild>
              <Textarea
                autoFocus
                ref={inputRef}
                placeholder={placeholder || 'Ask me anything'}
                value={query}
                className="h-20 resize-none border-0 bg-transparent! shadow-none ring-0!"
              />
            </MentionInput>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center">
                <ModeSelector />
                <AdAccountSelector />
              </div>
              <div className="flex items-center gap-3">
                <TokenUsage usedTokens={20} maxTokens={100} />
                <Button
                  aria-label="Send message"
                  size="icon-sm"
                  onClick={() => {}}
                >
                  <ArrowUpIcon />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MentionContent align="start" strategy="fixed">
        <ScrollArea>
          <div className="max-h-80">
            {data.map((item) => (
              <MentionItem
                key={item.id}
                label={getMentionLabel(item)}
                value={item.name + item.id}
                className="max-w-160 cursor-pointer"
              >
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="line-clamp-1 text-sm">{item.name}</span>
                    <Badge className="dark:bg-primary/50">
                      {formatType(item.type)}
                    </Badge>
                  </div>
                  <span className="text-muted-foreground truncate text-xs">
                    {item.id}
                  </span>
                </div>
              </MentionItem>
            ))}
          </div>
        </ScrollArea>
      </MentionContent>
    </Mention>
  );
};
