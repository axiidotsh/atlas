'use client';

import { ScrollToBottom } from '@/components/chat/scroll-to-bottom';
import { AppSidebar } from '@/components/layout/app-sidebar';
import {
  getChatDetailId,
  getStudioDetailId,
  ProtectedHeader,
} from '@/components/layout/protected-header';
import { ScreenSpinner } from '@/components/screen-spinner';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useSession } from '@/lib/auth-client';
import { AUTH_FAILURE_REDIRECT } from '@/lib/redirects';
import { cn } from '@/utils/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { StickToBottom } from 'use-stick-to-bottom';

const SIDEBAR_MOBILE_BREAKPOINT = 1024;

export const ProtectedLayoutContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data, error, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const isChatDetailPage = Boolean(getChatDetailId(pathname));
  const isStudioDetailPage = Boolean(getStudioDetailId(pathname));

  const contentClassName = 'mx-auto flex w-full flex-1 flex-col px-4 sm:px-8';

  useEffect(() => {
    if (!isPending && (!data || error)) {
      router.replace(AUTH_FAILURE_REDIRECT);
    }
  }, [data, error, isPending, router]);

  if (isPending) {
    return <ScreenSpinner />;
  }

  if (!data || error) {
    return <ScreenSpinner />;
  }

  return (
    <SidebarProvider mobileBreakpoint={SIDEBAR_MOBILE_BREAKPOINT}>
      <AppSidebar />
      <SidebarInset>
        <ProtectedHeader />
        {isChatDetailPage || isStudioDetailPage ? (
          <StickToBottom
            className="relative h-[calc(100svh-3.5625rem)]"
            resize="smooth"
            initial="instant"
          >
            <StickToBottom.Content
              className={cn('min-h-full', contentClassName)}
            >
              {children}
            </StickToBottom.Content>
            <ScrollToBottom />
          </StickToBottom>
        ) : (
          <div className={contentClassName}>{children}</div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
};
