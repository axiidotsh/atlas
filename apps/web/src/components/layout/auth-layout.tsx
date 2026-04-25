'use client';

import { AuthAppPreview } from '@/app/(auth)/auth-app-preview';
import { PlaceholderLogo } from '@/components/icons';
import { ScreenSpinner } from '@/components/screen-spinner';
import { useSession } from '@/lib/auth-client';
import { AUTH_SUCCESS_REDIRECT } from '@/lib/redirects';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const AuthLayoutContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && data) {
      router.replace(AUTH_SUCCESS_REDIRECT);
    }
  }, [data, isPending, router]);

  if (isPending) {
    return <ScreenSpinner />;
  }

  if (data) {
    return <ScreenSpinner />;
  }

  return (
    <div className="flex min-h-svh justify-center p-6 lg:h-svh lg:overflow-hidden">
      <div className="flex min-h-0 w-full max-w-400 gap-10">
        <AuthAppPreview />
        <div className="flex min-h-0 w-full items-center justify-center lg:w-[45%] xl:w-[42%]">
          <div className="flex w-full max-w-sm flex-col gap-8">
            <PlaceholderLogo className="size-10" />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
