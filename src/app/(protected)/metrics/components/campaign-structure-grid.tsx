'use client';

import { campaignPerformanceRowsAtom } from '@/app/(protected)/metrics/atoms';
import {
  CAMPAIGN_PERFORMANCE_STATUSES,
  formatCampaignStatus,
} from '@/app/(protected)/metrics/campaign-performance.config';
import { MetricsChartCard } from '@/app/(protected)/metrics/components/metrics-chart-card';
import { GoogleAdsLogo, MetaLogo } from '@/components/icons';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { MOCK_AD_ACCOUNTS } from '@/mock-data/ad-data';
import type { AdPlatform, CampaignStatus } from '@/mock-data/types';
import { useAtomValue } from 'jotai';
import { Cell, Pie, PieChart } from 'recharts';

const META_ACCOUNT_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
] as const;

const GOOGLE_ACCOUNT_COLORS = [
  '#fbbc04',
  '#34a853',
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

export const CampaignStructureGrid = () => {
  const campaignRows = useAtomValue(campaignPerformanceRowsAtom);
  const totalCampaigns = campaignRows.length;
  const adAccountBreakdown = createAdAccountBreakdown(
    campaignRows,
    totalCampaigns
  );
  const statusBreakdown = createStatusBreakdown(campaignRows, totalCampaigns);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <MetricsChartCard
        title="Campaigns by Ad Account"
        description="See how the campaign footprint is distributed across connected ad accounts."
        summary={String(totalCampaigns)}
        summaryLabel="Total campaigns in the current breakdown"
      >
        <BreakdownPieCard
          data={adAccountBreakdown}
          config={createChartConfig(adAccountBreakdown)}
        />
      </MetricsChartCard>

      <MetricsChartCard
        title="Campaigns by Status"
        description="Track the current campaign mix across active, paused, ended and issue states."
        summary={String(totalCampaigns)}
        summaryLabel="Total campaigns in the current breakdown"
      >
        <BreakdownPieCard
          data={statusBreakdown}
          config={createChartConfig(statusBreakdown)}
        />
      </MetricsChartCard>
    </div>
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

function createAdAccountBreakdown(
  campaignRows: Array<{
    adAccount: {
      id: string;
    };
  }>,
  totalCampaigns: number
) {
  const campaignCountsByAdAccount = new Map(
    MOCK_AD_ACCOUNTS.map((adAccount) => [adAccount.id, 0])
  );
  let metaColorIndex = 0;
  let googleColorIndex = 0;

  campaignRows.forEach((campaign) => {
    campaignCountsByAdAccount.set(
      campaign.adAccount.id,
      (campaignCountsByAdAccount.get(campaign.adAccount.id) ?? 0) + 1
    );
  });

  return MOCK_AD_ACCOUNTS.map((adAccount) => {
    const value = campaignCountsByAdAccount.get(adAccount.id) ?? 0;
    const fill =
      adAccount.platform === 'google'
        ? GOOGLE_ACCOUNT_COLORS[googleColorIndex++ % GOOGLE_ACCOUNT_COLORS.length]
        : META_ACCOUNT_COLORS[metaColorIndex++ % META_ACCOUNT_COLORS.length];

    return {
      id: adAccount.id,
      label: adAccount.name,
      value,
      fill,
      percentage: totalCampaigns === 0 ? 0 : (value / totalCampaigns) * 100,
      platform: adAccount.platform,
    };
  })
    .filter((item) => item.value > 0)
    .sort((left, right) => right.value - left.value);
}

function createStatusBreakdown(
  campaignRows: Array<{
    adAccount: {
      id: string;
    };
    status: CampaignStatus;
  }>,
  totalCampaigns: number
) {
  const statusCounts = new Map<CampaignStatus, number>(
    CAMPAIGN_PERFORMANCE_STATUSES.map((status) => [status, 0])
  );

  campaignRows.forEach((campaign) => {
    statusCounts.set(campaign.status, (statusCounts.get(campaign.status) ?? 0) + 1);
  });

  return CAMPAIGN_PERFORMANCE_STATUSES.map((status) => {
    const value = statusCounts.get(status) ?? 0;

    return {
      id: status,
      label: toTitleCase(formatCampaignStatus(status)),
      value,
      fill: STATUS_COLORS[status],
      percentage: totalCampaigns === 0 ? 0 : (value / totalCampaigns) * 100,
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

interface BreakdownLabelProps {
  slice: BreakdownDatum;
}

const BreakdownLabel = ({ slice }: BreakdownLabelProps) => {
  if (!slice.platform) {
    return <span>{slice.label}</span>;
  }

  const PlatformIcon = slice.platform === 'meta' ? MetaLogo : GoogleAdsLogo;

  return (
    <>
      <PlatformIcon
        className={slice.platform === 'meta' ? 'h-2.5 w-auto' : 'h-3 w-auto'}
      />
      <span>{slice.label}</span>
    </>
  );
};

function toTitleCase(value: string) {
  return value.replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatPercentage(value: number) {
  return `${value.toFixed(1)}%`;
}
