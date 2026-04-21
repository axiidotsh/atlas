import { getCampaignStatusClassName } from '@/app/(protected)/metrics/campaign-performance.utils';
import { formatCampaignStatus } from '@/app/(protected)/metrics/config/campaign-performance.config';
import type { MetricsPerformanceRow } from '@/app/(protected)/metrics/metrics-data';
import {
  parseMetricValue,
  toTitleCase as sharedToTitleCase,
} from '@/app/(protected)/metrics/utils/formatters';
import { type ChartConfig } from '@/components/ui/chart';
import { MOCK_METRICS } from '@/mock-data/metrics';
import type {
  AdPlatform,
  CampaignStatus,
  CoreMetricId,
  PerformanceLevel,
} from '@/mock-data/types';
import type { ReactNode } from 'react';

export const META_ACCOUNT_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
] as const;

export const GOOGLE_ACCOUNT_COLORS = ['#fbbc04', '#34a853'] as const;

export const CAMPAIGN_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--primary)',
] as const;

export const STATUS_COLORS: Record<CampaignStatus, string> = {
  ACTIVE: 'var(--primary)',
  PAUSED: 'var(--muted-foreground)',
  WITH_ISSUES: 'var(--destructive)',
  ENDED: 'var(--chart-4)',
};

export type PerformanceColumnId = 'adAccount' | 'status' | CoreMetricId;

export interface PerformanceColumnOption {
  id: PerformanceColumnId;
  label: string;
  type: 'dimension' | 'metric';
}

export interface PerformanceSectionState<T> {
  campaign: T;
  adSet: T;
  ad: T;
}

export interface BreakdownDatum {
  id: string;
  label: string;
  value: number;
  fill: string;
  percentage: number;
  platform?: AdPlatform;
}

export interface DetailRow {
  label: string;
  value: ReactNode;
}

export const CAMPAIGN_DIMENSION_COLUMNS: PerformanceColumnOption[] = [
  { id: 'status', label: 'Status', type: 'dimension' },
];

export const AD_SET_DIMENSION_COLUMNS: PerformanceColumnOption[] = [
  { id: 'status', label: 'Status', type: 'dimension' },
];

export const METRIC_COLUMNS: PerformanceColumnOption[] = MOCK_METRICS.map(
  (metric) => ({
    id: metric.id,
    label: metric.title,
    type: 'metric',
  })
);

const DEFAULT_METRIC_COLUMN_IDS = MOCK_METRICS.map(
  (metric) => metric.id
) satisfies CoreMetricId[];

export const DEFAULT_VISIBLE_COLUMN_IDS: PerformanceSectionState<
  PerformanceColumnId[]
> = {
  campaign: ['status', ...DEFAULT_METRIC_COLUMN_IDS],
  adSet: ['status', ...DEFAULT_METRIC_COLUMN_IDS],
  ad: ['status', ...DEFAULT_METRIC_COLUMN_IDS],
};

export function formatPercentage(value: number): string {
  return `${value.toFixed(value >= 10 ? 0 : 1)}%`;
}

export const toTitleCase = sharedToTitleCase;

export function toggleSelection<T extends string>(items: T[], value: T): T[] {
  return items.includes(value)
    ? items.filter((item) => item !== value)
    : [...items, value];
}

export function comparePerformanceRows(
  leftRow: MetricsPerformanceRow,
  rightRow: MetricsPerformanceRow,
  selectedMetricId: CoreMetricId
): number {
  const metricDifference =
    parseMetricValue(rightRow.metrics[selectedMetricId]) -
    parseMetricValue(leftRow.metrics[selectedMetricId]);

  if (metricDifference !== 0) {
    return metricDifference;
  }

  return (
    parseMetricValue(rightRow.metrics.revenue) -
    parseMetricValue(leftRow.metrics.revenue)
  );
}

export function getLevelLabel(level: PerformanceLevel): string {
  if (level === 'campaign') return 'campaigns';
  if (level === 'adSet') return 'ad sets';
  return 'ads';
}

export function getPerformanceItemLabel(level: PerformanceLevel): string {
  if (level === 'campaign') return 'campaign';
  if (level === 'adSet') return 'ad set';
  return 'ad';
}

export function getBreakdownSummaryLabel(level: PerformanceLevel): string {
  if (level === 'campaign') {
    return 'Total campaigns in the current breakdown';
  }
  if (level === 'adSet') {
    return 'Total ad sets in the current breakdown';
  }
  return 'Total ads in the current breakdown';
}

export function getCompositionChartTitle(level: PerformanceLevel): string {
  if (level === 'campaign') return 'Campaigns by Ad Account';
  if (level === 'adSet') return 'Ad Sets by Campaign';
  return 'Ads by Ad Set';
}

export function getCompositionChartDescription(
  level: PerformanceLevel
): string {
  if (level === 'campaign') {
    return 'See how campaign volume is distributed across connected ad accounts.';
  }
  if (level === 'adSet') {
    return 'See which campaigns are carrying the largest ad set footprint right now.';
  }
  return 'See which ad sets are carrying the highest ad volume in the current mix.';
}

export function getStatusChartTitle(level: PerformanceLevel): string {
  if (level === 'campaign') return 'Campaigns by Status';
  if (level === 'adSet') return 'Ad Sets by Status';
  return 'Ads by Status';
}

export function getStatusChartDescription(level: PerformanceLevel): string {
  if (level === 'campaign') {
    return 'Track the current campaign mix across active, paused, ended, and issue states.';
  }
  if (level === 'adSet') {
    return 'Track the current ad set mix across active, paused, ended, and issue states.';
  }
  return 'Track the current ad mix across active, paused, ended, and issue states.';
}

export function getPerformanceDetailTitle(level: PerformanceLevel): string {
  if (level === 'campaign') return 'Campaign Performance';
  if (level === 'adSet') return 'Ad Set Performance';
  return 'Ad Performance';
}

export function getPerformanceDetailDescription(
  level: PerformanceLevel
): string {
  if (level === 'campaign') {
    return 'Search campaigns, refine filters, and customize visible columns in the full performance table.';
  }
  if (level === 'adSet') {
    return 'Search ad sets, refine filters, and customize visible columns in the full performance table.';
  }
  return 'Search ads, refine filters, and customize visible columns in the full performance table.';
}

export function getPerformanceItemSheetDescription(
  level: PerformanceLevel
): string {
  if (level === 'campaign') {
    return 'Review the full performance snapshot and account context for this campaign.';
  }
  if (level === 'adSet') {
    return 'Review the full performance snapshot and campaign context for this ad set.';
  }
  return 'Review the full performance snapshot, hierarchy, and creative assets for this ad.';
}

export function getPerformanceDetailsCardTitle(
  level: PerformanceLevel
): string {
  if (level === 'campaign') return 'Campaign Details';
  if (level === 'adSet') return 'Ad Set Details';
  return 'Ad Details';
}

export function getPerformanceRowThumbnail(row: MetricsPerformanceRow): string {
  if (!row.previewMedia) {
    return '';
  }

  if (row.previewMedia.type === 'video') {
    return row.previewMedia.posterSrc ?? row.previewMedia.src;
  }

  return row.previewMedia.src;
}

export function createAdAccountBreakdown(
  rows: MetricsPerformanceRow[],
  totalRows: number
): BreakdownDatum[] {
  const breakdownByAccount = new Map<string, number>();
  let metaColorIndex = 0;
  let googleColorIndex = 0;

  rows.forEach((row) => {
    breakdownByAccount.set(
      row.adAccount.id,
      (breakdownByAccount.get(row.adAccount.id) ?? 0) + 1
    );
  });

  return Array.from(breakdownByAccount.entries())
    .flatMap(([adAccountId, value]) => {
      const row = rows.find((item) => item.adAccount.id === adAccountId);

      if (!row) {
        return [];
      }

      const fill =
        row.adAccount.platform === 'google'
          ? GOOGLE_ACCOUNT_COLORS[
              googleColorIndex++ % GOOGLE_ACCOUNT_COLORS.length
            ]
          : META_ACCOUNT_COLORS[metaColorIndex++ % META_ACCOUNT_COLORS.length];

      return [
        {
          id: adAccountId,
          label: row.adAccount.name,
          value,
          fill,
          percentage: totalRows === 0 ? 0 : (value / totalRows) * 100,
          platform: row.adAccount.platform,
        },
      ];
    })
    .sort((left, right) => right.value - left.value);
}

export function createCampaignBreakdown(
  rows: MetricsPerformanceRow[],
  totalRows: number
): BreakdownDatum[] {
  const breakdownByCampaign = new Map<string, number>();

  rows.forEach((row) => {
    const campaignName = row.campaignName;

    if (!campaignName) {
      return;
    }

    breakdownByCampaign.set(
      campaignName,
      (breakdownByCampaign.get(campaignName) ?? 0) + 1
    );
  });

  return Array.from(breakdownByCampaign.entries())
    .map(([campaignName, value], index) => ({
      id: campaignName,
      label: campaignName,
      value,
      fill: CAMPAIGN_COLORS[index % CAMPAIGN_COLORS.length],
      percentage: totalRows === 0 ? 0 : (value / totalRows) * 100,
    }))
    .sort((left, right) => right.value - left.value);
}

export function createAdSetBreakdown(
  rows: MetricsPerformanceRow[],
  totalRows: number
): BreakdownDatum[] {
  const breakdownByAdSet = new Map<string, number>();

  rows.forEach((row) => {
    if (!row.adSetName) {
      return;
    }

    breakdownByAdSet.set(
      row.adSetName,
      (breakdownByAdSet.get(row.adSetName) ?? 0) + 1
    );
  });

  return Array.from(breakdownByAdSet.entries())
    .map(([adSetName, value], index) => ({
      id: adSetName,
      label: adSetName,
      value,
      fill: CAMPAIGN_COLORS[index % CAMPAIGN_COLORS.length],
      percentage: totalRows === 0 ? 0 : (value / totalRows) * 100,
    }))
    .sort((left, right) => right.value - left.value);
}

export function createStatusBreakdown(
  rows: MetricsPerformanceRow[],
  totalRows: number
): BreakdownDatum[] {
  const statusCounts = new Map<CampaignStatus, number>();

  rows.forEach((row) => {
    statusCounts.set(row.status, (statusCounts.get(row.status) ?? 0) + 1);
  });

  return Object.entries(STATUS_COLORS)
    .map(([status, fill]) => {
      const value = statusCounts.get(status as CampaignStatus) ?? 0;

      return {
        id: status,
        label: toTitleCase(formatCampaignStatus(status as CampaignStatus)),
        value,
        fill,
        percentage: totalRows === 0 ? 0 : (value / totalRows) * 100,
      };
    })
    .filter((item) => item.value > 0)
    .sort((left, right) => right.value - left.value);
}

export function createChartConfig(data: BreakdownDatum[]): ChartConfig {
  return Object.fromEntries(
    data.map((item) => [
      item.id,
      {
        label: item.label,
        color: item.fill,
      },
    ])
  ) satisfies ChartConfig;
}

export { formatCampaignStatus, getCampaignStatusClassName };
