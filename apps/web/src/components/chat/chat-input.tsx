'use client';

import { Button } from '@/components/ui/button';
import { Mention, MentionInput, MentionItem } from '@/components/ui/mention';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUpIcon, PaperclipIcon } from 'lucide-react';
import { Fragment, ReactNode, Ref, useState } from 'react';

export interface MentionOption {
  id: string;
  label: string;
  searchValue: string;
  content: ReactNode;
}

interface ChatInputProps {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  caption?: ReactNode;
  leftActions?: ReactNode;
  rightActions?: ReactNode;
  shouldShowAttachment?: boolean;
  textareaRef?: Ref<HTMLTextAreaElement>;
  mentionData?: MentionOption[];
  mentionTrigger?: string;
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
  textareaRef,
  mentionData,
  mentionTrigger = '@',
}: ChatInputProps) => {
  const [mentionOpen, setMentionOpen] = useState(false);
  const hasMentions = mentionData && mentionData.length > 0;

  const textarea = (
    <Textarea
      autoFocus
      ref={textareaRef}
      value={value}
      onChange={hasMentions ? undefined : (e) => onValueChange(e.target.value)}
      placeholder={placeholder || 'Ask me anything'}
      className="h-20 resize-none border-0 bg-transparent! shadow-none ring-0!"
    />
  );

  const mentionDropdown = hasMentions && mentionOpen && (
    <div className="bg-popover border-primary/20 dark:border-primary/10 absolute inset-x-0 bottom-full z-50 mx-auto w-11/12 rounded-t-xl border border-b-0">
      <ScrollArea>
        <div className="max-h-60 p-1">
          {mentionData.map((item, i) => {
            const isLastItem = i === mentionData.length - 1;
            return (
              <Fragment key={item.id}>
                <MentionItem
                  label={item.label}
                  value={item.searchValue}
                  className="cursor-pointer rounded-md px-2.5 py-2"
                >
                  {item.content}
                </MentionItem>
                {isLastItem && <div className="h-1 w-full" />}
              </Fragment>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );

  const inputArea = (
    <div className="bg-chat-input-border rounded-t-[1.25rem] p-1.5 pb-0">
      <div className="bg-background border-primary/20 dark:border-primary/10 flex flex-col gap-2 rounded-t-2xl border border-b-0 p-1">
        {hasMentions ? (
          <MentionInput asChild>{textarea}</MentionInput>
        ) : (
          textarea
        )}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center">
            {shouldShowAttachment && (
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground"
              >
                <PaperclipIcon />
              </Button>
            )}
            {leftActions}
          </div>
          <div className="flex items-center gap-3">
            {rightActions}
            <Button aria-label="Send message" size="icon-sm" onClick={onSubmit}>
              <ArrowUpIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const content = (
    <div className="flex w-full flex-col gap-3">
      {caption && (
        <span className="text-muted-foreground text-center text-xs">
          {caption}
        </span>
      )}
      {hasMentions ? (
        <div className="relative">
          {mentionDropdown}
          {inputArea}
        </div>
      ) : (
        inputArea
      )}
    </div>
  );

  if (hasMentions) {
    return (
      <Mention
        trigger={mentionTrigger}
        className="w-full"
        inputValue={value}
        onInputValueChange={onValueChange}
        open={mentionOpen}
        onOpenChange={setMentionOpen}
      >
        {content}
      </Mention>
    );
  }

  return content;
};
