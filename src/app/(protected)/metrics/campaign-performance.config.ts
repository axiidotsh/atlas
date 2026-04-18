import type {
  CampaignStatus,
  MockAdAccount,
  MockCampaign,
} from '@/mock-data/types';

export interface CampaignPerformanceRow extends MockCampaign {
  adAccount: MockAdAccount;
}

export const CAMPAIGN_PERFORMANCE_STATUSES: CampaignStatus[] = [
  'ACTIVE',
  'PAUSED',
  'WITH_ISSUES',
  'ENDED',
];

export function formatCampaignStatus(status: CampaignStatus) {
  return status.toLowerCase().replaceAll('_', ' ');
}
