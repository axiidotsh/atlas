'use client';

import { CreativeInsightsDetailView } from '@/app/(protected)/metrics/components/creative/creative-insights-detail-view';
import { CreativeListCard } from '@/app/(protected)/metrics/components/creative/creative-list-card';
import {
  CREATIVE_INSIGHT_ROWS,
  getMetricLabel,
} from '@/app/(protected)/metrics/metrics-data';
import {
  CREATIVE_DISPLAY_LIMIT,
  compareCreatives,
} from '@/app/(protected)/metrics/utils/creative-insights';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MOCK_METRICS } from '@/mock-data/metrics';
import type { CoreMetricId } from '@/mock-data/types';
import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';

export const CreativeInsightsSection = () => {
  const [selectedMetricId, setSelectedMetricId] =
    useState<CoreMetricId>('roas');
  const selectedMetricLabel = getMetricLabel(selectedMetricId);
  const rankedCreatives = [...CREATIVE_INSIGHT_ROWS].sort((leftAd, rightAd) =>
    compareCreatives(leftAd, rightAd, selectedMetricId)
  );
  const topCreatives = rankedCreatives.slice(0, CREATIVE_DISPLAY_LIMIT);
  const topCreativeIds = new Set(topCreatives.map((creative) => creative.id));
  const bottomCreatives =
    rankedCreatives.length <= CREATIVE_DISPLAY_LIMIT
      ? [...rankedCreatives].reverse()
      : [...rankedCreatives]
          .reverse()
          .filter((creative) => !topCreativeIds.has(creative.id))
          .slice(0, CREATIVE_DISPLAY_LIMIT);

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
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <CreativeListCard
          title="Top Performers"
          description={`Highest ${selectedMetricLabel} across active creative inventory`}
          creatives={topCreatives}
          selectedMetricId={selectedMetricId}
          tone="top"
        />
        <CreativeListCard
          title="Bottom Performers"
          description={`Lowest ${selectedMetricLabel} across active creative inventory`}
          creatives={bottomCreatives}
          selectedMetricId={selectedMetricId}
          tone="bottom"
        />
      </div>
    </section>
  );
};
