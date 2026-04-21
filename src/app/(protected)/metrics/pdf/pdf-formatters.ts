import {
  CAMPAIGN_PERFORMANCE_STATUSES,
  formatCampaignStatus,
} from '@/app/(protected)/metrics/config/campaign-performance.config';
import {
  PLATFORM_BREAKDOWN_METRIC_KEYS,
  type PlatformBreakdownMetricKey,
} from '@/app/(protected)/metrics/config/platform-breakdown.config';
import type { MetricsPerformanceRow } from '@/app/(protected)/metrics/metrics-data';
import {
  CAMPAIGN_COLORS,
  GOOGLE_ACCOUNT_COLORS,
  META_ACCOUNT_COLORS,
  PLATFORM_ORDER,
  STATUS_COLORS,
  compactCurrencyFormatter,
  compactNumberFormatter,
  unitCurrencyFormatter,
} from '@/app/(protected)/metrics/pdf/pdf-design';
import {
  parseMetricValue,
  toTitleCase,
} from '@/app/(protected)/metrics/utils/formatters';
import type {
  AdPlatform,
  MockCampaignMetrics,
  PerformanceLevel,
} from '@/mock-data/types';

export interface PieSlice {
  color: string;
  label: string;
  percentage: number;
  platform?: AdPlatform;
  value: number;
}

export interface PlatformMetricSummary {
  campaignCount: number;
  clicks: number;
  cpc: number;
  ctr: number;
  impressions: number;
  platform: AdPlatform;
  reach: number;
  revenue: number;
  roas: number;
  spend: number;
}

export interface Point {
  x: number;
  y: number;
}

export { PLATFORM_BREAKDOWN_METRIC_KEYS, parseMetricValue, toTitleCase };

export function formatCompactNumber(value: number): string {
  return compactNumberFormatter.format(value);
}

export function formatCurrency(value: number): string {
  return compactCurrencyFormatter.format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function formatMultiplier(value: number): string {
  return `${value.toFixed(2)}x`;
}

export function formatPercentage(value: number): string {
  const percentageValue = value * 100;

  return `${percentageValue.toFixed(percentageValue >= 10 ? 0 : 1)}%`;
}

export function formatPlatformMetric(
  key: PlatformBreakdownMetricKey,
  value: number
): string {
  if (key === 'spend' || key === 'revenue') {
    return compactCurrencyFormatter.format(value);
  }

  if (key === 'cpc') {
    return unitCurrencyFormatter.format(value);
  }

  if (key === 'ctr') {
    return `${value.toFixed(2)}%`;
  }

  if (key === 'roas') {
    return `${value.toFixed(2)}x`;
  }

  return compactNumberFormatter.format(value);
}

export function formatMetricChange(
  percentageChange: number,
  trend: 'positive' | 'negative' | 'neutral'
): string {
  if (trend === 'positive') {
    return `↑ ${percentageChange}%`;
  }

  if (trend === 'negative') {
    return `↓ ${percentageChange}%`;
  }

  return `- ${percentageChange}%`;
}

export function formatPlatformName(platform: AdPlatform): string {
  return platform === 'meta' ? 'Meta Ads' : 'Google Ads';
}

export function chunkItems<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

export function getBreakdownPageTitle(level: PerformanceLevel): string {
  if (level === 'campaign') return 'Campaign Breakdown';
  if (level === 'adSet') return 'Ad Set Breakdown';
  return 'Ad Breakdown';
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

export function getStatusChartTitle(level: PerformanceLevel): string {
  if (level === 'campaign') return 'Campaigns by Status';
  if (level === 'adSet') return 'Ad Sets by Status';
  return 'Ads by Status';
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

export function comparePerformanceRows(
  leftRow: MetricsPerformanceRow,
  rightRow: MetricsPerformanceRow
): number {
  const roasDifference =
    parseMetricValue(rightRow.metrics.roas) -
    parseMetricValue(leftRow.metrics.roas);

  if (roasDifference !== 0) {
    return roasDifference;
  }

  return (
    parseMetricValue(rightRow.metrics.revenue) -
    parseMetricValue(leftRow.metrics.revenue)
  );
}

export function createPlatformSummaries(
  campaignRows: Array<{
    adAccount: { platform: AdPlatform };
    metrics: MockCampaignMetrics;
  }>
): PlatformMetricSummary[] {
  const platformMap = new Map<AdPlatform, PlatformMetricSummary>(
    PLATFORM_ORDER.map((platform) => [
      platform,
      {
        campaignCount: 0,
        clicks: 0,
        cpc: 0,
        ctr: 0,
        impressions: 0,
        platform,
        reach: 0,
        revenue: 0,
        roas: 0,
        spend: 0,
      },
    ])
  );

  campaignRows.forEach((campaign) => {
    const summary = platformMap.get(campaign.adAccount.platform);

    if (!summary) {
      return;
    }

    summary.campaignCount += 1;
    summary.impressions += parseMetricValue(campaign.metrics.impressions);
    summary.clicks += parseMetricValue(campaign.metrics.clicks);
    summary.spend += parseMetricValue(campaign.metrics.spend);
    summary.reach += parseMetricValue(campaign.metrics.reach);
    summary.revenue += parseMetricValue(campaign.metrics.revenue);
  });

  return PLATFORM_ORDER.map((platform) => {
    const summary = platformMap.get(platform);

    if (!summary) {
      return {
        campaignCount: 0,
        clicks: 0,
        cpc: 0,
        ctr: 0,
        impressions: 0,
        platform,
        reach: 0,
        revenue: 0,
        roas: 0,
        spend: 0,
      };
    }

    return {
      ...summary,
      cpc: summary.clicks === 0 ? 0 : summary.spend / summary.clicks,
      ctr:
        summary.impressions === 0
          ? 0
          : (summary.clicks / summary.impressions) * 100,
      roas: summary.spend === 0 ? 0 : summary.revenue / summary.spend,
    };
  });
}

export function createCompositionBreakdown(
  level: PerformanceLevel,
  rows: MetricsPerformanceRow[]
): PieSlice[] {
  if (level === 'campaign') {
    return createAdAccountBreakdown(rows);
  }

  if (level === 'adSet') {
    return createCampaignBreakdown(rows);
  }

  return createAdSetBreakdown(rows);
}

function createAdAccountBreakdown(rows: MetricsPerformanceRow[]): PieSlice[] {
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

      const color =
        row.adAccount.platform === 'google'
          ? GOOGLE_ACCOUNT_COLORS[
              googleColorIndex++ % GOOGLE_ACCOUNT_COLORS.length
            ]
          : META_ACCOUNT_COLORS[metaColorIndex++ % META_ACCOUNT_COLORS.length];

      return [
        {
          color,
          label: row.adAccount.name,
          percentage: rows.length === 0 ? 0 : value / rows.length,
          platform: row.adAccount.platform,
          value,
        },
      ];
    })
    .sort((left, right) => right.value - left.value);
}

function createCampaignBreakdown(rows: MetricsPerformanceRow[]): PieSlice[] {
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
      color: CAMPAIGN_COLORS[index % CAMPAIGN_COLORS.length],
      label: campaignName,
      percentage: rows.length === 0 ? 0 : value / rows.length,
      value,
    }))
    .sort((left, right) => right.value - left.value);
}

function createAdSetBreakdown(rows: MetricsPerformanceRow[]): PieSlice[] {
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
      color: CAMPAIGN_COLORS[index % CAMPAIGN_COLORS.length],
      label: adSetName,
      percentage: rows.length === 0 ? 0 : value / rows.length,
      value,
    }))
    .sort((left, right) => right.value - left.value);
}

export function createStatusBreakdown(
  rows: MetricsPerformanceRow[],
  totalRows: number
): PieSlice[] {
  return CAMPAIGN_PERFORMANCE_STATUSES.map((status) => {
    const value = rows.filter((row) => row.status === status).length;

    return {
      color: STATUS_COLORS[status],
      label: toTitleCase(formatCampaignStatus(status)),
      percentage: totalRows === 0 ? 0 : value / totalRows,
      value,
    };
  })
    .filter((slice) => slice.value > 0)
    .sort((left, right) => right.value - left.value);
}
