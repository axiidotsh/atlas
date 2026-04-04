import { MOCK_METRICS } from '@/mock-data/metrics';
import type {
  CampaignStatus,
  CoreMetricId,
  MockAdAccount,
  MockCampaign,
} from '@/mock-data/types';

export type CampaignPerformanceColumnId = 'adAccount' | 'status' | CoreMetricId;

export interface CampaignPerformanceColumnOption {
  id: CampaignPerformanceColumnId;
  label: string;
  type: 'dimension' | 'metric';
}

export interface CampaignPerformanceRow extends MockCampaign {
  adAccount: MockAdAccount;
}

export const CAMPAIGN_PERFORMANCE_COLUMNS: CampaignPerformanceColumnOption[] = [
  {
    id: 'adAccount',
    label: 'Ad Account',
    type: 'dimension',
  },
  {
    id: 'status',
    label: 'Status',
    type: 'dimension',
  },
  ...MOCK_METRICS.map((metric) => ({
    id: metric.id,
    label: metric.title,
    type: 'metric' as const,
  })),
];

export const DEFAULT_CAMPAIGN_PERFORMANCE_COLUMN_IDS: CampaignPerformanceColumnId[] =
  [
    'adAccount',
    'status',
    ...MOCK_METRICS.slice(0, 4).map((metric) => metric.id),
  ];

export const CAMPAIGN_PERFORMANCE_STATUSES: CampaignStatus[] = [
  'ACTIVE',
  'PAUSED',
  'WITH_ISSUES',
  'ENDED',
];

export function formatCampaignStatus(status: CampaignStatus) {
  return status.toLowerCase().replaceAll('_', ' ');
}
