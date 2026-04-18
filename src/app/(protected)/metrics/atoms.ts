import type { CampaignPerformanceRow } from '@/app/(protected)/metrics/campaign-performance.config';
import {
  PLATFORM_BREAKDOWN_METRIC_KEYS,
  type PlatformBreakdownMetricKey,
} from '@/app/(protected)/metrics/platform-breakdown.config';
import { MOCK_AD_ACCOUNTS, MOCK_CAMPAIGNS } from '@/mock-data/ad-data';
import { atom } from 'jotai';

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
