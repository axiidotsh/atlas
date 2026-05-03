'use client';

import { AuthAppPreview } from '@/app/(auth)/auth-app-preview';
import { PlaceholderLogo } from '@/components/icons';
import { useUser } from '@/hooks/use-user';
import { AUTH_SUCCESS_REDIRECT } from '@/lib/redirects';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const AuthLayoutContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, isPending } = useUser();
  const router = useRouter();

  const isAuthenticated = Boolean(user);

  useEffect(() => {
    if (!isPending && isAuthenticated) {
      router.replace(AUTH_SUCCESS_REDIRECT);
    }
  }, [isPending, isAuthenticated, router]);

  if (isPending || isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-svh p-6 lg:h-svh lg:overflow-hidden">
      <div className="grid min-h-0 w-full gap-10 lg:grid-cols-2">
        <AuthAppPreview />
        <div className="flex min-h-0 w-full items-center justify-center">
          <div className="flex w-full max-w-sm flex-col gap-8">
            <PlaceholderLogo className="size-10" />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
