import { ProtectedLayoutContent } from '@/components/protected-layout';

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProtectedLayoutContent>{children}</ProtectedLayoutContent>;
}
