'use client';

import { downloadBlobFile, renderPdfDocumentToBlob } from '@/utils/pdf';
import { sleep } from '@/utils/utils';
import type { DocumentProps } from '@react-pdf/renderer';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

const DEFAULT_MIN_EXPORT_DURATION_MS = 1400;

interface ExportPdfInput {
  fileName: string;
}

interface UsePdfExportOptions<TInput extends ExportPdfInput> {
  buildDocument:
    | ((input: TInput) => Promise<ReactElement<DocumentProps>>)
    | ((input: TInput) => ReactElement<DocumentProps>);
  errorMessage?: string;
  minExportDurationMs?: number;
  successMessage?: string;
}

export function usePdfExport<TInput extends ExportPdfInput>({
  buildDocument,
  errorMessage = 'Failed to export PDF',
  minExportDurationMs = DEFAULT_MIN_EXPORT_DURATION_MS,
  successMessage = 'PDF exported',
}: UsePdfExportOptions<TInput>) {
  const [isExporting, setIsExporting] = useState(false);

  async function exportPdf(input: TInput): Promise<boolean> {
    if (isExporting) {
      return false;
    }

    setIsExporting(true);

    try {
      const minimumExportDuration = sleep(minExportDurationMs);
      const document = await buildDocument(input);
      const [blob] = await Promise.all([
        renderPdfDocumentToBlob(document),
        minimumExportDuration,
      ]);

      downloadBlobFile(blob, input.fileName);
      toast.success(successMessage);
      return true;
    } catch (error) {
      console.error(error);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsExporting(false);
    }
  }

  return { isExporting, exportPdf };
}
