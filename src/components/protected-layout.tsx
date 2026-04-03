'use client';

import { StudioSidebar } from '@/app/(protected)/studio/components/studio-sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { ProtectedHeader } from '@/components/protected-header';
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from '@/components/ui/sidebar';

interface ProtectedLayoutShellProps {
  children: React.ReactNode;
}

const SIDEBAR_MOBILE_BREAKPOINT = 1024;

const ProtectedLayoutContent = ({ children }: ProtectedLayoutShellProps) => {
  const { toggleSidebar: toggleLeftSidebar } = useSidebar();

  return (
    <>
      <AppSidebar />
      <SidebarProvider mobileBreakpoint={SIDEBAR_MOBILE_BREAKPOINT}>
        <SidebarInset className="w-full">
          <ProtectedHeader onLeftSidebarToggle={toggleLeftSidebar} />
          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4">
            {children}
          </div>
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
