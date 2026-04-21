import type { AdPlatform, CampaignStatus } from '@/mock-data/types';
import { Font, StyleSheet } from '@react-pdf/renderer';

export const FONT_FAMILY = 'Inter';
export const PAGE_PADDING = 24;
export const CARD_RADIUS = 12;
export const SECTION_GAP = 14;
export const CARD_BACKGROUND = '#FCFCFC';
export const FOREGROUND = '#333333';
export const MUTED_FOREGROUND = '#6B7280';
export const BORDER = '#E5E7EB';
export const MUTED = '#F9FAFB';
export const SECONDARY = '#F3F4F6';
export const SECONDARY_FOREGROUND = '#4B5563';
export const PRIMARY = '#3B82F6';
export const DESTRUCTIVE = '#EF4444';
export const CHART_2 = '#00AA6F';
export const CHART_3 = '#EF7926';
export const CHART_4 = '#914DE6';
export const CHART_5 = '#EE4A73';
export const GOOGLE_GREEN = '#34A853';
export const GOOGLE_YELLOW = '#FBBC04';
export const CHART_WIDTH = 310;
export const CHART_HEIGHT = 168;
export const DONUT_SIZE = 176;
export const DISPLAY_ROW_LIMIT = 5;

export const PLATFORM_ORDER: AdPlatform[] = ['meta', 'google'];

export const META_ACCOUNT_COLORS = [PRIMARY, CHART_2] as const;
export const GOOGLE_ACCOUNT_COLORS = [GOOGLE_YELLOW, GOOGLE_GREEN] as const;
export const CAMPAIGN_COLORS = [
  PRIMARY,
  CHART_2,
  CHART_3,
  CHART_4,
  CHART_5,
  PRIMARY,
] as const;

export const STATUS_COLORS: Record<CampaignStatus, string> = {
  ACTIVE: PRIMARY,
  ENDED: CHART_4,
  PAUSED: MUTED_FOREGROUND,
  WITH_ISSUES: DESTRUCTIVE,
};

export const CHART_COLORS = {
  audience: CHART_3,
  ctr: PRIMARY,
  fillBlue: '#BFDBFE',
  grid: BORDER,
  labels: MUTED_FOREGROUND,
  revenue: CHART_2,
  roas: CHART_2,
  spend: CHART_3,
};

Font.register({
  family: FONT_FAMILY,
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/npm/@fontsource/inter/files/inter-latin-400-normal.woff',
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

export const compactNumberFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

export const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});

export const unitCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const pdfStyles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    color: FOREGROUND,
    fontFamily: FONT_FAMILY,
    fontSize: 9,
    padding: PAGE_PADDING,
  },
  intro: {
    borderBottom: `1 solid ${BORDER}`,
    marginBottom: 24,
    paddingBottom: 14,
  },
  introTitle: {
    color: FOREGROUND,
    fontSize: 18,
    fontWeight: 600,
  },
  introMeta: {
    color: MUTED_FOREGROUND,
    fontSize: 9,
    marginTop: 4,
  },
  section: {
    marginTop: 0,
  },
  sectionHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    color: FOREGROUND,
    fontSize: 15,
    fontWeight: 600,
  },
  twoColumnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowGap: {
    marginBottom: SECTION_GAP,
  },
  gridCardQuarter: {
    width: '23.68%',
  },
  gridCardHalf: {
    width: '49.12%',
  },
  card: {
    backgroundColor: CARD_BACKGROUND,
    border: `1 solid ${BORDER}`,
    borderRadius: CARD_RADIUS,
    paddingBottom: 24,
    paddingTop: 24,
  },
  cardHeader: {
    paddingHorizontal: 24,
  },
  cardContent: {
    paddingHorizontal: 24,
  },
  cardFooter: {
    paddingHorizontal: 24,
  },
  cardTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardHeaderMetric: {
    color: MUTED_FOREGROUND,
    fontSize: 8,
    fontWeight: 500,
  },
  cardTitle: {
    color: MUTED_FOREGROUND,
    fontSize: 10,
    fontWeight: 500,
  },
  metricValue: {
    color: FOREGROUND,
    fontSize: 18,
    fontWeight: 600,
    marginTop: 8,
  },
  metricTrend: {
    fontSize: 9,
    fontWeight: 500,
    marginTop: 10,
  },
  trendPositive: {
    color: '#16A34A',
  },
  trendNegative: {
    color: DESTRUCTIVE,
  },
  trendNeutral: {
    color: MUTED_FOREGROUND,
  },
  chartSummaryWrap: {
    marginBottom: 16,
    marginTop: 10,
  },
  chartSummary: {
    color: FOREGROUND,
    fontSize: 18,
    fontWeight: 600,
  },
  chartSummaryLabel: {
    color: MUTED_FOREGROUND,
    fontSize: 9,
    marginTop: 4,
  },
  chartContainer: {
    alignItems: 'center',
  },
  pieLegend: {
    marginTop: 18,
  },
  pieLegendRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  legendLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    maxWidth: '72%',
  },
  legendDot: {
    borderRadius: 999,
    height: 8,
    marginRight: 8,
    width: 8,
  },
  legendLabel: {
    color: MUTED_FOREGROUND,
    fontSize: 9,
  },
  legendValue: {
    color: MUTED_FOREGROUND,
    fontSize: 9,
  },
  performanceCardInner: {
    paddingHorizontal: 8,
  },
  performanceListContent: {
    marginTop: 10,
  },
  separator: {
    backgroundColor: BORDER,
    height: 1,
    width: '100%',
  },
  performanceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  performanceRowLeft: {
    flexDirection: 'row',
    flexGrow: 1,
    flexShrink: 1,
    marginRight: 16,
  },
  performanceThumbnail: {
    borderRadius: 6,
    height: 40,
    marginRight: 12,
    width: 40,
  },
  performanceMeta: {
    flexGrow: 1,
    flexShrink: 1,
  },
  performanceName: {
    color: FOREGROUND,
    fontSize: 10,
    fontWeight: 500,
  },
  performanceContext: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  performanceContextText: {
    color: MUTED_FOREGROUND,
    fontSize: 8,
    marginRight: 4,
  },
  performanceValue: {
    color: FOREGROUND,
    fontSize: 10,
    fontWeight: 500,
    textAlign: 'right',
  },
  platformCardHeader: {
    paddingBottom: 10,
  },
  platformHeaderGrid: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  platformMetricColumn: {
    width: '32%',
  },
  platformValueColumn: {
    width: '34%',
  },
  platformHeaderText: {
    color: MUTED_FOREGROUND,
    fontSize: 10,
    fontWeight: 500,
  },
  platformHeaderLabel: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  platformHeaderName: {
    color: FOREGROUND,
    fontSize: 10,
    fontWeight: 500,
    marginLeft: 8,
  },
  platformRows: {
    paddingHorizontal: 24,
  },
  platformRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 12,
  },
  platformMetricLabel: {
    color: MUTED_FOREGROUND,
    fontSize: 9,
  },
  platformMetricValue: {
    color: FOREGROUND,
    fontSize: 9,
    fontWeight: 600,
  },
  emptyState: {
    backgroundColor: MUTED,
    border: `1 solid ${BORDER}`,
    borderRadius: CARD_RADIUS,
    color: MUTED_FOREGROUND,
    fontSize: 10,
    padding: 16,
  },
  badge: {
    borderRadius: 999,
    borderWidth: 1,
    fontSize: 7,
    paddingHorizontal: 8,
    paddingVertical: 3,
    textTransform: 'capitalize',
  },
  badgeActive: {
    backgroundColor: 'rgba(59,130,246,0.10)',
    borderColor: 'rgba(59,130,246,0.20)',
    color: PRIMARY,
  },
  badgePaused: {
    backgroundColor: MUTED,
    borderColor: BORDER,
    color: MUTED_FOREGROUND,
  },
  badgeEnded: {
    backgroundColor: SECONDARY,
    borderColor: BORDER,
    color: SECONDARY_FOREGROUND,
  },
  badgeIssues: {
    backgroundColor: 'rgba(239,68,68,0.10)',
    borderColor: 'rgba(239,68,68,0.20)',
    color: DESTRUCTIVE,
  },
});
