'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { getChatDetailId, ProtectedHeader } from '@/components/protected-header';
import { ScrollToBottom } from '@/components/scroll-to-bottom';
import { SidebarInset, SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { StickToBottom } from 'use-stick-to-bottom';

interface ProtectedLayoutShellProps {
  children: React.ReactNode;
}

const SIDEBAR_MOBILE_BREAKPOINT = 1024;

const ProtectedLayoutContent = ({ children }: ProtectedLayoutShellProps) => {
  const { toggleSidebar: toggleLeftSidebar } = useSidebar();
  const pathname = usePathname();

  const isChatDetailPage = Boolean(getChatDetailId(pathname));

  const contentClassName = 'mx-auto flex w-full flex-1 flex-col px-4 sm:px-8';

  const content =
    isChatDetailPage ? (
      <StickToBottom
        className="relative h-[calc(100svh-3.5625rem)]"
        resize="smooth"
        initial="instant"
      >
        <StickToBottom.Content className={contentClassName}>
          {children}
        </StickToBottom.Content>
        <ScrollToBottom />
      </StickToBottom>
    ) : (
      <div className={contentClassName}>{children}</div>
    );

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <ProtectedHeader onLeftSidebarToggle={toggleLeftSidebar} />
        {content}
      </SidebarInset>
    </>
  );
};

export const ProtectedLayoutShell = ({
  children,
}: ProtectedLayoutShellProps) => {
  return (
    <SidebarProvider mobileBreakpoint={SIDEBAR_MOBILE_BREAKPOINT}>
      <ProtectedLayoutContent>{children}</ProtectedLayoutContent>
    </SidebarProvider>
  );
};
