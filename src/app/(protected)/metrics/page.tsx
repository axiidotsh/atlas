'use client';

import { CreativeInsightsSection } from '@/app/(protected)/metrics/components/creative-insights-section';
import { MetricCard } from '@/app/(protected)/metrics/components/metric-card';
import { MetricToolbar } from '@/app/(protected)/metrics/components/metric-toolbar';
import { MetricsPerformanceSection } from '@/app/(protected)/metrics/components/metrics-performance-section';
import { MetricsStructureSection } from '@/app/(protected)/metrics/components/metrics-structure-section';
import { MetricsTrendsGrid } from '@/app/(protected)/metrics/components/metrics-trends-grid';
import { PlatformBreakdownGrid } from '@/app/(protected)/metrics/components/platform-breakdown-grid';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MOCK_METRICS } from '@/mock-data/metrics';
import { BlocksIcon } from 'lucide-react';

export default function MetricsPage() {
  return (
    <div className="relative flex flex-col pt-6 pb-12">
      <MetricToolbar />
      <section className="mt-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Core Metrics</h2>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
            tooltip="Add, remove or reorder cards"
          >
            <BlocksIcon />
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_METRICS.map((metric) => (
            <MetricCard
              key={metric.id}
              title={metric.title}
              description={metric.description}
              value={metric.value}
              percentageChange={metric.percentageChange}
              trend={metric.trend}
            />
          ))}
        </div>
      </section>
      <Separator className="my-10" />
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Trends</h2>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
            tooltip="Add, remove or reorder graphs"
          >
            <BlocksIcon />
          </Button>
        </div>
        <MetricsTrendsGrid />
      </section>
      <Separator className="my-10" />
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Platform Breakdown</h2>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
            tooltip="Add, remove or reorder graphs"
          >
            <BlocksIcon />
          </Button>
        </div>
        <PlatformBreakdownGrid />
      </section>
      <Separator className="my-10" />
      <MetricsStructureSection />
      <Separator className="my-10" />
      <MetricsPerformanceSection />
      <Separator className="my-10" />
      <CreativeInsightsSection />
    </div>
  );
}
