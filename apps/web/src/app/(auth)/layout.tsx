import { AuthAppPreview } from '@/app/(auth)/auth-app-preview';
import { PlaceholderLogo } from '@/components/icons';
import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh justify-center p-6 lg:h-svh lg:overflow-hidden">
      <div className="flex min-h-0 w-full max-w-[100rem] gap-10">
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
}
