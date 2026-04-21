'use client';

import {
  campaignPerformanceRowsAtom,
  platformBreakdownVisibleMetricsAtom,
} from '@/app/(protected)/metrics/atoms';
import { usePdfExport } from '@/hooks/use-pdf-export';
import { useAtomValue } from 'jotai';

export interface MetricsPdfExportInput {
  fileName: string;
  selectedSections: {
    coreMetrics: boolean;
    trends: boolean;
    platformBreakdown: boolean;
  };
  selectedAccountBreakdownLevels: Array<'adSet' | 'ad' | 'campaign'>;
}

export function useMetricsPdfExport() {
  const campaignRows = useAtomValue(campaignPerformanceRowsAtom);
  const visiblePlatformMetrics = useAtomValue(
    platformBreakdownVisibleMetricsAtom
  );

  return usePdfExport<MetricsPdfExportInput>({
    async buildDocument(input) {
      const { MetricsPdfDocument } =
        await import('@/app/(protected)/metrics/components/pdf/metrics-pdf-document');

      return (
        <MetricsPdfDocument
          campaignRows={campaignRows}
          fileName={input.fileName}
          platformBreakdownMetricKeys={visiblePlatformMetrics}
          selectedAccountBreakdownSections={
            input.selectedAccountBreakdownLevels
          }
          selectedSections={input.selectedSections}
        />
      );
    },
    successMessage: 'PDF exported',
    errorMessage: 'Failed to export PDF',
  });
}
