import { ProtectedLayoutShell } from '@/components/protected-layout';

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProtectedLayoutShell>{children}</ProtectedLayoutShell>;
}
