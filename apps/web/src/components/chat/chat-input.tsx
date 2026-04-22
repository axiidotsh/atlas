'use client';

import type { MentionPickerOption } from '@/components/chat/editor/mentions-plugin';
import {
  EditorHandle,
  RichTextEditor,
} from '@/components/chat/editor/rich-text-editor';
import { Button } from '@/components/ui/button';
import { ArrowUpIcon, PaperclipIcon } from 'lucide-react';
import { ReactNode, Ref, useRef } from 'react';

export type { MentionPickerOption as MentionOption } from '@/components/chat/editor/mentions-plugin';
export type { EditorHandle } from '@/components/chat/editor/rich-text-editor';

interface ChatInputProps {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  caption?: ReactNode;
  leftActions?: ReactNode;
  rightActions?: ReactNode;
  shouldShowAttachment?: boolean;
  editorRef?: Ref<EditorHandle>;
  mentionData?: MentionPickerOption[];
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
  editorRef,
  mentionData,
  mentionTrigger = '@',
}: ChatInputProps) => {
  const menuContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex w-full flex-col gap-3">
      {caption && (
        <span className="text-muted-foreground text-center text-xs">
          {caption}
        </span>
      )}
      <div ref={menuContainerRef} className="relative">
        <div className="bg-chat-input-border rounded-t-[1.25rem] p-1.5 pb-0">
          <div className="bg-background border-primary/20 dark:border-primary/10 flex flex-col gap-2 rounded-t-2xl border border-b-0 p-1">
            {mentionData ? (
              <RichTextEditor
                value={value}
                onValueChange={onValueChange}
                onSubmit={onSubmit}
                placeholder={placeholder}
                editorRef={editorRef}
                mentionOptions={mentionData}
                mentionTrigger={mentionTrigger}
                mentionMenuContainerRef={menuContainerRef}
              />
            ) : (
              <RichTextEditor
                value={value}
                onValueChange={onValueChange}
                onSubmit={onSubmit}
                placeholder={placeholder}
                editorRef={editorRef}
              />
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
    </div>
  );
};
