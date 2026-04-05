'use client';

import { formatCampaignStatus } from '@/app/(protected)/metrics/campaign-performance.config';
import {
  AD_SET_PERFORMANCE_ROWS,
  CAMPAIGN_PERFORMANCE_ROWS,
  type MetricsPerformanceRow,
} from '@/app/(protected)/metrics/metrics-data';
import { MetricsLevelToggle } from '@/app/(protected)/metrics/components/metrics-level-toggle';
import { MetricsChartCard } from '@/app/(protected)/metrics/components/metrics-chart-card';
import { GoogleAdsLogo, MetaLogo } from '@/components/icons';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { AdPlatform, CampaignStatus, PerformanceLevel } from '@/mock-data/types';
import { useState } from 'react';
import { Cell, Pie, PieChart } from 'recharts';

const META_ACCOUNT_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
] as const;

const GOOGLE_ACCOUNT_COLORS = [
  '#fbbc04',
  '#34a853',
] as const;

const CAMPAIGN_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--primary)',
] as const;

const STATUS_COLORS: Record<CampaignStatus, string> = {
  ACTIVE: 'var(--primary)',
  PAUSED: 'var(--muted-foreground)',
  WITH_ISSUES: 'var(--destructive)',
  ENDED: 'var(--chart-4)',
};

interface BreakdownDatum {
  id: string;
  label: string;
  value: number;
  fill: string;
  percentage: number;
  platform?: AdPlatform;
}

export const MetricsStructureSection = () => {
  const [level, setLevel] = useState<PerformanceLevel>('campaign');

  const rows =
    level === 'campaign' ? CAMPAIGN_PERFORMANCE_ROWS : AD_SET_PERFORMANCE_ROWS;
  const totalRows = rows.length;
  const compositionBreakdown: BreakdownDatum[] =
    level === 'campaign'
      ? createAdAccountBreakdown(rows, totalRows)
      : createCampaignBreakdown(rows, totalRows);
  const statusBreakdown = createStatusBreakdown(rows, totalRows);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <h2 className="text-xl font-semibold">Structure</h2>
        <MetricsLevelToggle value={level} onValueChange={setLevel} />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <MetricsChartCard
          title={
            level === 'campaign'
              ? 'Campaigns by Ad Account'
              : 'Ad Sets by Campaign'
          }
          description={
            level === 'campaign'
              ? 'See how campaign volume is distributed across connected ad accounts.'
              : 'See which campaigns are carrying the largest ad set footprint right now.'
          }
          summary={String(totalRows)}
          summaryLabel={
            level === 'campaign'
              ? 'Total campaigns in the current breakdown'
              : 'Total ad sets in the current breakdown'
          }
        >
          <BreakdownPieCard
            data={compositionBreakdown}
            config={createChartConfig(compositionBreakdown)}
          />
        </MetricsChartCard>
        <MetricsChartCard
          title={level === 'campaign' ? 'Campaigns by Status' : 'Ad Sets by Status'}
          description={
            level === 'campaign'
              ? 'Track the current campaign mix across active, paused, ended, and issue states.'
              : 'Track the current ad set mix across active, paused, ended, and issue states.'
          }
          summary={String(totalRows)}
          summaryLabel={
            level === 'campaign'
              ? 'Total campaigns in the current breakdown'
              : 'Total ad sets in the current breakdown'
          }
        >
          <BreakdownPieCard
            data={statusBreakdown}
            config={createChartConfig(statusBreakdown)}
          />
        </MetricsChartCard>
      </div>
    </section>
  );
};

interface BreakdownPieCardProps {
  data: BreakdownDatum[];
  config: ChartConfig;
}

const BreakdownPieCard = ({ data, config }: BreakdownPieCardProps) => {
  return (
    <div className="flex flex-col items-center gap-5 pb-3">
      <ChartContainer className="mx-auto aspect-square h-56" config={config}>
        <PieChart accessibilityLayer>
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                nameKey="id"
                formatter={(_value, _name, item) => {
                  const slice = item.payload as BreakdownDatum;

                  return (
                    <div className="flex min-w-36 items-center justify-between gap-4">
                      <div className="text-muted-foreground flex items-center gap-2">
                        <BreakdownLabel slice={slice} />
                      </div>
                      <span className="font-mono font-medium text-foreground tabular-nums">
                        {slice.value} ({formatPercentage(slice.percentage)})
                      </span>
                    </div>
                  );
                }}
              />
            }
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="id"
            innerRadius={58}
            outerRadius={82}
            paddingAngle={3}
            strokeWidth={0}
          >
            {data.map((slice) => (
              <Cell key={slice.id} fill={slice.fill} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>

      <div className="flex w-full max-w-xs flex-col items-center gap-2">
        {data.map((slice) => (
          <div
            key={slice.id}
            className="text-muted-foreground flex w-full items-center justify-between gap-4 text-xs"
          >
            <div className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: slice.fill }}
              />
              <BreakdownLabel slice={slice} />
            </div>
            <p className="tabular-nums">
              {slice.value} ({formatPercentage(slice.percentage)})
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

interface BreakdownLabelProps {
  slice: BreakdownDatum;
}

const BreakdownLabel = ({ slice }: BreakdownLabelProps) => {
  if (slice.platform === 'meta') {
    return (
      <>
        <MetaLogo className="h-3 w-auto" />
        <span className="truncate">{slice.label}</span>
      </>
    );
  }

  if (slice.platform === 'google') {
    return (
      <>
        <GoogleAdsLogo className="h-4 w-auto" />
        <span className="truncate">{slice.label}</span>
      </>
    );
  }

  return <span className="truncate">{slice.label}</span>;
};

function createAdAccountBreakdown(
  rows: MetricsPerformanceRow[],
  totalRows: number
) {
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

function createCampaignBreakdown(rows: MetricsPerformanceRow[], totalRows: number) {
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

function createStatusBreakdown(rows: MetricsPerformanceRow[], totalRows: number) {
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

function createChartConfig(data: BreakdownDatum[]) {
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

function formatPercentage(value: number) {
  return `${value.toFixed(value >= 10 ? 0 : 1)}%`;
}

function toTitleCase(value: string) {
  return value.replace(/\b\w/g, (character) => character.toUpperCase());
}
