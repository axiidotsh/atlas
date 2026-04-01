'use client';

import { Button } from '@/components/ui/button';
import type { MockChatMessage } from '@/mock-data/types';
import { cn } from '@/utils/utils';
import {
  CopyIcon,
  DownloadIcon,
  PencilIcon,
  RotateCcwIcon,
} from 'lucide-react';
import { toast } from 'sonner';
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

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message.content);
      toast.success('Copied message to clipboad');
    } catch (err) {
      console.log(err);
      toast.error('Failed to copy message to clipboad');
    }
  }

  const actions: ActionProps[] = [
    {
      title: 'Copy message',
      icon: CopyIcon,
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
        <Streamdown className="[&_img]:cursor-pointer [&_li]:pl-4 [&_ol]:list-inside [&_ul]:list-inside">
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
