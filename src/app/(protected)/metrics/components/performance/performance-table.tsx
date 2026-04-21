'use client';

import { performanceDetailRowAtom } from '@/app/(protected)/metrics/atoms';
import { getCampaignPlatformIcon } from '@/app/(protected)/metrics/campaign-performance.utils';
import { PerformanceBreadcrumbTooltip } from '@/app/(protected)/metrics/components/performance/performance-breadcrumb-tooltip';
import {
  getMetricLabel,
  type MetricsPerformanceRow,
} from '@/app/(protected)/metrics/metrics-data';
import {
  formatCampaignStatus,
  getCampaignStatusClassName,
  getLevelLabel,
  getPerformanceRowThumbnail,
  type PerformanceColumnId,
} from '@/app/(protected)/metrics/utils/account-structure';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { CoreMetricId, PerformanceLevel } from '@/mock-data/types';
import { cn } from '@/utils/utils';
import { useSetAtom } from 'jotai';
import { ArrowUpRightIcon } from 'lucide-react';

interface PerformanceTableProps {
  level: PerformanceLevel;
  rows: MetricsPerformanceRow[];
  visibleColumnIds: PerformanceColumnId[];
  visibleMetrics: CoreMetricId[];
}

export const PerformanceTable = ({
  level,
  rows,
  visibleColumnIds,
  visibleMetrics,
}: PerformanceTableProps) => {
  const setSelectedRow = useSetAtom(performanceDetailRowAtom);
  const visibleColumnIdSet = new Set(visibleColumnIds);
  const isStatusVisible = visibleColumnIdSet.has('status');
  const columnCount = 1 + Number(isStatusVisible) + visibleMetrics.length;
  const levelHeading =
    level === 'campaign' ? 'Campaign' : level === 'adSet' ? 'Ad Set' : 'Ad';

  return (
    <div className="dark:bg-muted bg-card overflow-auto rounded-xl border">
      <Table>
        <TableHeader className="dark:bg-card bg-muted">
          <TableRow>
            <TableHead className="dark:bg-card bg-muted md:after:bg-border/80 h-14 min-w-80 px-5 text-sm font-semibold md:sticky md:left-0 md:z-20 md:after:absolute md:after:inset-y-0 md:after:right-0 md:after:w-px">
              {levelHeading}
            </TableHead>
            {isStatusVisible ? (
              <TableHead className="h-14 min-w-40 px-5 text-sm font-semibold">
                Status
              </TableHead>
            ) : null}
            {visibleMetrics.map((metricId) => (
              <TableHead
                key={metricId}
                className="h-14 px-7 text-right text-sm font-semibold"
              >
                {getMetricLabel(metricId)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columnCount}
                className="text-muted-foreground px-5 py-10 text-center text-sm"
              >
                No {getLevelLabel(level)} match the current filters.
              </TableCell>
            </TableRow>
          ) : null}
          {rows.map((row) => {
            const PlatformIcon = getCampaignPlatformIcon(
              row.adAccount.platform
            );

            return (
              <TableRow
                key={row.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedRow(row)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedRow(row);
                  }
                }}
                className="group cursor-pointer"
              >
                <TableCell className="bg-card dark:bg-muted md:after:bg-border/80 group-hover:bg-accent/70 dark:group-hover:bg-accent/40 min-w-80 px-5 py-4 align-top whitespace-normal transition-colors md:sticky md:left-0 md:z-10 md:after:absolute md:after:inset-y-0 md:after:right-0 md:after:w-px">
                  <div
                    className={cn(
                      'space-y-1.5',
                      level === 'ad' && 'flex items-start gap-3 space-y-0'
                    )}
                  >
                    {level === 'ad' ? (
                      <img
                        src={getPerformanceRowThumbnail(row)}
                        alt=""
                        className="size-10 min-w-10 shrink-0 rounded-md object-cover"
                      />
                    ) : null}
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-foreground min-w-0 text-sm font-medium">
                          {row.name}
                        </p>
                        <ArrowUpRightIcon className="text-muted-foreground size-4 shrink-0" />
                      </div>
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        <PlatformIcon className="size-3.5" />
                        <PerformanceBreadcrumbTooltip
                          label={row.adAccount.name}
                        />
                        {row.campaignName ? (
                          <>
                            <span aria-hidden="true">/</span>
                            <PerformanceBreadcrumbTooltip
                              label={row.campaignName}
                            />
                          </>
                        ) : null}
                        {row.adSetName ? (
                          <>
                            <span aria-hidden="true">/</span>
                            <PerformanceBreadcrumbTooltip
                              label={row.adSetName}
                            />
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </TableCell>
                {isStatusVisible ? (
                  <TableCell className="group-hover:bg-accent/70 dark:group-hover:bg-accent/40 min-w-40 px-5 py-4 transition-colors">
                    <Badge
                      variant="outline"
                      className={cn(
                        'capitalize',
                        getCampaignStatusClassName(row.status)
                      )}
                    >
                      {formatCampaignStatus(row.status)}
                    </Badge>
                  </TableCell>
                ) : null}
                {visibleMetrics.map((metricId) => (
                  <TableCell
                    key={metricId}
                    className="group-hover:bg-accent/70 dark:group-hover:bg-accent/40 px-7 py-4 text-right text-sm tabular-nums transition-colors"
                  >
                    {row.metrics[metricId]}
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
