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

export function parseCampaignMetricValue(value: string) {
  const normalizedValue = value.replace(/[$,%x,]/g, '').trim();

  if (normalizedValue.length === 0) {
    return 0;
  }

  const suffix = normalizedValue.at(-1);
  const multiplier =
    suffix === 'K'
      ? 1_000
      : suffix === 'M'
        ? 1_000_000
        : suffix === 'B'
          ? 1_000_000_000
          : 1;
  const numericPortion =
    multiplier === 1 ? normalizedValue : normalizedValue.slice(0, -1);

  return Number(numericPortion) * multiplier;
}
