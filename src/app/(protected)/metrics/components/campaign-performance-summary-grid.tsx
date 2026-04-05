'use client';

import { campaignPerformanceRowsAtom } from '@/app/(protected)/metrics/atoms';
import type { CampaignPerformanceRow } from '@/app/(protected)/metrics/campaign-performance.config';
import { formatCampaignStatus } from '@/app/(protected)/metrics/campaign-performance.config';
import {
  getCampaignPlatformIcon,
  parseCampaignMetricValue,
} from '@/app/(protected)/metrics/campaign-performance.utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MOCK_METRICS } from '@/mock-data/metrics';
import type { CoreMetricId } from '@/mock-data/types';
import { cn } from '@/utils/utils';
import { useAtomValue } from 'jotai';

const DISPLAY_LIMIT = 3;

interface CampaignPerformanceSummaryGridProps {
  selectedMetricId: CoreMetricId;
}

export const CampaignPerformanceSummaryGrid = ({
  selectedMetricId,
}: CampaignPerformanceSummaryGridProps) => {
  const campaigns = useAtomValue(campaignPerformanceRowsAtom);
  const selectedMetric = MOCK_METRICS.find(
    (metric) => metric.id === selectedMetricId
  );
  const metricLabel = selectedMetric?.title ?? 'ROAS';
  const rankedCampaigns = [...campaigns].sort((leftCampaign, rightCampaign) =>
    compareCampaignPerformance(leftCampaign, rightCampaign, selectedMetricId)
  );
  const topCampaigns = rankedCampaigns.slice(0, DISPLAY_LIMIT);
  const topCampaignIds = new Set(topCampaigns.map((campaign) => campaign.id));
  const bottomCampaigns =
    rankedCampaigns.length <= DISPLAY_LIMIT
      ? [...rankedCampaigns].reverse()
      : [...rankedCampaigns]
          .reverse()
          .filter((campaign) => !topCampaignIds.has(campaign.id))
          .slice(0, DISPLAY_LIMIT);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <CampaignPerformanceListCard
        title="Top Performers"
        description={`Highest ${metricLabel} across all campaigns`}
        campaigns={topCampaigns}
        metricLabel={metricLabel}
        selectedMetricId={selectedMetricId}
        tone="top"
      />
      <CampaignPerformanceListCard
        title="Bottom Performers"
        description={`Lowest ${metricLabel} across all campaigns`}
        campaigns={bottomCampaigns}
        metricLabel={metricLabel}
        selectedMetricId={selectedMetricId}
        tone="bottom"
      />
    </div>
  );
};

interface CampaignPerformanceListCardProps {
  title: string;
  description: string;
  campaigns: CampaignPerformanceRow[];
  metricLabel: string;
  selectedMetricId: CoreMetricId;
  tone: 'top' | 'bottom';
}

const CampaignPerformanceListCard = ({
  title,
  description,
  campaigns,
  metricLabel,
  selectedMetricId,
  tone,
}: CampaignPerformanceListCardProps) => {
  return (
    <Card className="gap-4">
      <CardHeader>
        <div className="space-y-1">
          <CardTitle className="text-sm">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {campaigns.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No campaign performance data is available right now.
          </p>
        ) : (
          <div className="px-2">
            {campaigns.map((campaign, index) => {
              const PlatformIcon = getCampaignPlatformIcon(
                campaign.adAccount.platform
              );

              return (
                <div key={campaign.id}>
                  {index > 0 ? <Separator /> : null}
                  <div className="flex items-center justify-between gap-6 py-3">
                    <div className="min-w-0 space-y-1">
                      <p className="truncate text-sm font-medium">
                        {campaign.name}
                      </p>
                      <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <PlatformIcon className="size-3" />
                        <span className="truncate">
                          {campaign.adAccount.name}
                        </span>
                        <span aria-hidden="true">/</span>
                        <span className="capitalize">
                          {formatCampaignStatus(campaign.status)}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p
                        className={cn(
                          'text-sm font-medium tabular-nums',
                          tone === 'bottom' &&
                            'text-destructive dark:text-red-300'
                        )}
                      >
                        {campaign.metrics[selectedMetricId]}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {metricLabel}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

function compareCampaignPerformance(
  leftCampaign: CampaignPerformanceRow,
  rightCampaign: CampaignPerformanceRow,
  selectedMetricId: CoreMetricId
) {
  const metricDifference =
    parseCampaignMetricValue(rightCampaign.metrics[selectedMetricId]) -
    parseCampaignMetricValue(leftCampaign.metrics[selectedMetricId]);

  if (metricDifference !== 0) {
    return metricDifference;
  }

  return (
    parseCampaignMetricValue(rightCampaign.metrics.revenue) -
    parseCampaignMetricValue(leftCampaign.metrics.revenue)
  );
}
