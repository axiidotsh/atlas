import { ProtectedLayoutContent } from '@/components/layout/protected-layout';

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProtectedLayoutContent>{children}</ProtectedLayoutContent>;
}
