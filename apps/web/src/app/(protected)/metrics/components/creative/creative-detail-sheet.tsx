'use client';

import type { CreativeInsightRow } from '@/app/(protected)/metrics/metrics-data';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type { MockCreativeMedia } from '@/mock-data/types';
import type { ReactNode } from 'react';

interface CreativeDetailSheetProps {
  creative: CreativeInsightRow;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CreativeDetailSheet = ({
  creative,
  children,
  open,
  onOpenChange,
}: CreativeDetailSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {children}
      <SheetContent
        className="w-full gap-0 data-[side=right]:w-screen sm:data-[side=right]:w-[min(96vw,1200px)] sm:data-[side=right]:max-w-[1200px]"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <SheetHeader className="border-b pr-14">
          <SheetTitle>{creative.name}</SheetTitle>
          <SheetDescription>
            Inspect every asset used in this ad alongside expanded performance
            context.
          </SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-auto">
          <div className="space-y-8 p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {creative.media.map((media) => (
                <div
                  key={media.id}
                  className="bg-muted overflow-hidden rounded-2xl border"
                >
                  <MediaDetail media={media} title={media.title} />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
              <Card className="gap-4 py-5">
                <CardHeader className="px-5">
                  <div className="space-y-1">
                    <CardTitle className="text-sm">Creative Context</CardTitle>
                    <CardDescription>
                      Copy, destination, and hierarchy for this ad.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 px-5">
                  <ContextBlock label="Headline" value={creative.headline} />
                  <ContextBlock
                    label="Primary Text"
                    value={creative.primaryText}
                  />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <ContextBlock
                      label="Destination"
                      value={creative.destination}
                    />
                    <ContextBlock
                      label="Campaign"
                      value={creative.campaign.name}
                    />
                    <ContextBlock label="Ad Set" value={creative.adSet.name} />
                    <ContextBlock
                      label="Ad Account"
                      value={creative.adAccount.name}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="gap-4 py-5">
                <CardHeader className="px-5">
                  <div className="space-y-1">
                    <CardTitle className="text-sm">Expanded Metrics</CardTitle>
                    <CardDescription>
                      More detail than the summary cards surface.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3 px-5">
                  <MetricPanel label="ROAS" value={creative.metrics.roas} />
                  <MetricPanel
                    label="Revenue"
                    value={creative.metrics.revenue}
                  />
                  <MetricPanel label="Spend" value={creative.metrics.spend} />
                  <MetricPanel label="CTR" value={creative.metrics.ctr} />
                  <MetricPanel
                    label="Impressions"
                    value={creative.metrics.impressions}
                  />
                  <MetricPanel label="Clicks" value={creative.metrics.clicks} />
                  {creative.detailMetrics.map((metric) => (
                    <MetricPanel
                      key={metric.id}
                      label={metric.label}
                      value={metric.value}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface MetricPanelProps {
  label: string;
  value: string;
}

const MetricPanel = ({ label, value }: MetricPanelProps) => {
  return (
    <div className="bg-muted/60 rounded-xl border px-4 py-3">
      <p className="text-foreground text-sm font-medium tabular-nums">
        {value}
      </p>
      <p className="text-muted-foreground mt-1 text-xs">{label}</p>
    </div>
  );
};

interface ContextBlockProps {
  label: string;
  value: string;
}

const ContextBlock = ({ label, value }: ContextBlockProps) => {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="text-sm leading-6">{value}</p>
    </div>
  );
};

interface MediaDetailProps {
  media: MockCreativeMedia;
  title: string;
}

const MediaDetail = ({ media, title }: MediaDetailProps) => {
  return (
    <div className="space-y-3 p-3">
      <div className="bg-background aspect-[4/5] overflow-hidden rounded-xl">
        {media.type === 'video' ? (
          <video
            src={media.src}
            poster={media.posterSrc}
            className="size-full bg-black object-contain"
            controls
            playsInline
            preload="metadata"
          />
        ) : (
          <img
            src={media.src}
            alt={title}
            className="bg-background size-full object-contain"
          />
        )}
      </div>
      <div className="flex items-center gap-2 px-1">
        <Badge variant="outline" className="capitalize">
          {media.type}
        </Badge>
        <p className="text-muted-foreground text-sm">{title}</p>
      </div>
    </div>
  );
};
