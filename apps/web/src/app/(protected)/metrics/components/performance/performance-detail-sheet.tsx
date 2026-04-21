'use client';

import { performanceDetailRowAtom } from '@/app/(protected)/metrics/atoms';
import {
  CREATIVE_INSIGHT_ROWS,
  type CreativeInsightRow,
  type MetricsPerformanceRow,
} from '@/app/(protected)/metrics/metrics-data';
import {
  formatCampaignStatus,
  getCampaignStatusClassName,
  getPerformanceDetailsCardTitle,
  getPerformanceItemLabel,
  getPerformanceItemSheetDescription,
  toTitleCase,
  type DetailRow,
} from '@/app/(protected)/metrics/utils/account-structure';
import { GoogleAdsLogo, MetaLogo } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { MOCK_METRICS } from '@/mock-data/metrics';
import type { AdPlatform } from '@/mock-data/types';
import { cn } from '@/utils/utils';
import { useAtom } from 'jotai';
import { ImageIcon, PlayIcon } from 'lucide-react';

const creativeInsightRowsById = new Map(
  CREATIVE_INSIGHT_ROWS.map((creative) => [creative.id, creative])
);

export const PerformanceDetailSheet = () => {
  const [row, setRow] = useAtom(performanceDetailRowAtom);

  if (!row) {
    return null;
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setRow(null);
    }
  }

  const creative =
    row.level === 'ad' ? creativeInsightRowsById.get(row.id) : null;
  const sheetDescription = getPerformanceItemSheetDescription(row.level);
  const contextRows = buildContextRows(row, creative);
  const metricRows = buildMetricRows(row, creative);
  const adCopyRows = creative ? buildAdCopyRows(creative) : [];

  return (
    <Sheet open onOpenChange={handleOpenChange}>
      <SheetContent
        className="bg-background w-full gap-0 data-[side=right]:w-screen sm:data-[side=right]:w-[min(96vw,1120px)] sm:data-[side=right]:max-w-[1120px]"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <SheetHeader className="border-b pr-14">
          <SheetTitle>{row.name}</SheetTitle>
          <SheetDescription>{sheetDescription}</SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-auto">
          <div className="space-y-6 p-4 sm:p-6">
            <DetailRowsCard
              title={getPerformanceDetailsCardTitle(row.level)}
              description={`Structure, status, and hierarchy for this ${getPerformanceItemLabel(
                row.level
              )}.`}
              rows={contextRows}
            />
            <DetailRowsCard
              title="Metrics"
              description={`Current performance metrics for this ${getPerformanceItemLabel(
                row.level
              )}.`}
              rows={metricRows}
            />
            {creative ? (
              <DetailRowsCard
                title="Ad Copy"
                description="Copy and messaging used in this ad."
                rows={adCopyRows}
              />
            ) : null}
            {creative ? (
              <Card className="gap-4 py-5">
                <CardHeader className="px-5">
                  <div className="space-y-1">
                    <CardTitle className="text-sm">Ad Gallery</CardTitle>
                    <CardDescription>
                      Assets used in this ad creative.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="px-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {creative.media.map((media) => (
                      <MediaDetail
                        key={media.id}
                        media={media}
                        title={media.title}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface DetailRowsCardProps {
  title: string;
  description: string;
  rows: DetailRow[];
}

const DetailRowsCard = ({ title, description, rows }: DetailRowsCardProps) => {
  const gridTemplate = 'minmax(160px,0.45fr) minmax(0,1fr)';

  return (
    <Card className="gap-4 py-5">
      <CardHeader className="px-5">
        <div className="space-y-1">
          <CardTitle className="text-sm">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-5">
        <div className="px-2">
          {rows.map((detailRow, index) => (
            <div key={`${detailRow.label}-${index}`}>
              {index > 0 ? <Separator /> : null}
              <div
                className="grid items-start gap-4 py-3"
                style={{ gridTemplateColumns: gridTemplate }}
              >
                <p className="text-muted-foreground text-sm">
                  {detailRow.label}
                </p>
                <div className="text-sm leading-6 break-words">
                  {detailRow.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface MediaDetailProps {
  media: CreativeInsightRow['media'][number];
  title: string;
}

const MediaDetail = ({ media, title }: MediaDetailProps) => {
  return (
    <div className="group relative h-56 overflow-hidden rounded-xl">
      <div className="absolute inset-0 z-10 bg-linear-to-b from-black/5 via-transparent to-black/70" />
      <div className="absolute inset-x-0 bottom-0 z-20 p-4 text-white">
        <div className="flex items-center gap-2">
          {media.type === 'video' ? (
            <PlayIcon className="size-4 fill-current" />
          ) : (
            <ImageIcon className="size-4" />
          )}
          <p className="truncate text-sm font-medium">{title}</p>
        </div>
      </div>
      <div className="bg-muted size-full">
        {media.type === 'video' ? (
          <video
            src={media.src}
            poster={media.posterSrc}
            className="size-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          <img src={media.src} alt={title} className="size-full object-cover" />
        )}
      </div>
    </div>
  );
};

const AdAccountPlatformIcon = ({ platform }: { platform: AdPlatform }) => {
  return platform === 'google' ? (
    <GoogleAdsLogo className="h-4 w-auto" />
  ) : (
    <MetaLogo className="h-3 w-auto" />
  );
};

function buildContextRows(
  row: MetricsPerformanceRow,
  creative: CreativeInsightRow | null | undefined
): DetailRow[] {
  const rows: DetailRow[] = [
    {
      label: 'Status',
      value: (
        <Badge
          variant="outline"
          className={cn('capitalize', getCampaignStatusClassName(row.status))}
        >
          {formatCampaignStatus(row.status)}
        </Badge>
      ),
    },
    { label: 'ID', value: row.id },
    {
      label: toTitleCase(getPerformanceItemLabel(row.level)),
      value: row.name,
    },
    {
      label: 'Ad Account',
      value: (
        <div className="flex items-center gap-2">
          <AdAccountPlatformIcon platform={row.adAccount.platform} />
          <span>{row.adAccount.name}</span>
        </div>
      ),
    },
  ];

  if (row.campaignName) {
    rows.push({ label: 'Campaign', value: row.campaignName });
  }

  if (row.adSetName) {
    rows.push({ label: 'Ad Set', value: row.adSetName });
  }

  if (creative) {
    rows.push({ label: 'Destination', value: creative.destination });
  }

  return rows;
}

function buildMetricRows(
  row: MetricsPerformanceRow,
  creative: CreativeInsightRow | null | undefined
): DetailRow[] {
  const coreRows: DetailRow[] = MOCK_METRICS.map((metric) => ({
    label: metric.title,
    value: row.metrics[metric.id],
  }));

  const detailRows: DetailRow[] =
    creative?.detailMetrics.map((metric) => ({
      label: metric.label,
      value: metric.value,
    })) ?? [];

  return [...coreRows, ...detailRows];
}

function buildAdCopyRows(creative: CreativeInsightRow): DetailRow[] {
  return [
    { label: 'Headline', value: creative.headline },
    { label: 'Primary Text', value: creative.primaryText },
  ];
}
