'use client';

import { formatCampaignStatus } from '@/app/(protected)/metrics/campaign-performance.config';
import {
  getCampaignPlatformIcon,
  parseCampaignMetricValue,
} from '@/app/(protected)/metrics/campaign-performance.utils';
import {
  CREATIVE_INSIGHT_ROWS,
  getMetricLabel,
  type CreativeInsightRow,
} from '@/app/(protected)/metrics/metrics-data';
import { SearchBar } from '@/components/search-bar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { MOCK_METRICS } from '@/mock-data/metrics';
import type { CoreMetricId, MockCreativeMedia } from '@/mock-data/types';
import {
  ArrowUpRightIcon,
  ChevronDownIcon,
  ImageIcon,
  PlayIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';

const DISPLAY_LIMIT = 4;
const CREATIVE_CARD_MEDIA_CLASS = 'h-44';
const CREATIVE_DETAIL_MEDIA_CLASS = 'aspect-[4/5]';

export const CreativeInsightsSection = () => {
  const [selectedMetricId, setSelectedMetricId] =
    useState<CoreMetricId>('roas');
  const selectedMetricLabel = getMetricLabel(selectedMetricId);
  const rankedCreatives = [...CREATIVE_INSIGHT_ROWS].sort((leftAd, rightAd) =>
    compareCreatives(leftAd, rightAd, selectedMetricId)
  );
  const topCreatives = rankedCreatives.slice(0, DISPLAY_LIMIT);
  const topCreativeIds = new Set(topCreatives.map((creative) => creative.id));
  const bottomCreatives =
    rankedCreatives.length <= DISPLAY_LIMIT
      ? [...rankedCreatives].reverse()
      : [...rankedCreatives]
          .reverse()
          .filter((creative) => !topCreativeIds.has(creative.id))
          .slice(0, DISPLAY_LIMIT);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <h2 className="text-xl font-semibold">Creative Insights</h2>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-between sm:w-auto"
              >
                {selectedMetricLabel}
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 min-w-48">
              <DropdownMenuLabel>Creative Metric</DropdownMenuLabel>
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
          <CreativeInsightsDetailView triggerClassName="w-full justify-between sm:w-auto" />
        </div>
      </div>
      <div className="space-y-6">
        <CreativeGalleryRow
          title="Top Creatives"
          description={`Highest ${selectedMetricLabel} across active creative inventory`}
          creatives={topCreatives}
          selectedMetricId={selectedMetricId}
          selectedMetricLabel={selectedMetricLabel}
        />
        <CreativeGalleryRow
          title="Bottom Creatives"
          description={`Lowest ${selectedMetricLabel} across active creative inventory`}
          creatives={bottomCreatives}
          selectedMetricId={selectedMetricId}
          selectedMetricLabel={selectedMetricLabel}
        />
      </div>
    </section>
  );
};

interface CreativeGalleryRowProps {
  title: string;
  description: string;
  creatives: CreativeInsightRow[];
  selectedMetricId: CoreMetricId;
  selectedMetricLabel: string;
}

const CreativeGalleryRow = ({
  title,
  description,
  creatives,
  selectedMetricId,
  selectedMetricLabel,
}: CreativeGalleryRowProps) => {
  return (
    <Card className="gap-4 py-5">
      <CardHeader className="px-5">
        <div className="space-y-1">
          <CardTitle className="text-sm">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {creatives.map((creative) => (
            <AdCreativeTile key={creative.id} creative={creative}>
              {(PlatformIcon) => (
                <AdCreativeDetailSheet creative={creative}>
                  <button
                    type="button"
                    className="group bg-muted/40 hover:bg-muted cursor-pointer overflow-hidden rounded-xl border text-left transition-colors"
                    aria-label={`Open ${creative.name}`}
                  >
                    <div className="bg-muted relative overflow-hidden">
                      <MediaPreview media={creative.previewMedia} />
                    </div>
                    <div className="flex items-center justify-between gap-4 px-3 py-3">
                      <div className="min-w-0 space-y-1">
                        <p className="line-clamp-1 text-sm font-medium">
                          {creative.name}
                        </p>
                        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                          <PlatformIcon className="size-3" />
                          <span className="truncate">
                            {creative.adAccount.name}
                          </span>
                          <span aria-hidden="true">/</span>
                          <span className="capitalize">
                            {formatCampaignStatus(creative.status)}
                          </span>
                        </div>
                      </div>
                      <MetricStack
                        label={selectedMetricLabel}
                        value={creative.metrics[selectedMetricId]}
                        align="right"
                      />
                    </div>
                  </button>
                </AdCreativeDetailSheet>
              )}
            </AdCreativeTile>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface AdCreativeTileProps {
  creative: CreativeInsightRow;
  children: (
    platformIcon: ReturnType<typeof getCampaignPlatformIcon>
  ) => ReactNode;
}

const AdCreativeTile = ({ creative, children }: AdCreativeTileProps) => {
  const PlatformIcon = getCampaignPlatformIcon(creative.adAccount.platform);

  return children(PlatformIcon);
};

interface AdCreativeDetailSheetProps {
  creative: CreativeInsightRow;
  children: ReactNode;
}

const AdCreativeDetailSheet = ({
  creative,
  children,
}: AdCreativeDetailSheetProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
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

interface CreativeInsightsDetailViewProps {
  triggerClassName?: string;
}

const CreativeInsightsDetailView = ({
  triggerClassName,
}: CreativeInsightsDetailViewProps) => {
  const [query, setQuery] = useState('');
  const filteredCreatives = CREATIVE_INSIGHT_ROWS.filter((creative) => {
    const normalizedQuery = query.trim().toLowerCase();

    if (normalizedQuery.length === 0) {
      return true;
    }

    return (
      creative.name.toLowerCase().includes(normalizedQuery) ||
      creative.campaign.name.toLowerCase().includes(normalizedQuery) ||
      creative.adSet.name.toLowerCase().includes(normalizedQuery)
    );
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className={triggerClassName}>
          Detailed View
          <ArrowUpRightIcon />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-full gap-0 data-[side=right]:w-screen sm:data-[side=right]:w-[min(96vw,1280px)] sm:data-[side=right]:max-w-[1280px]"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <SheetHeader className="border-b pr-14">
          <SheetTitle>Creative Insights</SheetTitle>
          <SheetDescription>
            Full gallery layout is the next step. The sheet shell is wired so we
            can add filters, density controls, and the complete creative library
            without reshaping the page.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 p-4 sm:p-6">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search creatives..."
            containerClassName="w-full xl:w-96"
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredCreatives.slice(0, 6).map((creative) => (
              <Card key={creative.id} className="gap-0 overflow-hidden py-0">
                <div className="bg-muted relative">
                  <MediaPreview media={creative.previewMedia} />
                  <div className="from-background/80 via-background/0 absolute inset-0 bg-linear-to-t to-transparent" />
                </div>
                <CardContent className="space-y-2 px-4 py-4">
                  <p className="line-clamp-1 text-sm font-medium">
                    {creative.name}
                  </p>
                  <p className="text-muted-foreground line-clamp-1 text-xs">
                    {creative.campaign.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="bg-muted/40 rounded-2xl border border-dashed p-6 text-sm">
            <p className="font-medium">Full gallery not implemented yet</p>
            <p className="text-muted-foreground mt-2">
              The detailed gallery sheet is connected to the page now, but the
              full browsing experience is still intentionally stubbed.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface MetricStackProps {
  label: string;
  value: string;
  align?: 'left' | 'right';
}

const MetricStack = ({ label, value, align = 'left' }: MetricStackProps) => {
  return (
    <div className={align === 'right' ? 'space-y-1 text-right' : 'space-y-1'}>
      <p className="text-foreground text-xs font-medium tabular-nums sm:text-sm">
        {value}
      </p>
      <p className="text-muted-foreground text-xs">{label}</p>
    </div>
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

interface MediaPreviewProps {
  media: MockCreativeMedia;
}

const MediaPreview = ({ media }: MediaPreviewProps) => {
  return (
    <div className={`relative w-full ${CREATIVE_CARD_MEDIA_CLASS}`}>
      {media.type === 'video' ? (
        <>
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
          <div className="bg-background/85 text-foreground absolute right-3 bottom-3 rounded-full p-2 shadow-sm backdrop-blur">
            <PlayIcon className="size-4 fill-current" />
          </div>
        </>
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={media.src}
            alt={media.title}
            className="size-full object-cover"
          />
          <div className="bg-background/85 text-foreground absolute right-3 bottom-3 rounded-full p-2 shadow-sm backdrop-blur">
            <ImageIcon className="size-4" />
          </div>
        </>
      )}
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
      <div
        className={`bg-background overflow-hidden rounded-xl ${CREATIVE_DETAIL_MEDIA_CLASS}`}
      >
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
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={media.src}
              alt={title}
              className="bg-background size-full object-contain"
            />
          </>
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

function compareCreatives(
  leftAd: CreativeInsightRow,
  rightAd: CreativeInsightRow,
  selectedMetricId: CoreMetricId
) {
  const metricDifference =
    parseCampaignMetricValue(rightAd.metrics[selectedMetricId]) -
    parseCampaignMetricValue(leftAd.metrics[selectedMetricId]);

  if (metricDifference !== 0) {
    return metricDifference;
  }

  return (
    parseCampaignMetricValue(rightAd.metrics.revenue) -
    parseCampaignMetricValue(leftAd.metrics.revenue)
  );
}
