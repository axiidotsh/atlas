import { AppSidebar } from '@/components/app-sidebar';
import { ProtectedHeader } from '@/components/protected-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="w-full">
        <ProtectedHeader />
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
