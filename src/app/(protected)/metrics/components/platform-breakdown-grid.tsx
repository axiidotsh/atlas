'use client';

import { campaignPerformanceRowsAtom } from '@/app/(protected)/metrics/atoms';
import { GoogleAdsLogo, MetaLogo } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { AdPlatform, MockCampaignMetrics } from '@/mock-data/types';
import { useAtomValue } from 'jotai';

const PLATFORM_ORDER: AdPlatform[] = ['meta', 'google'];

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

interface PlatformMetricItem {
  label: string;
  value: string;
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
  const platformSummaries = createPlatformSummaries(campaignRows);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {platformSummaries.map((summary) => {
        const PlatformIcon =
          summary.platform === 'meta' ? MetaLogo : GoogleAdsLogo;

        return (
          <Card key={summary.platform} className="gap-4">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-4">
                  <PlatformIcon className="size-5" />
                  <div className="space-y-1">
                    <CardTitle className="text-sm">
                      {formatPlatformName(summary.platform)}
                    </CardTitle>
                  </div>
                </div>
                <Badge variant="outline" className="bg-input">
                  {summary.campaignCount}{' '}
                  {summary.campaignCount === 1 ? 'campaign' : 'campaigns'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="px-2">
                {getMetricItems(summary).map((metric, index) => (
                  <div key={metric.label}>
                    {index > 0 ? <Separator /> : null}
                    <div className="flex items-center justify-between gap-4 py-3">
                      <p className="text-muted-foreground text-sm">
                        {metric.label}
                      </p>
                      <p className="text-sm font-semibold tabular-nums">
                        {metric.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
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

function getMetricItems(summary: PlatformMetricSummary): PlatformMetricItem[] {
  return [
    {
      label: 'Impressions',
      value: formatCompactNumber(summary.impressions),
    },
    {
      label: 'Clicks',
      value: formatCompactNumber(summary.clicks),
    },
    {
      label: 'Spend',
      value: formatCompactCurrency(summary.spend),
    },
    {
      label: 'Reach',
      value: formatCompactNumber(summary.reach),
    },
    {
      label: 'Revenue',
      value: formatCompactCurrency(summary.revenue),
    },
    {
      label: 'CTR',
      value: formatPercent(summary.ctr),
    },
    {
      label: 'CPC',
      value: formatUnitCurrency(summary.cpc),
    },
    {
      label: 'ROAS',
      value: formatMultiplier(summary.roas),
    },
  ];
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

function formatCompactNumber(value: number) {
  return compactNumberFormatter.format(value);
}

function formatCompactCurrency(value: number) {
  return compactCurrencyFormatter.format(value);
}

function formatUnitCurrency(value: number) {
  return unitCurrencyFormatter.format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

function formatMultiplier(value: number) {
  return `${value.toFixed(2)}x`;
}
