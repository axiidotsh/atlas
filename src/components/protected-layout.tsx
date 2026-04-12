'use client';

import { AppSidebar } from '@/components/app-sidebar';
import {
  getChatDetailId,
  getStudioDetailId,
  ProtectedHeader,
} from '@/components/protected-header';
import { ScrollToBottom } from '@/components/scroll-to-bottom';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/utils/utils';
import { usePathname } from 'next/navigation';
import { StickToBottom } from 'use-stick-to-bottom';

const SIDEBAR_MOBILE_BREAKPOINT = 1024;

export const ProtectedLayoutContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();

  const isChatDetailPage = Boolean(getChatDetailId(pathname));
  const isStudioDetailPage = Boolean(getStudioDetailId(pathname));

  const contentClassName = 'mx-auto flex w-full flex-1 flex-col px-4 sm:px-8';

  const content =
    isChatDetailPage || isStudioDetailPage ? (
      <StickToBottom
        className="relative h-[calc(100svh-3.5625rem)]"
        resize="smooth"
        initial="instant"
      >
        <StickToBottom.Content className={cn('min-h-full', contentClassName)}>
          {children}
        </StickToBottom.Content>
        <ScrollToBottom />
      </StickToBottom>
    ) : (
      <div className={contentClassName}>{children}</div>
    );

  return (
    <SidebarProvider mobileBreakpoint={SIDEBAR_MOBILE_BREAKPOINT}>
      <AppSidebar />
      <SidebarInset>
        <ProtectedHeader />
        {content}
      </SidebarInset>
    </SidebarProvider>
  );
};
