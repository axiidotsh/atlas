'use client';

import {
  campaignPerformanceRowsAtom,
  platformBreakdownVisibleMetricsAtom,
} from '@/app/(protected)/metrics/atoms';
import { sleep } from '@/utils/utils';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { toast } from 'sonner';

const MIN_EXPORT_DURATION_MS = 1400;

export interface MetricsPdfExportInput {
  fileName: string;
  selectedSections: {
    coreMetrics: boolean;
    trends: boolean;
    platformBreakdown: boolean;
  };
  selectedAccountBreakdownLevels: Array<'adSet' | 'ad' | 'campaign'>;
}

function triggerDownload(blob: Blob, fileName: string) {
  const blobUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');

  downloadLink.href = blobUrl;
  downloadLink.download = `${fileName}.pdf`;
  document.body.append(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 0);
}

export function useMetricsPdfExport() {
  const [isExporting, setIsExporting] = useState(false);
  const campaignRows = useAtomValue(campaignPerformanceRowsAtom);
  const visiblePlatformMetrics = useAtomValue(
    platformBreakdownVisibleMetricsAtom
  );

  async function exportPdf(input: MetricsPdfExportInput): Promise<boolean> {
    if (isExporting) {
      return false;
    }

    setIsExporting(true);

    try {
      const minimumExportDuration = sleep(MIN_EXPORT_DURATION_MS);
      const blobPromise = Promise.all([
        import('@react-pdf/renderer'),
        import('@/app/(protected)/metrics/components/metrics-pdf-document'),
      ]).then(async ([{ pdf }, { MetricsPdfDocument }]) =>
        pdf(
          <MetricsPdfDocument
            campaignRows={campaignRows}
            fileName={input.fileName}
            platformBreakdownMetricKeys={visiblePlatformMetrics}
            selectedAccountBreakdownSections={
              input.selectedAccountBreakdownLevels
            }
            selectedSections={input.selectedSections}
          />
        ).toBlob()
      );
      const [blob] = await Promise.all([blobPromise, minimumExportDuration]);

      triggerDownload(blob, input.fileName);
      toast.success('PDF exported');
      return true;
    } catch (error) {
      console.error(error);
      toast.error('Failed to export PDF');
      return false;
    } finally {
      setIsExporting(false);
    }
  }

  return { isExporting, exportPdf };
}
