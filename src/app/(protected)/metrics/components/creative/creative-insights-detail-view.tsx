'use client';

import { CREATIVE_INSIGHT_ROWS } from '@/app/(protected)/metrics/metrics-data';
import { SearchBar } from '@/components/search-bar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { MockCreativeMedia } from '@/mock-data/types';
import { ArrowUpRightIcon, ImageIcon, PlayIcon } from 'lucide-react';
import { useState } from 'react';

interface CreativeInsightsDetailViewProps {
  triggerClassName?: string;
}

export const CreativeInsightsDetailView = ({
  triggerClassName,
}: CreativeInsightsDetailViewProps) => {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const filteredCreatives =
    normalizedQuery.length === 0
      ? CREATIVE_INSIGHT_ROWS
      : CREATIVE_INSIGHT_ROWS.filter(
          (creative) =>
            creative.name.toLowerCase().includes(normalizedQuery) ||
            creative.campaign.name.toLowerCase().includes(normalizedQuery) ||
            creative.adSet.name.toLowerCase().includes(normalizedQuery)
        );

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

interface MediaPreviewProps {
  media: MockCreativeMedia;
}

const MediaPreview = ({ media }: MediaPreviewProps) => {
  return (
    <div className="relative h-44 w-full">
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
