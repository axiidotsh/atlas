import { PDF_FONT_FAMILY, registerPdfFonts } from '@/utils/pdf-fonts';
import { StyleSheet } from '@react-pdf/renderer';

registerPdfFonts();

export const PAGE_WIDTH = 515;
export const CARD_GAP = 8;
export const TWO_COLUMN_CARD_WIDTH = (PAGE_WIDTH - CARD_GAP) / 2;
export const THREE_COLUMN_CARD_WIDTH = (PAGE_WIDTH - CARD_GAP * 2) / 3;
export const GRAPH_WIDTH = PAGE_WIDTH - 48;
export const GRAPH_HEIGHT = 180;
export const GRAPH_PADDING = 18;
export const GRAPH_INNER_WIDTH = GRAPH_WIDTH - GRAPH_PADDING * 2;
export const GRAPH_INNER_HEIGHT = GRAPH_HEIGHT - GRAPH_PADDING * 2;

export const pdfStyles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    color: '#111827',
    fontFamily: PDF_FONT_FAMILY,
    fontSize: 10,
    padding: 32,
  },
  intro: {
    borderBottom: '1 solid #E5E7EB',
    marginBottom: 24,
    paddingBottom: 16,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: 700,
  },
  content: {
    gap: 16,
  },
  textGroup: {
    gap: 14,
  },
  markdownBlock: {
    gap: 8,
  },
  heading1: {
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1.3,
  },
  heading2: {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.35,
  },
  heading3: {
    fontSize: 12,
    fontWeight: 600,
    lineHeight: 1.35,
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.65,
  },
  list: {
    gap: 6,
  },
  listItem: {
    flexDirection: 'row',
    gap: 8,
  },
  listMarker: {
    fontSize: 10,
    width: 14,
  },
  listContent: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.6,
  },
  bold: {
    fontWeight: 700,
  },
  italic: {
    fontStyle: 'italic',
  },
  cardGrid: {
    gap: CARD_GAP,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#F9FAFB',
    border: '1 solid #E5E7EB',
    borderRadius: 12,
    minHeight: 110,
    padding: 18,
  },
  cardTitle: {
    color: '#6B7280',
    fontSize: 10,
    fontWeight: 500,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: 600,
    marginTop: 12,
  },
  cardFooter: {
    color: '#6B7280',
    fontSize: 9,
    lineHeight: 1.45,
    marginTop: 10,
  },
  graphGroup: {
    gap: 14,
  },
  graphCard: {
    backgroundColor: '#FCFCFD',
    border: '1 solid #E5E7EB',
    borderRadius: 12,
    padding: 18,
  },
  graphTitle: {
    color: '#4B5563',
    fontSize: 11,
    fontWeight: 600,
  },
  graphValue: {
    fontSize: 18,
    fontWeight: 700,
    marginTop: 12,
  },
  graphCaption: {
    color: '#6B7280',
    fontSize: 9,
    marginTop: 4,
  },
  graphSvgWrap: {
    marginTop: 16,
  },
  chartContainer: {
    alignItems: 'center',
  },
  graphLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  graphLabel: {
    color: '#6B7280',
    fontSize: 8,
    textAlign: 'center',
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    border: '1 solid #E5E7EB',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableHeader: {
    backgroundColor: '#F3F4F6',
    flexDirection: 'row',
  },
  tableBodyRow: {
    borderTop: '1 solid #E5E7EB',
    flexDirection: 'row',
  },
  tableCell: {
    flexGrow: 1,
    flexShrink: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  tableHeaderText: {
    color: '#374151',
    fontSize: 9,
    fontWeight: 600,
  },
  tableCellText: {
    color: '#111827',
    fontSize: 9,
    lineHeight: 1.5,
  },
});

export function getReportCardWidth(blockCount: number) {
  return blockCount === 2 ? TWO_COLUMN_CARD_WIDTH : THREE_COLUMN_CARD_WIDTH;
}
