import { cn } from '@/utils/utils';
import { LoaderIcon } from 'lucide-react';

const NOTION_SPINNER_SEGMENTS = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  opacity: 1 - index * 0.06,
  transform: `translate(-50%, -50%) rotate(${index * 30}deg) translateY(-0.4375rem)`,
}));

interface ScreenSpinnerProps {
  className?: string;
  spinnerClassName?: string;
}

export const ScreenSpinner = ({
  className,
  spinnerClassName,
}: ScreenSpinnerProps) => {
  return (
    <div
      className={cn('flex min-h-svh items-center justify-center', className)}
    >
      <LoaderIcon className={cn('size-5 animate-spin', spinnerClassName)} />
    </div>
  );
};
