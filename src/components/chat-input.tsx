'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUpIcon, PaperclipIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface ChatInputProps {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  caption?: ReactNode;
  leftActions?: ReactNode;
  rightActions?: ReactNode;
  shouldShowAttachment?: boolean;
}

export const ChatInput = ({
  value,
  onValueChange,
  onSubmit,
  placeholder,
  caption,
  leftActions,
  rightActions,
  shouldShowAttachment = false,
}: ChatInputProps) => {
  return (
    <div className="flex w-full flex-col gap-3">
      {caption && (
        <span className="text-muted-foreground text-center text-xs">
          {caption}
        </span>
      )}
      <div className="bg-chat-input-border rounded-t-[1.25rem] p-1.5 pb-0">
        <div className="bg-background border-primary/20 dark:border-primary/10 flex flex-col gap-2 rounded-t-2xl border border-b-0 p-1">
          <Textarea
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder={placeholder || 'Ask me anything'}
            className="h-20 resize-none border-0 bg-transparent! shadow-none ring-0!"
          />
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center">
              {leftActions}
              {shouldShowAttachment && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground"
                >
                  <PaperclipIcon />
                </Button>
              )}
            </div>
            <div className="flex items-center gap-3">
              {rightActions}
              <Button
                aria-label="Send message"
                size="icon-sm"
                onClick={onSubmit}
              >
                <ArrowUpIcon />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
