import type { DocumentProps } from '@react-pdf/renderer';
import type { ReactElement } from 'react';

const INVALID_FILE_NAME_CHARACTERS = /[<>:"/\\|?*\u0000-\u001F]/g;

export function sanitizePdfFileName(
  fileName: string,
  fallbackFileName: string
): string {
  const normalized = (fileName.trim() || fallbackFileName).replace(
    /\.pdf$/i,
    ''
  );

  return normalized.replace(INVALID_FILE_NAME_CHARACTERS, '-');
}

export function downloadBlobFile(blob: Blob, fileName: string) {
  const blobUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');

  downloadLink.href = blobUrl;
  downloadLink.download = `${fileName}.pdf`;
  document.body.append(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 0);
}

export async function renderPdfDocumentToBlob(
  document: ReactElement<DocumentProps>
): Promise<Blob> {
  const { pdf } = await import('@react-pdf/renderer');

  return pdf(document).toBlob();
}
