'use client';

import { ShareDialog } from '@/components/share-dialog';
import { Button } from '@/components/ui/button';
import { getStandardConversation } from '@/mock-data/conversations';
import { PanelLeftIcon, Share2Icon } from 'lucide-react';
import { usePathname } from 'next/navigation';

function getChatTitle(chatId: string) {
  return getStandardConversation(chatId)?.title ?? 'Chat';
}

export function getChatDetailId(pathname: string) {
  const match = pathname.match(/^\/chat\/([^/]+)$/);

  return match?.[1] ?? null;
}

interface ProtectedHeaderProps {
  onLeftSidebarToggle: () => void;
}

export const ProtectedHeader = ({
  onLeftSidebarToggle,
}: ProtectedHeaderProps) => {
  const pathname = usePathname();
  const detailId = getChatDetailId(pathname);

  if (!detailId) {
    return null;
  }

  const title = getChatTitle(detailId);

  return (
    <header className="bg-background/95 border-border/50 sticky top-0 z-20 border-b backdrop-blur">
      <div className="flex h-14 w-full items-center gap-3 px-3 md:px-6">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onLeftSidebarToggle}
          className="shrink-0 lg:hidden"
        >
          <PanelLeftIcon />
          <span className="sr-only">Open left sidebar</span>
        </Button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{title}</p>
        </div>
        <ShareDialog
          title="Share chat"
          description="Make this chat public or private. Public chats can be viewed by anyone with the link."
          sharePath={`/chat/${detailId}`}
          copySuccessMessage="Public chat link copied to clipboard"
          copyErrorMessage="Failed to copy chat link"
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0"
          >
            <Share2Icon />
            <span>Share</span>
          </Button>
        </ShareDialog>
      </div>
    </header>
  );
};
