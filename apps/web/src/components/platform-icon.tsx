import { GoogleAdsLogo, MetaLogo } from '@/components/icons';
import type { AdPlatform } from '@/mock-data/types';
import { cn } from '@/utils/utils';

interface PlatformIconProps {
  platform: AdPlatform;
  className?: string;
}

export const PlatformIcon = ({ platform, className }: PlatformIconProps) => {
  const sizeClassName = platform === 'google' ? 'h-4' : 'h-3';
  const Icon = platform === 'google' ? GoogleAdsLogo : MetaLogo;

  return <Icon className={cn('w-auto shrink-0', sizeClassName, className)} />;
};
