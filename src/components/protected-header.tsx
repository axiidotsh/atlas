'use client';

import { getStudioProject } from '@/app/(protected)/studio/utils';
import { ShareDialog } from '@/components/share-dialog';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { MOCK_CHATS } from '@/mock-data/chats';
import { cn } from '@/utils/utils';
import { BookImageIcon, PanelLeftIcon, Share2Icon } from 'lucide-react';
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

function getStudioTitle(projectId: string) {
  return getStudioProject(projectId)?.title ?? 'Creative Studio';
}

function getHeaderState(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const [firstSegment, secondSegment] = segments;

  const isChatDetailPage = firstSegment === 'chat' && Boolean(secondSegment);
  const isStudioDetailPage =
    firstSegment === 'studio' && Boolean(secondSegment);

  if (isChatDetailPage && secondSegment) {
    return {
      detailId: secondSegment,
      isDetailPage: true,
      detailKind: 'chat' as const,
      title: getChatTitle(secondSegment),
    };
  }

  if (isStudioDetailPage && secondSegment) {
    return {
      detailId: secondSegment,
      isDetailPage: true,
      detailKind: 'project' as const,
      title: getStudioTitle(secondSegment),
    };
  }

  if (!firstSegment) {
    return {
      detailId: null,
      detailKind: null,
      isDetailPage: false,
      title: '',
    };
  }

  return {
    detailId: null,
    detailKind: null,
    isDetailPage: false,
    title:
      PAGE_TITLES[firstSegment] ??
      formatSegmentTitle(segments.at(-1) ?? firstSegment),
  };
}

interface ProtectedHeaderProps {
  onLeftSidebarToggle: () => void;
}

export const ProtectedHeader = ({
  onLeftSidebarToggle,
}: ProtectedHeaderProps) => {
  const pathname = usePathname();
  const { toggleSidebar: toggleRightSidebar } = useSidebar();

  const { detailId, detailKind, isDetailPage, title } =
    getHeaderState(pathname);

  const isChatDetailPage = detailId && detailKind === 'chat';
  const isStudioDetailPage = detailId && detailKind === 'project';

  if (!title) {
    return null;
  }

  return (
    <header
      className={cn(
        'bg-background/95 border-border/50 sticky top-0 z-20 border-b backdrop-blur',
        !isDetailPage && 'lg:hidden'
      )}
    >
      <div className="flex min-h-14 w-full items-center gap-3 px-3 md:px-6">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onLeftSidebarToggle}
          className={cn('shrink-0', isDetailPage && 'lg:hidden')}
        >
          <PanelLeftIcon />
          <span className="sr-only">Open left sidebar</span>
        </Button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{title}</p>
        </div>
        {isChatDetailPage && (
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
        )}
        {isStudioDetailPage && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={toggleRightSidebar}
              className="shrink-0"
            >
              <BookImageIcon />
              <span className="sr-only">Open right sidebar</span>
            </Button>
            <ShareDialog
              title="Share Project"
              description="Make this project public or private. Public projects can be viewed by anyone with the link."
              sharePath={`/studio/${detailId}`}
              copySuccessMessage="Public project link copied to clipboard"
              copyErrorMessage="Failed to copy project link"
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
          </>
        )}
      </div>
    </header>
  );
};
