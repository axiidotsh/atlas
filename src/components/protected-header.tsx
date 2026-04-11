'use client';

import { ShareDialog } from '@/components/share-dialog';
import { Button } from '@/components/ui/button';
import {
  getStandardConversation,
  getStudioConversation,
} from '@/mock-data/conversations';
import { cn } from '@/utils/utils';
import { PanelLeftIcon, Share2Icon } from 'lucide-react';
import { usePathname } from 'next/navigation';

function getChatTitle(chatId: string) {
  return getStandardConversation(chatId)?.title ?? 'Chat';
}

function getStudioTitle(projectId: string) {
  return getStudioConversation(projectId)?.title ?? 'Project';
}

export function getChatDetailId(pathname: string) {
  const match = pathname.match(/^\/chat\/([^/]+)$/);

  return match?.[1] ?? null;
}

function getStudioDetailId(pathname: string) {
  const match = pathname.match(/^\/studio\/([^/]+)$/);

  if (match?.[1] === 'new') {
    return null;
  }

  return match?.[1] ?? null;
}

function getFallbackTitle(pathname: string) {
  const [segment] = pathname.split('/').filter(Boolean);

  if (!segment) {
    return 'Atlas';
  }

  return segment
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getProtectedHeaderTitle(pathname: string) {
  const chatDetailId = getChatDetailId(pathname);

  if (chatDetailId) {
    return getChatTitle(chatDetailId);
  }

  const studioDetailId = getStudioDetailId(pathname);

  if (studioDetailId) {
    return getStudioTitle(studioDetailId);
  }

  if (pathname === '/chat') {
    return 'Chat';
  }

  if (pathname === '/metrics') {
    return 'Metrics';
  }

  if (pathname === '/reports') {
    return 'Reports';
  }

  if (pathname === '/studio') {
    return 'Creative Studio';
  }

  if (pathname === '/studio/new') {
    return 'New Project';
  }

  if (pathname === '/campaign-launcher') {
    return 'Campaign Launcher';
  }

  return getFallbackTitle(pathname);
}

interface ProtectedHeaderProps {
  onLeftSidebarToggle: () => void;
}

export const ProtectedHeader = ({
  onLeftSidebarToggle,
}: ProtectedHeaderProps) => {
  const pathname = usePathname();
  const detailId = getChatDetailId(pathname);
  const title = getProtectedHeaderTitle(pathname);

  return (
    <header
      className={cn(
        'bg-background/95 border-border/50 sticky top-0 z-20 border-b backdrop-blur',
        !detailId && 'lg:hidden'
      )}
    >
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
        {detailId ? (
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
        ) : null}
      </div>
    </header>
  );
};
