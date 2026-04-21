'use client';

import { BreakdownPieCard } from '@/app/(protected)/metrics/components/breakdown-pie-card';
import { MetricsChartCard } from '@/app/(protected)/metrics/components/metrics-chart-card';
import { MetricsLevelToggle } from '@/app/(protected)/metrics/components/metrics-level-toggle';
import { PerformanceDetailSheet } from '@/app/(protected)/metrics/components/performance/performance-detail-sheet';
import { PerformanceDetailView } from '@/app/(protected)/metrics/components/performance/performance-detail-view';
import { PerformanceListCard } from '@/app/(protected)/metrics/components/performance/performance-list-card';
import { getPerformanceRows } from '@/app/(protected)/metrics/metrics-data';
import {
  createAdAccountBreakdown,
  createAdSetBreakdown,
  createCampaignBreakdown,
  createChartConfig,
  createStatusBreakdown,
  getBreakdownSummaryLabel,
  getCompositionChartDescription,
  getCompositionChartTitle,
  getStatusChartDescription,
  getStatusChartTitle,
} from '@/app/(protected)/metrics/utils/account-structure';
import type { PerformanceLevel } from '@/mock-data/types';
import { useState } from 'react';

export const MetricsAccountStructureSection = () => {
  const [level, setLevel] = useState<PerformanceLevel>('campaign');
  const rows = getPerformanceRows(level);
  const totalRows = rows.length;
  const compositionBreakdown =
    level === 'campaign'
      ? createAdAccountBreakdown(rows, totalRows)
      : level === 'adSet'
        ? createCampaignBreakdown(rows, totalRows)
        : createAdSetBreakdown(rows, totalRows);
  const statusBreakdown = createStatusBreakdown(rows, totalRows);
  const summaryLabel = getBreakdownSummaryLabel(level);

  return (
    <section className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-4">
        <h2 className="text-xl font-semibold">Account Breakdown</h2>
        <div className="grid grid-cols-2 gap-2 sm:justify-self-end">
          <MetricsLevelToggle value={level} onValueChange={setLevel} />
          <PerformanceDetailView
            level={level}
            triggerClassName="w-full justify-between sm:w-auto"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <MetricsChartCard
            title={getCompositionChartTitle(level)}
            description={getCompositionChartDescription(level)}
            summary={String(totalRows)}
            summaryLabel={summaryLabel}
          >
            <BreakdownPieCard
              data={compositionBreakdown}
              config={createChartConfig(compositionBreakdown)}
            />
          </MetricsChartCard>
          <MetricsChartCard
            title={getStatusChartTitle(level)}
            description={getStatusChartDescription(level)}
            summary={String(totalRows)}
            summaryLabel={summaryLabel}
          >
            <BreakdownPieCard
              data={statusBreakdown}
              config={createChartConfig(statusBreakdown)}
            />
          </MetricsChartCard>
        </div>
        <PerformanceListCard level={level} tone="top" />
        <PerformanceListCard level={level} tone="bottom" />
      </div>
      <PerformanceDetailSheet />
    </section>
  );
};
