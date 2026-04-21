'use client';

import { CreativeDetailSheet } from '@/app/(protected)/metrics/components/creative/creative-detail-sheet';
import { formatCampaignStatus } from '@/app/(protected)/metrics/config/campaign-performance.config';
import type { CreativeInsightRow } from '@/app/(protected)/metrics/metrics-data';
import { getCreativeThumbnail } from '@/app/(protected)/metrics/utils/creative-insights';
import { GoogleAdsLogo, MetaLogo } from '@/components/icons';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import type { CoreMetricId } from '@/mock-data/types';
import { cn } from '@/utils/utils';
import { useState } from 'react';

interface CreativeListCardProps {
  title: string;
  description: string;
  creatives: CreativeInsightRow[];
  selectedMetricId: CoreMetricId;
  tone: 'top' | 'bottom';
}

export const CreativeListCard = ({
  title,
  description,
  creatives,
  selectedMetricId,
  tone,
}: CreativeListCardProps) => {
  return (
    <Card className="gap-4">
      <CardHeader>
        <div className="space-y-1">
          <CardTitle className="text-sm">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {creatives.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No creative performance data is available right now.
          </p>
        ) : (
          <Table>
            <TableBody>
              {creatives.map((creative) => (
                <CreativeTableRow
                  key={creative.id}
                  creative={creative}
                  selectedMetricId={selectedMetricId}
                  tone={tone}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

interface CreativeTableRowProps {
  creative: CreativeInsightRow;
  selectedMetricId: CoreMetricId;
  tone: 'top' | 'bottom';
}

const CreativeTableRow = ({
  creative,
  selectedMetricId,
  tone,
}: CreativeTableRowProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const thumbnailSrc = getCreativeThumbnail(creative.previewMedia);
  const statusLabel = formatCampaignStatus(creative.status);

  return (
    <CreativeDetailSheet
      creative={creative}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <TableRow
        onClick={() => setIsOpen(true)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
        tabIndex={0}
        className="focus-visible:bg-muted/50 cursor-pointer focus-visible:outline-none"
        aria-label={`Open ${creative.name}`}
      >
        <TableCell>
          <div className="flex items-center gap-3">
            <img
              src={thumbnailSrc}
              alt=""
              className="size-10 min-w-10 shrink-0 rounded-md object-cover"
            />
            <div className="min-w-0 space-y-1">
              <p className="truncate text-sm font-medium">{creative.name}</p>
              <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                {creative.adAccount.platform === 'google' ? (
                  <GoogleAdsLogo className="size-3" />
                ) : (
                  <MetaLogo className="size-3" />
                )}
                <span className="truncate">{creative.adAccount.name}</span>
                <span aria-hidden="true">/</span>
                <span className="capitalize">{statusLabel}</span>
              </div>
            </div>
          </div>
        </TableCell>
        <TableCell className="text-right">
          <p
            className={cn(
              'text-sm font-medium tabular-nums',
              tone === 'bottom' && 'text-destructive dark:text-red-300'
            )}
          >
            {creative.metrics[selectedMetricId]}
          </p>
        </TableCell>
      </TableRow>
    </CreativeDetailSheet>
  );
};
