'use client';

import { StudioSidebar } from '@/app/(protected)/studio/components/studio-sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { getHeaderState, ProtectedHeader } from '@/components/protected-header';
import { ScrollToBottom } from '@/components/scroll-to-bottom';
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { StickToBottom } from 'use-stick-to-bottom';

interface ProtectedLayoutShellProps {
  children: React.ReactNode;
}

const SIDEBAR_MOBILE_BREAKPOINT = 1024;

const ProtectedLayoutContent = ({ children }: ProtectedLayoutShellProps) => {
  const { toggleSidebar: toggleLeftSidebar } = useSidebar();
  const pathname = usePathname();

  const { isDetailPage } = getHeaderState(pathname);

  const contentClassName = 'mx-auto flex w-full max-w-3xl flex-1 flex-col px-4';

  const content = isDetailPage ? (
    <StickToBottom
      className="relative h-[calc(100vh-3.5625rem)]"
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
      <SidebarProvider mobileBreakpoint={SIDEBAR_MOBILE_BREAKPOINT}>
        <SidebarInset>
          <ProtectedHeader onLeftSidebarToggle={toggleLeftSidebar} />
          {content}
        </SidebarInset>
        <StudioSidebar />
      </SidebarProvider>
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
