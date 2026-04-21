import type { CampaignPerformanceRow } from '@/app/(protected)/metrics/config/campaign-performance.config';
import {
  PLATFORM_BREAKDOWN_METRIC_KEYS,
  type PlatformBreakdownMetricKey,
} from '@/app/(protected)/metrics/config/platform-breakdown.config';
import type { MetricsPerformanceRow } from '@/app/(protected)/metrics/metrics-data';
import { MOCK_AD_ACCOUNTS, MOCK_CAMPAIGNS } from '@/mock-data/ad-data';
import { atom } from 'jotai';

export type MetricsShareDialogTab = 'share' | 'export';

const adAccountsById = new Map(
  MOCK_AD_ACCOUNTS.map((adAccount) => [adAccount.id, adAccount])
);

const campaignRows: CampaignPerformanceRow[] = MOCK_CAMPAIGNS.flatMap(
  (campaign) => {
    const adAccount = adAccountsById.get(campaign.adAccountId);

    if (!adAccount) {
      return [];
    }

    return [{ ...campaign, adAccount }];
  }
);

export const campaignPerformanceRowsAtom = atom(campaignRows);

export const platformBreakdownVisibleMetricsAtom = atom<
  PlatformBreakdownMetricKey[]
>([...PLATFORM_BREAKDOWN_METRIC_KEYS]);

export const metricsShareDialogOpenAtom = atom(false);

export const metricsShareDialogTabAtom = atom<MetricsShareDialogTab>('share');

export const performanceDetailRowAtom = atom<MetricsPerformanceRow | null>(
  null
);
