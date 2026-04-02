'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useBrowserShare } from '@/hooks/use-browser-share';
import { cn } from '@/utils/utils';
import { GlobeIcon, LockIcon } from 'lucide-react';
import { Fragment, type ReactNode, useEffect, useState } from 'react';
import { Separator } from './ui/separator';

interface ChatShareDialogProps {
  chatId: string;
  children: ReactNode;
}

interface VisibilityProps {
  title: string;
  description: string;
  icon: typeof LockIcon;
  handler: () => void;
}

export const ChatShareDialog = ({ chatId, children }: ChatShareDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const { copyText } = useBrowserShare();

  useEffect(() => {
    setShareUrl(`${window.location.origin}/chat/${chatId}`);
  }, [chatId]);

  async function handleAction() {
    if (!isPublic) {
      setIsPublic(true);
      return;
    }

    if (!shareUrl) {
      return;
    }

    await copyText(shareUrl, {
      successMessage: 'Public chat link copied to clipboard',
      errorMessage: 'Failed to copy chat link',
    });
  }

  const visibilities: VisibilityProps[] = [
    {
      title: 'Private',
      description: 'Only you have access',
      icon: LockIcon,
      handler: () => setIsPublic(false),
    },
    {
      title: 'Public',
      description: 'Anyone with the link can view',
      icon: GlobeIcon,
      handler: () => setIsPublic(true),
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share chat</DialogTitle>
          <DialogDescription>
            Make this chat public or private. Public chats can be viewed by
            anyone with the link.
          </DialogDescription>
        </DialogHeader>
        <div className="min-w-0 space-y-3">
          <div className="bg-muted border-border/50 dark:border-border flex flex-col rounded-xl border">
            {visibilities.map((visibility, i) => {
              const isLast = i === visibilities.length - 1;
              const isActive =
                (visibility.title.toLowerCase() === 'private' && !isPublic) ||
                (visibility.title.toLowerCase() === 'public' && isPublic);

              return (
                <Fragment key={visibility.title}>
                  <button
                    type="button"
                    className={cn(
                      'flex cursor-pointer items-center gap-3 px-6 py-3',
                      isActive && 'text-primary'
                    )}
                    onClick={visibility.handler}
                  >
                    <visibility.icon className="size-4" />
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-sm">{visibility.title}</span>
                      <span
                        className={cn(
                          'text-muted-foreground text-xs',
                          isActive && 'text-primary'
                        )}
                      >
                        {visibility.description}
                      </span>
                    </div>
                  </button>
                  {!isLast && (
                    <Separator className="bg-border/50 dark:bg-border" />
                  )}
                </Fragment>
              );
            })}
          </div>
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
            <div
              aria-hidden={!isPublic}
              className={cn(
                'border-border/50 dark:border-border bg-muted/50 min-w-0 rounded-md border px-4 py-2 transition-opacity',
                isPublic ? 'opacity-100' : 'invisible opacity-0'
              )}
            >
              <p className="text-muted-foreground block max-w-full truncate text-sm">
                {shareUrl || 'Public chat link'}
              </p>
            </div>
            <Button
              type="button"
              onClick={handleAction}
              disabled={isPublic && !shareUrl}
              className="shrink-0"
            >
              {isPublic ? 'Copy link' : 'Create public link'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
