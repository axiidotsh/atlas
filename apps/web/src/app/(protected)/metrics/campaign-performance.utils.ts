import { GoogleAdsLogo, MetaLogo } from '@/components/icons';
import type { AdPlatform, CampaignStatus } from '@/mock-data/types';

export function getCampaignPlatformIcon(platform: AdPlatform) {
  return platform === 'google' ? GoogleAdsLogo : MetaLogo;
}

export function getCampaignStatusClassName(status: CampaignStatus) {
  if (status === 'ACTIVE') {
    return 'border-primary/20 bg-primary/10 text-primary';
  }

  if (status === 'WITH_ISSUES') {
    return 'border-destructive/20 bg-destructive/10 text-destructive';
  }

  if (status === 'PAUSED') {
    return 'border-border bg-muted text-muted-foreground';
  }

  return 'border-border bg-secondary text-secondary-foreground';
}
