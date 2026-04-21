'use client';

import { usePdfExport } from '@/hooks/use-pdf-export';
import type { MockReport } from '@/mock-data/reports';

interface ReportPdfExportInput {
  fileName: string;
  report: MockReport;
}

export function useReportPdfExport() {
  return usePdfExport<ReportPdfExportInput>({
    async buildDocument(input) {
      const { ReportPdfDocument } =
        await import('@/app/(protected)/reports/components/pdf/report-pdf-document');

      return (
        <ReportPdfDocument fileName={input.fileName} report={input.report} />
      );
    },
    successMessage: 'PDF exported',
    errorMessage: 'Failed to export PDF',
  });
}
