'use client';

import { Button } from '@/components/ui/button';
import { useBrowserShare } from '@/hooks/use-browser-share';
import type { MockChatMessage } from '@/mock-data/types';
import { cn } from '@/utils/utils';
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  PencilIcon,
  RotateCcwIcon,
  ShieldCheckIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Streamdown } from 'streamdown';
import 'streamdown/styles.css';

interface ChatMessageProps {
  message: MockChatMessage;
}

interface ActionProps {
  title: string;
  icon: typeof CopyIcon;
  handler: () => void;
  isUserOnly?: boolean;
  isAssistantOnly?: boolean;
}

export const Message = ({ message }: ChatMessageProps) => {
  const isUserMessage = message.role === 'user';
  const [isCopied, setIsCopied] = useState(false);
  const { copyText } = useBrowserShare();

  useEffect(() => {
    if (!isCopied) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsCopied(false);
    }, 2000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isCopied]);

  async function copyMessage() {
    const isCopySuccessful = await copyText(message.content, {
      successMessage: 'Copied message to clipboard',
      errorMessage: 'Failed to copy message to clipboard',
    });

    if (isCopySuccessful) {
      setIsCopied(true);
    }
  }

  const actions: ActionProps[] = [
    {
      title: 'Copy message',
      icon: isCopied ? CheckIcon : CopyIcon,
      handler: copyMessage,
    },
    {
      title: 'Download message',
      icon: DownloadIcon,
      handler: () => {},
    },
    {
      title: 'Edit message',
      icon: PencilIcon,
      handler: () => {},
      isUserOnly: true,
    },
    {
      title: 'Regenerate message',
      icon: RotateCcwIcon,
      handler: () => {},
      isAssistantOnly: true,
    },
    {
      title: 'Check response for accuracy',
      icon: ShieldCheckIcon,
      handler: () => {},
      isAssistantOnly: true,
    },
  ];

  return (
    <div
      className={cn(
        'flex w-full flex-col',
        isUserMessage && 'ml-auto w-fit max-w-172'
      )}
    >
      {/* Message */}
      <div
        className={cn(
          isUserMessage && 'bg-muted rounded-2xl px-4 py-3 shadow-xs'
        )}
      >
        <Streamdown className="[&_img]:cursor-pointer [&_ol]:list-outside [&_ol]:pl-8 [&_ul]:list-outside [&_ul]:pl-8">
          {message.content}
        </Streamdown>
      </div>
      {/* Actions */}
      <div className={cn('mt-2 flex items-center', isUserMessage && 'ml-auto')}>
        {actions.map((action, i) => {
          if (
            (action.isUserOnly && !isUserMessage) ||
            (action.isAssistantOnly && isUserMessage)
          ) {
            return null;
          }
          return (
            <Button
              key={i}
              variant="ghost"
              size="icon-sm"
              tooltip={action.title}
              className="text-muted-foreground"
              onClick={action.handler}
            >
              <action.icon />
            </Button>
          );
        })}
      </div>
    </div>
  );
};
