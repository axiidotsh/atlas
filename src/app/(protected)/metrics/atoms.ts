import {
  DEFAULT_CAMPAIGN_PERFORMANCE_COLUMN_IDS,
  formatCampaignStatus,
  type CampaignPerformanceColumnId,
  type CampaignPerformanceRow,
} from '@/app/(protected)/metrics/campaign-performance.config';
import { MOCK_AD_ACCOUNTS, MOCK_CAMPAIGNS } from '@/mock-data/ad-data';
import type { CampaignStatus } from '@/mock-data/types';
import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

const campaignPerformanceColumnStorage =
  createJSONStorage<CampaignPerformanceColumnId[]>();

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

export const campaignPerformanceSearchAtom = atom('');
export const campaignPerformanceAdAccountFilterAtom = atom<string[]>([]);
export const campaignPerformanceStatusFilterAtom = atom<CampaignStatus[]>([]);

export const campaignPerformanceVisibleColumnsAtom = atomWithStorage<
  CampaignPerformanceColumnId[]
>(
  'metrics-campaign-performance-visible-columns',
  DEFAULT_CAMPAIGN_PERFORMANCE_COLUMN_IDS,
  campaignPerformanceColumnStorage,
  {
    getOnInit: true,
  }
);

export const campaignPerformanceRowsAtom = atom(campaignRows);

export const filteredCampaignPerformanceRowsAtom = atom((get) => {
  const campaigns = get(campaignPerformanceRowsAtom);
  const searchValue = get(campaignPerformanceSearchAtom).trim().toLowerCase();
  const selectedAdAccountIds = get(campaignPerformanceAdAccountFilterAtom);
  const selectedStatuses = get(campaignPerformanceStatusFilterAtom);

  return campaigns.filter((campaign) => {
    const matchesSearch =
      searchValue.length === 0 ||
      campaign.name.toLowerCase().includes(searchValue) ||
      campaign.id.toLowerCase().includes(searchValue) ||
      campaign.adAccount.name.toLowerCase().includes(searchValue) ||
      formatCampaignStatus(campaign.status).includes(searchValue);

    const matchesAdAccount =
      selectedAdAccountIds.length === 0 ||
      selectedAdAccountIds.includes(campaign.adAccount.id);

    const matchesStatus =
      selectedStatuses.length === 0 ||
      selectedStatuses.includes(campaign.status);

    return matchesSearch && matchesAdAccount && matchesStatus;
  });
});
