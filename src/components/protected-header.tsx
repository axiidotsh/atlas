'use client';

import { ChatShareDialog } from '@/components/chat-share-dialog';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { MOCK_CHATS } from '@/mock-data/chats';
import { cn } from '@/utils/utils';
import { PanelLeftIcon, Share2Icon } from 'lucide-react';
import { usePathname } from 'next/navigation';

const PAGE_TITLES: Record<string, string> = {
  'campaign-builder': 'Campaign Builder',
  chat: 'New Chat',
  metrics: 'Metrics',
  reports: 'Reports',
  studio: 'Creative Studio',
};

function formatSegmentTitle(segment: string) {
  return segment
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getChatTitle(chatId: string) {
  return MOCK_CHATS.find((chat) => chat.id === chatId)?.title ?? 'Chat';
}

function getHeaderState(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const [firstSegment, secondSegment] = segments;
  const isChatDetailPage = firstSegment === 'chat' && Boolean(secondSegment);

  if (isChatDetailPage && secondSegment) {
    return {
      chatId: secondSegment,
      isChatDetailPage,
      title: getChatTitle(secondSegment),
    };
  }

  if (!firstSegment) {
    return {
      chatId: null,
      isChatDetailPage,
      title: '',
    };
  }

  return {
    chatId: null,
    isChatDetailPage,
    title:
      PAGE_TITLES[firstSegment] ??
      formatSegmentTitle(segments.at(-1) ?? firstSegment),
  };
}

export const ProtectedHeader = () => {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const { chatId, isChatDetailPage, title } = getHeaderState(pathname);

  if (!title) {
    return null;
  }

  return (
    <header
      className={cn(
        'bg-background/95 border-border/50 sticky top-0 z-20 border-b backdrop-blur',
        !isChatDetailPage && 'md:hidden'
      )}
    >
      <div className="flex min-h-14 w-full items-center gap-3 px-3 md:px-6">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={toggleSidebar}
          className={cn('shrink-0', isChatDetailPage && 'md:hidden')}
        >
          <PanelLeftIcon />
          <span className="sr-only">Open sidebar</span>
        </Button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{title}</p>
        </div>
        {isChatDetailPage && chatId ? (
          <ChatShareDialog chatId={chatId}>
            <Button type="button" variant="outline" size="sm" className="shrink-0">
              <Share2Icon />
              <span>Share</span>
            </Button>
          </ChatShareDialog>
        ) : null}
      </div>
    </header>
  );
};
