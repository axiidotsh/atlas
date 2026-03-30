'use client';

import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import { Textarea } from '@/components/ui/textarea';
import { useAtom } from 'jotai';
import { ArrowUpIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { queryAtom } from '../atoms';
import { AdAccountSelector } from './adaccount-selector';
import { ModeSelector } from './mode-selector';
import { TokenUsage } from './token-usage';

export const ChatInput = () => {
  const [query, setQuery] = useAtom(queryAtom);
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-3">
      {pathname === '/chat' && (
        <span className="text-muted-foreground text-center text-xs">
          Use <Kbd className="bg-accent/50">@</Kbd> to tag specific ad accounts,
          campaigns, ad sets and ads
        </span>
      )}
      <div className="dark:border-accent/30 border-accent bg-muted/10 flex flex-col gap-2 rounded-t-2xl border-6 border-b-0 p-1">
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask me anything"
          className="h-20 w-2xl resize-none border-0 bg-transparent! shadow-none ring-0!"
        />
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center">
            <ModeSelector />
            <AdAccountSelector />
          </div>
          <div className="flex items-center gap-2">
            <TokenUsage usedTokens={20} maxTokens={100} />
            <Button aria-label="Send message" size="icon-sm">
              <ArrowUpIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
