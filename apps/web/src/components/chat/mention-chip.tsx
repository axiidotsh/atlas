import { PlatformIcon } from '@/components/platform-icon';
import type { AdPlatform } from '@/mock-data/types';
import { cn } from '@/utils/utils';

interface MentionChipProps {
  name: string;
  platform: AdPlatform;
  className?: string;
}

export const MentionChip = ({
  name,
  platform,
  className,
}: MentionChipProps) => {
  return (
    <span
      className={cn(
        'bg-accent text-foreground inline-flex h-5 items-center gap-1 rounded px-1 align-middle leading-none',
        className
      )}
    >
      <PlatformIcon platform={platform} className="h-3" />
      <span>{name}</span>
    </span>
  );
};
