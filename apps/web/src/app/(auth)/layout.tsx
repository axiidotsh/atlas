import { AuthLayoutContent } from '@/components/layout/auth-layout';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayoutContent>{children}</AuthLayoutContent>;
}
