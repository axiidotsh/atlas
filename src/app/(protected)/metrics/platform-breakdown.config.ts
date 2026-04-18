export const PLATFORM_BREAKDOWN_METRIC_KEYS = [
  'impressions',
  'clicks',
  'spend',
  'reach',
  'revenue',
  'ctr',
  'cpc',
  'roas',
] as const;

export type PlatformBreakdownMetricKey =
  (typeof PLATFORM_BREAKDOWN_METRIC_KEYS)[number];

export const PLATFORM_BREAKDOWN_METRIC_LABELS: Record<
  PlatformBreakdownMetricKey,
  string
> = {
  impressions: 'Impressions',
  clicks: 'Clicks',
  spend: 'Spend',
  reach: 'Reach',
  revenue: 'Revenue',
  ctr: 'CTR',
  cpc: 'CPC',
  roas: 'ROAS',
};
