'use client';

import {
  campaignPerformanceVisibleColumnsAtom,
  filteredCampaignPerformanceRowsAtom,
} from '@/app/(protected)/metrics/atoms';
import { formatCampaignStatus } from '@/app/(protected)/metrics/campaign-performance.config';
import { GoogleAdsLogo, MetaLogo } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MOCK_METRICS } from '@/mock-data/metrics';
import type { AdPlatform, CampaignStatus } from '@/mock-data/types';
import { cn } from '@/utils/utils';
import { useAtomValue } from 'jotai';

function getPlatformIcon(platform: AdPlatform) {
  return platform === 'google' ? GoogleAdsLogo : MetaLogo;
}

function getStatusClassName(status: CampaignStatus) {
  if (status === 'ACTIVE') {
    return 'border-primary/20 bg-primary/10 text-primary';
  }

  if (status === 'WITH_ISSUES') {
    return 'border-destructive/20 bg-destructive/10 text-destructive';
  }

  if (status === 'PAUSED') {
    return 'border-border bg-muted text-muted-foreground';
  }

  return 'border-border bg-secondary text-secondary-foreground';
}

export const CampaignPerformanceTable = () => {
  const campaigns = useAtomValue(filteredCampaignPerformanceRowsAtom);
  const visibleColumnIds = useAtomValue(campaignPerformanceVisibleColumnsAtom);

  const visibleColumnIdSet = new Set(visibleColumnIds);
  const isAdAccountVisible = visibleColumnIdSet.has('adAccount');
  const isStatusVisible = visibleColumnIdSet.has('status');
  const visibleMetrics = MOCK_METRICS.filter((metric) =>
    visibleColumnIdSet.has(metric.id)
  );

  const columnCount =
    1 +
    Number(isAdAccountVisible) +
    Number(isStatusVisible) +
    visibleMetrics.length;

  return (
    <div className="dark:bg-muted bg-card overflow-hidden rounded-xl border">
      <Table>
        <TableHeader className="dark:bg-card bg-muted">
          <TableRow>
            <TableHead className="dark:bg-card bg-muted md:after:bg-border/80 h-14 min-w-80 px-5 text-sm font-semibold md:sticky md:left-0 md:z-20 md:after:absolute md:after:inset-y-0 md:after:right-0 md:after:w-px">
              Campaign
            </TableHead>
            {isAdAccountVisible ? (
              <TableHead className="h-14 min-w-64 px-5 text-sm font-semibold">
                Ad Account
              </TableHead>
            ) : null}
            {isStatusVisible ? (
              <TableHead className="h-14 min-w-40 px-5 text-sm font-semibold">
                Status
              </TableHead>
            ) : null}
            {visibleMetrics.map((metric) => (
              <TableHead
                key={metric.id}
                className="h-14 px-7 text-right text-sm font-semibold"
              >
                {metric.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columnCount}
                className="text-muted-foreground px-5 py-10 text-center text-sm"
              >
                No campaigns match the current filters.
              </TableCell>
            </TableRow>
          ) : null}
          {campaigns.map((campaign) => {
            const PlatformIcon = getPlatformIcon(campaign.adAccount.platform);

            return (
              <TableRow key={campaign.id} className="group">
                <TableCell className="bg-card group-hover:bg-muted dark:bg-muted dark:group-hover:bg-muted md:after:bg-border/80 min-w-80 px-5 py-4 align-top whitespace-normal md:sticky md:left-0 md:z-10 md:after:absolute md:after:inset-y-0 md:after:right-0 md:after:w-px">
                  <div className="space-y-1.5">
                    <p className="text-foreground text-sm font-medium">
                      {campaign.name}
                    </p>
                    <p className="text-muted-foreground text-[11px] tracking-[0.02em]">
                      {campaign.id}
                    </p>
                  </div>
                </TableCell>
                {isAdAccountVisible ? (
                  <TableCell className="min-w-64 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <PlatformIcon
                        className={cn(
                          'w-auto',
                          campaign.adAccount.platform === 'google'
                            ? 'h-4'
                            : 'h-3'
                        )}
                      />
                      <p className="text-foreground text-sm font-medium">
                        {campaign.adAccount.name}
                      </p>
                    </div>
                  </TableCell>
                ) : null}
                {isStatusVisible ? (
                  <TableCell className="min-w-40 px-5 py-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        'capitalize',
                        getStatusClassName(campaign.status)
                      )}
                    >
                      {formatCampaignStatus(campaign.status)}
                    </Badge>
                  </TableCell>
                ) : null}
                {visibleMetrics.map((metric) => (
                  <TableCell
                    key={metric.id}
                    className="px-7 py-4 text-right text-sm tabular-nums"
                  >
                    {campaign.metrics[metric.id]}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
