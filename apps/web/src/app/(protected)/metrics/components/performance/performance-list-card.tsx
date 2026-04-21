'use client';

import { performanceDetailRowAtom } from '@/app/(protected)/metrics/atoms';
import { getCampaignPlatformIcon } from '@/app/(protected)/metrics/campaign-performance.utils';
import { PerformanceBreadcrumbTooltip } from '@/app/(protected)/metrics/components/performance/performance-breadcrumb-tooltip';
import {
  getMetricLabel,
  getPerformanceRows,
} from '@/app/(protected)/metrics/metrics-data';
import {
  comparePerformanceRows,
  formatCampaignStatus,
  getPerformanceRowThumbnail,
} from '@/app/(protected)/metrics/utils/account-structure';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MOCK_METRICS } from '@/mock-data/metrics';
import type { CoreMetricId, PerformanceLevel } from '@/mock-data/types';
import { cn } from '@/utils/utils';
import { useSetAtom } from 'jotai';
import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';

const DISPLAY_LIMIT = 5;

interface PerformanceListCardProps {
  level: PerformanceLevel;
  tone: 'top' | 'bottom';
}

export const PerformanceListCard = ({
  level,
  tone,
}: PerformanceListCardProps) => {
  const [selectedMetricId, setSelectedMetricId] =
    useState<CoreMetricId>('roas');
  const setSelectedRow = useSetAtom(performanceDetailRowAtom);
  const rows = getPerformanceRows(level);
  const rankedRows = [...rows].sort((leftRow, rightRow) =>
    comparePerformanceRows(leftRow, rightRow, selectedMetricId)
  );
  const displayRows =
    tone === 'top'
      ? rankedRows.slice(0, DISPLAY_LIMIT)
      : rankedRows.slice(-DISPLAY_LIMIT).reverse();
  const title = tone === 'top' ? 'Top Performers' : 'Bottom Performers';

  return (
    <Card className="gap-4">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-muted-foreground text-sm">
            {title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground h-7 text-xs"
              >
                {getMetricLabel(selectedMetricId)}
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 min-w-48">
              <DropdownMenuLabel>Performance Metric</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={selectedMetricId}
                onValueChange={(value) =>
                  setSelectedMetricId(value as CoreMetricId)
                }
              >
                {MOCK_METRICS.map((metric) => (
                  <DropdownMenuRadioItem key={metric.id} value={metric.id}>
                    {metric.title}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {displayRows.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No performance data is available right now.
          </p>
        ) : (
          <div className="px-2">
            {displayRows.map((row, index) => {
              const PlatformIcon = getCampaignPlatformIcon(
                row.adAccount.platform
              );

              return (
                <div key={row.id}>
                  {index > 0 ? <div className="bg-border h-px w-full" /> : null}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedRow(row)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedRow(row);
                      }
                    }}
                    className="hover:bg-accent/70 dark:hover:bg-accent/40 -mx-5 flex cursor-pointer items-center justify-between gap-6 rounded-xl px-5 py-3 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        {level === 'ad' ? (
                          <img
                            src={getPerformanceRowThumbnail(row)}
                            alt=""
                            className="size-10 min-w-10 shrink-0 rounded-md object-cover"
                          />
                        ) : null}
                        <div className="min-w-0 space-y-1">
                          <p className="truncate text-sm font-medium">
                            {row.name}
                          </p>
                          <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                            <PlatformIcon className="size-3" />
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
                            <span aria-hidden="true">/</span>
                            <span className="shrink-0 whitespace-nowrap capitalize">
                              {formatCampaignStatus(row.status)}
                            </span>
                          </div>
                        </div>
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
                        {row.metrics[selectedMetricId]}
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
