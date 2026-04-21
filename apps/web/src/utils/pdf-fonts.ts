import { Font } from '@react-pdf/renderer';

export const PDF_FONT_FAMILY = 'Inter';

let isPdfFontRegistered = false;

export function registerPdfFonts() {
  if (isPdfFontRegistered) {
    return;
  }

  Font.register({
    family: PDF_FONT_FAMILY,
    fonts: [
      {
        src: 'https://cdn.jsdelivr.net/npm/@fontsource/inter/files/inter-latin-400-normal.woff',
        fontWeight: 400,
      },
      {
        src: 'https://cdn.jsdelivr.net/npm/@fontsource/inter/files/inter-latin-400-italic.woff',
        fontStyle: 'italic',
        fontWeight: 400,
      },
      {
        src: 'https://cdn.jsdelivr.net/npm/@fontsource/inter/files/inter-latin-500-normal.woff',
        fontWeight: 500,
      },
      {
        src: 'https://cdn.jsdelivr.net/npm/@fontsource/inter/files/inter-latin-600-normal.woff',
        fontWeight: 600,
      },
      {
        src: 'https://cdn.jsdelivr.net/npm/@fontsource/inter/files/inter-latin-700-normal.woff',
        fontWeight: 700,
      },
    ],
  });

  isPdfFontRegistered = true;
}
