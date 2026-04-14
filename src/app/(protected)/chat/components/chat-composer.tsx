'use client';

import { queryAtom } from '@/app/(protected)/chat/atoms';
import { Button } from '@/components/ui/button';
import { Mention, MentionInput, MentionItem } from '@/components/ui/mention';
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
import { Fragment, ReactNode, useRef, useState } from 'react';
import { AdAccountSelector } from './ad-account-selector';
import { ModeSelector } from './mode-selector';
import { TokenUsage } from './token-usage';

interface ChatComposerProps {
  caption?: ReactNode;
  placeholder?: string;
}

export const ChatComposer = ({ caption, placeholder }: ChatComposerProps) => {
  const [query, setQuery] = useAtom(queryAtom);
  const [selectedAdAccountIds, setSelectedAdAccountIds] = useState<string[]>(
    MOCK_AD_ACCOUNTS.map((adAccount) => adAccount.id)
  );
  const [mentionOpen, setMentionOpen] = useState(false);
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
      open={mentionOpen}
      onOpenChange={setMentionOpen}
    >
      <div className="flex w-full flex-col gap-3">
        {!isChatDetailPage && (
          <span className="text-muted-foreground text-center text-xs">
            {caption}
          </span>
        )}
        <div className="relative">
          {mentionOpen && (
            <div className="bg-popover border-primary/20 dark:border-primary/10 = absolute inset-x-0 bottom-full z-50 mx-auto w-11/12 rounded-t-xl border border-b-0">
              <ScrollArea>
                <div className="max-h-60 p-1">
                  {data.map((item, i) => {
                    const isLastItem = i === data.length - 1;

                    return (
                      <Fragment key={item.id}>
                        <MentionItem
                          label={getMentionLabel(item)}
                          value={item.name + item.id}
                          className="cursor-pointer rounded-md px-2.5 py-2"
                        >
                          <span className="truncate text-sm">{item.name}</span>
                          <span className="text-muted-foreground ml-auto shrink-0 rounded-sm bg-transparent px-1.5 py-0.5 text-[11px] leading-none">
                            {formatType(item.type)}
                          </span>
                        </MentionItem>
                        {isLastItem && <div className="h-1 w-full" />}
                      </Fragment>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
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
                  <AdAccountSelector
                    selectedAdAccountIds={selectedAdAccountIds}
                    onSelectedAdAccountIdsChange={setSelectedAdAccountIds}
                    variant="ghost"
                  />
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
      </div>
    </Mention>
  );
};
