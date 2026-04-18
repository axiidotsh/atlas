'use client';

import {
  campaignPerformanceRowsAtom,
  platformBreakdownVisibleMetricsAtom,
} from '@/app/(protected)/metrics/atoms';
import {
  PLATFORM_BREAKDOWN_METRIC_KEYS,
  PLATFORM_BREAKDOWN_METRIC_LABELS,
  type PlatformBreakdownMetricKey,
} from '@/app/(protected)/metrics/platform-breakdown.config';
import { GoogleAdsLogo, MetaLogo } from '@/components/icons';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { AdPlatform, MockCampaignMetrics } from '@/mock-data/types';
import { useAtomValue } from 'jotai';

const PLATFORM_ORDER: AdPlatform[] = ['meta', 'google'];

type MetricKey = PlatformBreakdownMetricKey;

interface PlatformMetricSummary {
  platform: AdPlatform;
  campaignCount: number;
  impressions: number;
  clicks: number;
  spend: number;
  reach: number;
  revenue: number;
  ctr: number;
  cpc: number;
  roas: number;
}

const compactNumberFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});

const unitCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const PlatformBreakdownGrid = () => {
  const campaignRows = useAtomValue(campaignPerformanceRowsAtom);
  const visibleMetrics = useAtomValue(platformBreakdownVisibleMetricsAtom);
  const platformSummaries = createPlatformSummaries(campaignRows).filter(
    (summary) => summary.campaignCount > 0
  );
  const visibleMetricKeys = PLATFORM_BREAKDOWN_METRIC_KEYS.filter((key) =>
    visibleMetrics.includes(key)
  );

  if (platformSummaries.length === 0 || visibleMetricKeys.length === 0) {
    return null;
  }

  const columnMinWidth = 160;
  const gridTemplate = `minmax(${columnMinWidth}px,1fr) ${platformSummaries
    .map(() => `minmax(${columnMinWidth}px,1fr)`)
    .join(' ')}`;
  const minContentWidth = columnMinWidth * (platformSummaries.length + 1);

  return (
    <Card className="gap-4">
      <ScrollArea>
        <div style={{ minWidth: minContentWidth }}>
          <CardHeader>
            <div
              className="grid items-center gap-4 px-2"
              style={{ gridTemplateColumns: gridTemplate }}
            >
              <span className="text-muted-foreground text-sm font-medium">
                Metric
              </span>
              {platformSummaries.map((summary) => {
                const PlatformIcon =
                  summary.platform === 'meta' ? MetaLogo : GoogleAdsLogo;

                return (
                  <div
                    key={summary.platform}
                    className="flex items-center gap-2"
                  >
                    <PlatformIcon className="size-4" />
                    <span className="text-sm font-medium">
                      {formatPlatformName(summary.platform)}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardHeader>
          <CardContent>
            <div className="px-2">
              {visibleMetricKeys.map((key, index) => (
                <div key={key}>
                  {index > 0 ? <Separator /> : null}
                  <div
                    className="grid items-center gap-4 py-3"
                    style={{ gridTemplateColumns: gridTemplate }}
                  >
                    <p className="text-muted-foreground text-sm">
                      {PLATFORM_BREAKDOWN_METRIC_LABELS[key]}
                    </p>
                    {platformSummaries.map((summary) => (
                      <p
                        key={summary.platform}
                        className="text-sm font-semibold tabular-nums"
                      >
                        {formatMetric(key, summary[key])}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </div>
      </ScrollArea>
    </Card>
  );
};

function createPlatformSummaries(
  campaignRows: Array<{
    adAccount: {
      platform: AdPlatform;
    };
    metrics: MockCampaignMetrics;
  }>
) {
  const platformMap = new Map<AdPlatform, PlatformMetricSummary>(
    PLATFORM_ORDER.map((platform) => [
      platform,
      {
        platform,
        campaignCount: 0,
        impressions: 0,
        clicks: 0,
        spend: 0,
        reach: 0,
        revenue: 0,
        ctr: 0,
        cpc: 0,
        roas: 0,
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
        platform,
        campaignCount: 0,
        impressions: 0,
        clicks: 0,
        spend: 0,
        reach: 0,
        revenue: 0,
        ctr: 0,
        cpc: 0,
        roas: 0,
      };
    }

    return {
      ...summary,
      ctr:
        summary.impressions === 0
          ? 0
          : (summary.clicks / summary.impressions) * 100,
      cpc: summary.clicks === 0 ? 0 : summary.spend / summary.clicks,
      roas: summary.spend === 0 ? 0 : summary.revenue / summary.spend,
    };
  });
}

function formatMetric(key: MetricKey, value: number) {
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

function parseMetricValue(value: string) {
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

function formatPlatformName(platform: AdPlatform) {
  return platform === 'meta' ? 'Meta Ads' : 'Google Ads';
}
