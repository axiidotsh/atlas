import { PlaceholderLogo } from '@/components/icons';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh gap-10 p-6">
      <div className="relative hidden flex-1 lg:block">
        <img
          src="/auth-image.png"
          alt=""
          className="absolute inset-0 size-full rounded-2xl object-cover object-right"
        />
      </div>
      <div className="flex w-full items-center justify-center lg:w-[45%] xl:w-[42%]">
        <div className="flex w-full max-w-sm flex-col gap-8">
          <PlaceholderLogo className="size-10" />
          {children}
        </div>
      </div>
    </div>
  );
}
