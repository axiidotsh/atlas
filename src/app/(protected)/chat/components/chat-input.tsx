'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAtom } from 'jotai';
import { ArrowUpIcon, PaperclipIcon } from 'lucide-react';
import { ReactNode } from 'react';
import { queryAtom } from '../atoms';
import { AdAccountSelector } from './adaccount-selector';
import { ModeSelector } from './mode-selector';
import { TokenUsage } from './token-usage';

interface ConfigProps {
  modeSelector: boolean;
  adaccountSelector: boolean;
  tokenCounter: boolean;
  attachment: boolean;
}

interface ChatInputProps {
  placeholder?: string;
  caption?: ReactNode;
  config?: ConfigProps;
}

export const ChatInput = ({
  placeholder,
  caption,
  config = {
    modeSelector: true,
    adaccountSelector: true,
    tokenCounter: true,
    attachment: true,
  },
}: ChatInputProps) => {
  const [query, setQuery] = useAtom(queryAtom);

  return (
    <div className="flex w-full flex-col gap-3">
      {caption && (
        <span className="text-muted-foreground text-center text-xs">
          {caption}
        </span>
      )}
      <div className="bg-accent dark:bg-accent/30 rounded-t-[1.25rem] p-1.5 pb-0">
        <div className="bg-background border-primary/20 dark:border-primary/10 flex flex-col gap-2 rounded-t-2xl border border-b-0 p-1">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder || 'Ask me anything'}
            className="h-20 resize-none border-0 bg-transparent! shadow-none ring-0!"
          />
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center">
              {config.modeSelector && <ModeSelector />}
              {!config.modeSelector && config.attachment && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground"
                >
                  <PaperclipIcon />
                </Button>
              )}
              {config.adaccountSelector && <AdAccountSelector />}
            </div>
            <div className="flex items-center gap-3">
              {config.tokenCounter && (
                <TokenUsage usedTokens={20} maxTokens={100} />
              )}
              <Button aria-label="Send message" size="icon-sm">
                <ArrowUpIcon />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
