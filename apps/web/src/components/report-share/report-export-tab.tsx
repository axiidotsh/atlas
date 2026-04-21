'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useReportPdfExport } from '@/hooks/use-report-pdf-export';
import type { MockReport } from '@/mock-data/reports';
import { sanitizePdfFileName } from '@/utils/pdf';
import { cn } from '@/utils/utils';
import { format } from 'date-fns';
import { useId, useState } from 'react';

interface ReportExportTabProps {
  align: 'center' | 'end';
  onExportSuccess: () => void;
  report: MockReport;
}

function getDefaultPdfFileName(report: MockReport) {
  return `${report.title} - ${format(new Date(), 'LLL dd, y')}`;
}

export const ReportExportTab = ({
  align,
  onExportSuccess,
  report,
}: ReportExportTabProps) => {
  const fileNameInputId = useId();
  const [fileName, setFileName] = useState(() => getDefaultPdfFileName(report));
  const { isExporting, exportPdf } = useReportPdfExport();

  async function handlePdfExport() {
    const didExport = await exportPdf({
      fileName: sanitizePdfFileName(fileName, getDefaultPdfFileName(report)),
      report,
    });

    if (didExport) {
      onExportSuccess();
    }
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <Label htmlFor={fileNameInputId} className="text-sm font-medium">
          File name
        </Label>
        <Input
          id={fileNameInputId}
          value={fileName}
          onChange={(event) => setFileName(event.target.value)}
          placeholder={getDefaultPdfFileName(report)}
        />
      </div>
      <div
        className={cn(
          'flex',
          align === 'end' ? 'justify-end' : 'justify-center'
        )}
      >
        <Button
          type="button"
          className="min-w-32"
          disabled={isExporting}
          onClick={handlePdfExport}
        >
          {isExporting ? 'Exporting...' : 'Export as PDF'}
        </Button>
      </div>
    </div>
  );
};
