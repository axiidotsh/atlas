'use client';

import {
  CAMPAIGN_PERFORMANCE_STATUSES,
  type CampaignPerformanceRow,
  formatCampaignStatus,
} from '@/app/(protected)/metrics/campaign-performance.config';
import {
  getPerformanceRows,
  type MetricsPerformanceRow,
} from '@/app/(protected)/metrics/metrics-data';
import {
  PLATFORM_BREAKDOWN_METRIC_KEYS,
  PLATFORM_BREAKDOWN_METRIC_LABELS,
  type PlatformBreakdownMetricKey,
} from '@/app/(protected)/metrics/platform-breakdown.config';
import { MOCK_METRIC_TRENDS } from '@/mock-data/metric-trends';
import { MOCK_METRICS } from '@/mock-data/metrics';
import type {
  AdPlatform,
  CampaignStatus,
  MockCampaignMetrics,
  PerformanceLevel,
} from '@/mock-data/types';
import {
  Defs,
  Document,
  Ellipse,
  Font,
  LinearGradient,
  Page,
  Path,
  Image as PdfImage,
  Stop,
  StyleSheet,
  Svg,
  Text,
  View,
} from '@react-pdf/renderer';
import type { ReactElement } from 'react';
import ReactPDFChart from 'react-pdf-charts';

interface MetricsPdfDocumentProps {
  campaignRows: CampaignPerformanceRow[];
  fileName: string;
  platformBreakdownMetricKeys: PlatformBreakdownMetricKey[];
  selectedAccountBreakdownSections: PerformanceLevel[];
  selectedSections: {
    coreMetrics: boolean;
    platformBreakdown: boolean;
    trends: boolean;
  };
}

interface LegendItem {
  color: string;
  label: string;
  platform?: AdPlatform;
  value?: string;
}

interface PageDefinition {
  content: ReactElement;
  key: string;
}

interface PieSlice {
  color: string;
  label: string;
  percentage: number;
  platform?: AdPlatform;
  value: number;
}

interface PlatformMetricSummary {
  campaignCount: number;
  clicks: number;
  cpc: number;
  ctr: number;
  impressions: number;
  platform: AdPlatform;
  reach: number;
  revenue: number;
  roas: number;
  spend: number;
}

interface Point {
  x: number;
  y: number;
}

const FONT_FAMILY = 'Inter';
const PAGE_PADDING = 24;
const CARD_RADIUS = 12;
const SECTION_GAP = 14;
const CARD_BACKGROUND = '#FCFCFC';
const FOREGROUND = '#333333';
const MUTED_FOREGROUND = '#6B7280';
const BORDER = '#E5E7EB';
const MUTED = '#F9FAFB';
const SECONDARY = '#F3F4F6';
const SECONDARY_FOREGROUND = '#4B5563';
const PRIMARY = '#3B82F6';
const DESTRUCTIVE = '#EF4444';
const CHART_2 = '#00AA6F';
const CHART_3 = '#EF7926';
const CHART_4 = '#914DE6';
const CHART_5 = '#EE4A73';
const GOOGLE_GREEN = '#34A853';
const GOOGLE_YELLOW = '#FBBC04';
const CHART_WIDTH = 310;
const CHART_HEIGHT = 168;
const DONUT_SIZE = 176;
const DISPLAY_ROW_LIMIT = 5;
const PLATFORM_ORDER: AdPlatform[] = ['meta', 'google'];
const META_ACCOUNT_COLORS = [PRIMARY, CHART_2] as const;
const GOOGLE_ACCOUNT_COLORS = [GOOGLE_YELLOW, GOOGLE_GREEN] as const;
const CAMPAIGN_COLORS = [
  PRIMARY,
  CHART_2,
  CHART_3,
  CHART_4,
  CHART_5,
  PRIMARY,
] as const;
const STATUS_COLORS: Record<CampaignStatus, string> = {
  ACTIVE: PRIMARY,
  ENDED: CHART_4,
  PAUSED: MUTED_FOREGROUND,
  WITH_ISSUES: DESTRUCTIVE,
};
const CHART_COLORS = {
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

const compactNumberFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});

const unitCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const styles = StyleSheet.create({
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

export const MetricsPdfDocument = ({
  campaignRows,
  fileName,
  platformBreakdownMetricKeys,
  selectedAccountBreakdownSections,
  selectedSections,
}: MetricsPdfDocumentProps) => {
  const platformSummaries = createPlatformSummaries(campaignRows).filter(
    (summary) => summary.campaignCount > 0
  );
  const visiblePlatformMetricKeys = PLATFORM_BREAKDOWN_METRIC_KEYS.filter(
    (key) => platformBreakdownMetricKeys.includes(key)
  );
  const pages: PageDefinition[] = [];

  if (selectedSections.coreMetrics) {
    pages.push({
      content: <CoreMetricsPage />,
      key: 'core-metrics',
    });
  }

  if (selectedSections.trends) {
    chunkItems(createTrendCardDefinitions(), 4).forEach((trendCards, index) => {
      pages.push({
        content: <TrendsPage trendCards={trendCards} />,
        key: `trends-${index}`,
      });
    });
  }

  if (selectedSections.platformBreakdown) {
    pages.push({
      content: (
        <PlatformBreakdownPage
          platformMetricKeys={visiblePlatformMetricKeys}
          platformSummaries={platformSummaries}
        />
      ),
      key: 'platform-breakdown',
    });
  }

  selectedAccountBreakdownSections.forEach((level) => {
    pages.push({
      content: <BreakdownPage level={level} />,
      key: `breakdown-${level}`,
    });
  });

  return (
    <Document
      author="Atlas"
      creator="Atlas"
      subject="Metrics export"
      title={fileName}
    >
      {pages.map((page, index) => (
        <Page
          key={page.key}
          size="A4"
          orientation="landscape"
          style={styles.page}
        >
          {index === 0 ? <PdfIntro fileName={fileName} /> : null}
          {page.content}
        </Page>
      ))}
    </Document>
  );
};

const PdfIntro = ({ fileName }: { fileName: string }) => {
  return (
    <View style={styles.intro}>
      <Text style={styles.introTitle}>{fileName}</Text>
    </View>
  );
};

const SectionHeading = ({ title }: { title: string }) => {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
};

const CoreMetricsPage = () => {
  const metricRows = chunkItems(MOCK_METRICS, 4);

  return (
    <View style={styles.section}>
      <SectionHeading title="Core Metrics" />
      {metricRows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={
            rowIndex < metricRows.length - 1
              ? [styles.twoColumnRow, styles.rowGap]
              : styles.twoColumnRow
          }
        >
          {row.map((metric) => (
            <CoreMetricCard
              key={metric.id}
              title={metric.title}
              trend={metric.trend}
              value={metric.value}
              percentageChange={metric.percentageChange}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const CoreMetricCard = ({
  percentageChange,
  title,
  trend,
  value,
}: {
  percentageChange: number;
  title: string;
  trend: 'positive' | 'negative' | 'neutral';
  value: string;
}) => {
  return (
    <View
      style={[
        styles.card,
        styles.gridCardQuarter,
        { backgroundColor: '#FCFCFC' },
      ]}
      wrap={false}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.metricValue}>{value}</Text>
      </View>
      <View style={styles.cardFooter}>
        <Text
          style={[
            styles.metricTrend,
            trend === 'positive'
              ? styles.trendPositive
              : trend === 'negative'
                ? styles.trendNegative
                : styles.trendNeutral,
          ]}
        >
          {formatMetricChange(percentageChange, trend)}
        </Text>
      </View>
    </View>
  );
};

const TrendsPage = ({
  trendCards,
}: {
  trendCards: Array<ReturnType<typeof createTrendCardDefinitions>[number]>;
}) => {
  const rows = chunkItems(trendCards, 2);

  return (
    <View style={styles.section}>
      <SectionHeading title="Trends" />
      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={
            rowIndex < rows.length - 1
              ? [styles.twoColumnRow, styles.rowGap]
              : styles.twoColumnRow
          }
        >
          {row.map((card) => (
            <MetricsChartCard
              key={card.title}
              summary={card.summary}
              summaryLabel={card.summaryLabel}
              title={card.title}
            >
              {card.chart}
            </MetricsChartCard>
          ))}
        </View>
      ))}
    </View>
  );
};

const PlatformBreakdownPage = ({
  platformMetricKeys,
  platformSummaries,
}: {
  platformMetricKeys: PlatformBreakdownMetricKey[];
  platformSummaries: PlatformMetricSummary[];
}) => {
  return (
    <View style={styles.section}>
      <SectionHeading title="Platform Breakdown" />
      {platformSummaries.length === 0 || platformMetricKeys.length === 0 ? (
        <Text style={styles.emptyState}>
          The current view does not include any platform metrics to render.
        </Text>
      ) : (
        <View style={styles.card} wrap={false}>
          <View style={[styles.cardHeader, styles.platformCardHeader]}>
            <View style={styles.platformHeaderGrid}>
              <Text
                style={[styles.platformHeaderText, styles.platformMetricColumn]}
              >
                Metric
              </Text>
              {platformSummaries.map((summary) => (
                <View
                  key={summary.platform}
                  style={[
                    styles.platformValueColumn,
                    styles.platformHeaderLabel,
                  ]}
                >
                  <PlatformLogo platform={summary.platform} />
                  <Text style={styles.platformHeaderName}>
                    {formatPlatformName(summary.platform)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.platformRows}>
            {platformMetricKeys.map((metricKey, index) => (
              <View key={metricKey}>
                {index > 0 ? <View style={styles.separator} /> : null}
                <View style={styles.platformRow}>
                  <Text
                    style={[
                      styles.platformMetricLabel,
                      styles.platformMetricColumn,
                    ]}
                  >
                    {PLATFORM_BREAKDOWN_METRIC_LABELS[metricKey]}
                  </Text>
                  {platformSummaries.map((summary) => (
                    <Text
                      key={`${summary.platform}-${metricKey}`}
                      style={[
                        styles.platformMetricValue,
                        styles.platformValueColumn,
                      ]}
                    >
                      {formatPlatformMetric(metricKey, summary[metricKey])}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const BreakdownPage = ({ level }: { level: PerformanceLevel }) => {
  const rows = getPerformanceRows(level);
  const totalRows = rows.length;
  const compositionBreakdown = createCompositionBreakdown(level, rows);
  const statusBreakdown = createStatusBreakdown(rows, totalRows);
  const rankedRows = [...rows].sort((leftRow, rightRow) =>
    comparePerformanceRows(leftRow, rightRow)
  );
  const topPerformers = rankedRows.slice(0, DISPLAY_ROW_LIMIT);
  const bottomPerformers = rankedRows.slice(-DISPLAY_ROW_LIMIT).reverse();

  return (
    <View style={styles.section}>
      <SectionHeading title={getBreakdownPageTitle(level)} />
      <View style={[styles.twoColumnRow, styles.rowGap]}>
        <MetricsChartCard
          summary={String(totalRows)}
          summaryLabel={getBreakdownSummaryLabel(level)}
          title={getCompositionChartTitle(level)}
        >
          <PieChartBlock
            data={compositionBreakdown}
            legends={compositionBreakdown.map((slice) => ({
              color: slice.color,
              label: slice.label,
              platform: slice.platform,
              value: `${slice.value} (${formatPercentage(slice.percentage)})`,
            }))}
          />
        </MetricsChartCard>
        <MetricsChartCard
          summary={String(totalRows)}
          summaryLabel={getBreakdownSummaryLabel(level)}
          title={getStatusChartTitle(level)}
        >
          <PieChartBlock
            data={statusBreakdown}
            legends={statusBreakdown.map((slice) => ({
              color: slice.color,
              label: slice.label,
              value: `${slice.value} (${formatPercentage(slice.percentage)})`,
            }))}
          />
        </MetricsChartCard>
      </View>
      <PerformanceListCard
        level={level}
        rows={topPerformers}
        title="Top Performers"
      />
      <View style={{ marginTop: SECTION_GAP }}>
        <PerformanceListCard
          level={level}
          rows={bottomPerformers}
          title="Bottom Performers"
        />
      </View>
    </View>
  );
};

const MetricsChartCard = ({
  children,
  summary,
  summaryLabel,
  title,
}: {
  children: ReactElement;
  summary: string;
  summaryLabel: string;
  title: string;
}) => {
  return (
    <View style={[styles.card, styles.gridCardHalf]} wrap={false}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.chartSummaryWrap}>
          <Text style={styles.chartSummary}>{summary}</Text>
          <Text style={styles.chartSummaryLabel}>{summaryLabel}</Text>
        </View>
        {children}
      </View>
    </View>
  );
};

const ChartBlock = ({
  chart,
  legend,
}: {
  chart: ReactElement;
  legend?: LegendItem[];
}) => {
  return (
    <View>
      <View style={styles.chartContainer}>
        <ReactPDFChart>{chart}</ReactPDFChart>
      </View>
      {legend?.length ? (
        <View style={styles.pieLegend}>
          {legend.map((item) => (
            <View
              key={`${item.label}-${item.value ?? ''}`}
              style={styles.pieLegendRow}
            >
              <View style={styles.legendLeft}>
                <View
                  style={[styles.legendDot, { backgroundColor: item.color }]}
                />
                <Text style={styles.legendLabel}>{item.label}</Text>
              </View>
              <Text style={styles.legendValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
};

const PieChartBlock = ({
  data,
  legends,
}: {
  data: PieSlice[];
  legends: LegendItem[];
}) => {
  return (
    <View>
      <View style={styles.chartContainer}>
        <ReactPDFChart>
          <DonutChartSvg data={data} />
        </ReactPDFChart>
      </View>
      <View style={styles.pieLegend}>
        {legends.map((item) => (
          <View
            key={`${item.label}-${item.value ?? ''}`}
            style={styles.pieLegendRow}
          >
            <View style={styles.legendLeft}>
              <View
                style={[styles.legendDot, { backgroundColor: item.color }]}
              />
              {item.platform ? (
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                  <PlatformLogo platform={item.platform} />
                  <Text style={[styles.legendLabel, { marginLeft: 6 }]}>
                    {item.label}
                  </Text>
                </View>
              ) : (
                <Text style={styles.legendLabel}>{item.label}</Text>
              )}
            </View>
            <Text style={styles.legendValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const PerformanceListCard = ({
  level,
  rows,
  title,
}: {
  level: PerformanceLevel;
  rows: MetricsPerformanceRow[];
  title: string;
}) => {
  return (
    <View style={styles.card} wrap={false}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardHeaderMetric}>ROAS</Text>
        </View>
      </View>
      <View
        style={[
          styles.cardContent,
          styles.performanceCardInner,
          styles.performanceListContent,
        ]}
      >
        {rows.length === 0 ? (
          <Text style={styles.emptyState}>
            No performance data is available right now.
          </Text>
        ) : (
          rows.map((row, index) => (
            <View key={row.id}>
              {index > 0 ? <View style={styles.separator} /> : null}
              <View style={styles.performanceRow}>
                <View style={styles.performanceRowLeft}>
                  {level === 'ad' && getPerformanceRowThumbnail(row) ? (
                    <PdfImage
                      src={getPerformanceRowThumbnail(row)}
                      style={styles.performanceThumbnail}
                    />
                  ) : null}
                  <View style={styles.performanceMeta}>
                    <Text style={styles.performanceName}>{row.name}</Text>
                    <View style={styles.performanceContext}>
                      <PlatformLogo platform={row.adAccount.platform} />
                      <Text
                        style={[
                          styles.performanceContextText,
                          { marginLeft: 6 },
                        ]}
                      >
                        {row.adAccount.name}
                      </Text>
                      {row.campaignName ? (
                        <Text style={styles.performanceContextText}>
                          / {row.campaignName}
                        </Text>
                      ) : null}
                      {row.adSetName ? (
                        <Text style={styles.performanceContextText}>
                          / {row.adSetName}
                        </Text>
                      ) : null}
                      <Text style={styles.performanceContextText}>
                        / {formatCampaignStatus(row.status)}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.performanceValue}>{row.metrics.roas}</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

const PlatformLogo = ({ platform }: { platform: AdPlatform }) => {
  return platform === 'google' ? <GoogleAdsLogoMark /> : <MetaLogoMark />;
};

const MetaLogoMark = () => {
  return (
    <Svg width={14} height={9} viewBox="0 0 256 171">
      <Defs>
        <LinearGradient
          id="metaGradientOne"
          x1="13.878%"
          x2="89.144%"
          y1="55.934%"
          y2="58.694%"
        >
          <Stop offset="0%" stopColor="#0064E1" />
          <Stop offset="40%" stopColor="#0064E1" />
          <Stop offset="83%" stopColor="#0073EE" />
          <Stop offset="100%" stopColor="#0082FB" />
        </LinearGradient>
        <LinearGradient
          id="metaGradientTwo"
          x1="54.315%"
          x2="54.315%"
          y1="82.782%"
          y2="39.307%"
        >
          <Stop offset="0%" stopColor="#0082FB" />
          <Stop offset="100%" stopColor="#0064E0" />
        </LinearGradient>
      </Defs>
      <Path
        fill="#0081FB"
        d="M27.651 112.136c0 9.775 2.146 17.28 4.95 21.82c3.677 5.947 9.16 8.466 14.751 8.466c7.211 0 13.808-1.79 26.52-19.372c10.185-14.092 22.186-33.874 30.26-46.275l13.675-21.01c9.499-14.591 20.493-30.811 33.1-41.806C161.196 4.985 172.298 0 183.47 0c18.758 0 36.625 10.87 50.3 31.257C248.735 53.584 256 81.707 256 110.729c0 17.253-3.4 29.93-9.187 39.946c-5.591 9.686-16.488 19.363-34.818 19.363v-27.616c15.695 0 19.612-14.422 19.612-30.927c0-23.52-5.484-49.623-17.564-68.273c-8.574-13.23-19.684-21.313-31.907-21.313c-13.22 0-23.859 9.97-35.815 27.75c-6.356 9.445-12.882 20.956-20.208 33.944l-8.066 14.289c-16.203 28.728-20.307 35.271-28.408 46.07c-14.2 18.91-26.324 26.076-42.287 26.076c-18.935 0-30.91-8.2-38.325-20.556C2.973 139.413 0 126.202 0 111.148z"
      />
      <Path
        fill="url(#metaGradientOne)"
        d="M21.802 33.206C34.48 13.666 52.774 0 73.757 0C85.91 0 97.99 3.597 110.605 13.897c13.798 11.261 28.505 29.805 46.853 60.368l6.58 10.967c15.881 26.459 24.917 40.07 30.205 46.49c6.802 8.243 11.565 10.7 17.752 10.7c15.695 0 19.612-14.422 19.612-30.927l24.393-.766c0 17.253-3.4 29.93-9.187 39.946c-5.591 9.686-16.488 19.363-34.818 19.363c-11.395 0-21.49-2.475-32.654-13.007c-8.582-8.083-18.615-22.443-26.334-35.352l-22.96-38.352C118.528 64.08 107.96 49.73 101.845 43.23c-6.578-6.988-15.036-15.428-28.532-15.428c-10.923 0-20.2 7.666-27.963 19.39z"
      />
      <Path
        fill="url(#metaGradientTwo)"
        d="M73.312 27.802c-10.923 0-20.2 7.666-27.963 19.39c-10.976 16.568-17.698 41.245-17.698 64.944c0 9.775 2.146 17.28 4.95 21.82L9.027 149.482C2.973 139.413 0 126.202 0 111.148C0 83.772 7.514 55.24 21.802 33.206C34.48 13.666 52.774 0 73.757 0z"
      />
    </Svg>
  );
};

const GoogleAdsLogoMark = () => {
  return (
    <Svg width={14} height={12} viewBox="0 0 256 230">
      <Path
        fill="#FBBC04"
        d="M5.888 166.405L90.88 20.9c10.796 6.356 65.236 36.484 74.028 42.214L79.916 208.627c-9.295 12.28-85.804-23.587-74.028-42.23z"
      />
      <Path
        fill="#4285F4"
        d="M250.084 166.402L165.092 20.906C153.21 1.132 127.62-6.054 106.601 5.625S79.182 42.462 91.064 63.119l84.992 145.514c11.882 19.765 37.473 26.95 58.492 15.272c20.1-11.68 27.418-37.73 15.536-57.486z"
      />
      <Ellipse
        cx="42.664"
        cy="187.924"
        fill="#34A853"
        rx="42.664"
        ry="41.604"
      />
    </Svg>
  );
};

const DonutChartSvg = ({ data }: { data: PieSlice[] }) => {
  const center = DONUT_SIZE / 2;
  const outerRadius = 62;
  const innerRadius = 38;
  const slices = data.reduce<
    Array<{
      color: string;
      label: string;
      nextAngle: number;
      path: string;
    }>
  >((items, slice) => {
    const startAngle =
      items.length === 0 ? -90 : items[items.length - 1].nextAngle;
    const angle = Math.max(slice.percentage * 360, 3);
    const endAngle = startAngle + angle;

    return [
      ...items,
      {
        color: slice.color,
        label: slice.label,
        nextAngle: endAngle + 1.5,
        path: describeDonutSlice(
          center,
          center,
          outerRadius,
          innerRadius,
          startAngle,
          endAngle
        ),
      },
    ];
  }, []);

  return (
    <svg
      height={DONUT_SIZE}
      viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}
      width={DONUT_SIZE}
    >
      <circle
        cx={center}
        cy={center}
        fill="none"
        r={outerRadius}
        stroke={MUTED}
        strokeWidth={outerRadius - innerRadius}
      />
      {slices.map((slice) => (
        <path key={slice.label} d={slice.path} fill={slice.color} />
      ))}
    </svg>
  );
};

const AreaTrendSvg = ({
  color,
  data,
  fillColor,
}: {
  color: string;
  data: Array<{ label: string; value: number }>;
  fillColor: string;
}) => {
  const bounds = getChartBounds();
  const points = createChartPoints(
    data.map((item) => item.value),
    bounds,
    getPaddedRange(
      data.map((item) => item.value),
      0.18
    )
  );

  return (
    <svg
      height={CHART_HEIGHT}
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      width={CHART_WIDTH}
    >
      {renderGrid(
        bounds,
        data.map((item) => item.label)
      )}
      <path
        d={createAreaPath(points, bounds.bottom)}
        fill={fillColor}
        fillOpacity="0.35"
      />
      <path
        d={createLinePath(points)}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
      />
    </svg>
  );
};

const DualLineTrendSvg = ({
  data,
  primaryColor,
  secondaryColor,
}: {
  data: Array<{ label: string; primaryValue: number; secondaryValue: number }>;
  primaryColor: string;
  secondaryColor: string;
}) => {
  const bounds = getChartBounds();
  const primaryValues = data.map((item) => item.primaryValue);
  const secondaryValues = data.map((item) => item.secondaryValue);
  const range = getRangeFromMultiple(
    [primaryValues, secondaryValues],
    0.12,
    true
  );
  const primaryPoints = createChartPoints(primaryValues, bounds, range);
  const secondaryPoints = createChartPoints(secondaryValues, bounds, range);

  return (
    <svg
      height={CHART_HEIGHT}
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      width={CHART_WIDTH}
    >
      {renderGrid(
        bounds,
        data.map((item) => item.label)
      )}
      <path
        d={createLinePath(primaryPoints)}
        fill="none"
        stroke={primaryColor}
        strokeWidth="2.5"
      />
      <path
        d={createLinePath(secondaryPoints)}
        fill="none"
        stroke={secondaryColor}
        strokeWidth="2.5"
      />
    </svg>
  );
};

const BarLineTrendSvg = ({
  barColor,
  data,
  lineColor,
}: {
  barColor: string;
  data: Array<{ barValue: number; label: string; lineValue: number }>;
  lineColor: string;
}) => {
  const bounds = getChartBounds();
  const range = getRangeFromMultiple(
    [data.map((item) => item.barValue), data.map((item) => item.lineValue)],
    0.12,
    true
  );
  const step = bounds.width / data.length;
  const barWidth = step * 0.48;
  const linePoints = createChartPoints(
    data.map((item) => item.lineValue),
    {
      ...bounds,
      left: bounds.left + step / 2,
      width: bounds.width - step,
    },
    range
  );

  return (
    <svg
      height={CHART_HEIGHT}
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      width={CHART_WIDTH}
    >
      {renderGrid(
        bounds,
        data.map((item) => item.label)
      )}
      {data.map((item, index) => {
        const x = bounds.left + step * index + (step - barWidth) / 2;
        const y = scaleValue(
          item.barValue,
          range.min,
          range.max,
          bounds.bottom,
          bounds.top
        );
        const height = bounds.bottom - y;

        return (
          <rect
            key={item.label}
            fill={barColor}
            height={Math.max(4, height)}
            rx="6"
            ry="6"
            width={barWidth}
            x={x}
            y={y}
          />
        );
      })}
      <path
        d={createLinePath(linePoints)}
        fill="none"
        stroke={lineColor}
        strokeWidth="2.5"
      />
    </svg>
  );
};

function createTrendCardDefinitions() {
  const latestTrendPoint = MOCK_METRIC_TRENDS[MOCK_METRIC_TRENDS.length - 1];

  return [
    {
      chart: (
        <ChartBlock
          chart={
            <AreaTrendSvg
              color={CHART_COLORS.ctr}
              data={MOCK_METRIC_TRENDS.map((point) => ({
                label: point.month,
                value: point.ctr,
              }))}
              fillColor={CHART_COLORS.fillBlue}
            />
          }
        />
      ),
      summary: formatPercent(latestTrendPoint.ctr),
      summaryLabel: 'Latest monthly click-through rate',
      title: 'CTR Momentum',
    },
    {
      chart: (
        <ChartBlock
          chart={
            <AreaTrendSvg
              color={CHART_COLORS.roas}
              data={MOCK_METRIC_TRENDS.map((point) => ({
                label: point.month,
                value: point.roas,
              }))}
              fillColor="#B7F7DE"
            />
          }
        />
      ),
      summary: formatMultiplier(latestTrendPoint.roas),
      summaryLabel: 'Latest monthly efficiency multiple',
      title: 'ROAS Trajectory',
    },
    {
      chart: (
        <ChartBlock
          chart={
            <DualLineTrendSvg
              data={MOCK_METRIC_TRENDS.map((point) => ({
                label: point.month,
                primaryValue: point.impressions,
                secondaryValue: point.reach,
              }))}
              primaryColor={CHART_COLORS.ctr}
              secondaryColor={CHART_COLORS.audience}
            />
          }
          legend={[
            {
              color: CHART_COLORS.ctr,
              label: 'Impressions',
            },
            {
              color: CHART_COLORS.audience,
              label: 'Reach',
            },
          ]}
        />
      ),
      summary: `${formatCompactNumber(latestTrendPoint.impressions)} / ${formatCompactNumber(latestTrendPoint.reach)}`,
      summaryLabel: 'Impressions vs reach in the latest month',
      title: 'Audience Scale',
    },
    {
      chart: (
        <ChartBlock
          chart={
            <BarLineTrendSvg
              barColor={CHART_COLORS.spend}
              data={MOCK_METRIC_TRENDS.map((point) => ({
                barValue: point.spend,
                label: point.month,
                lineValue: point.revenue,
              }))}
              lineColor={CHART_COLORS.revenue}
            />
          }
          legend={[
            {
              color: CHART_COLORS.spend,
              label: 'Spend',
            },
            {
              color: CHART_COLORS.revenue,
              label: 'Revenue',
            },
          ]}
        />
      ),
      summary: `${formatCurrency(latestTrendPoint.revenue)} / ${formatCurrency(latestTrendPoint.spend)}`,
      summaryLabel: 'Revenue vs spend in the latest month',
      title: 'Revenue vs Spend',
    },
  ];
}

function createPlatformSummaries(
  campaignRows: Array<{
    adAccount: {
      platform: AdPlatform;
    };
    metrics: MockCampaignMetrics;
  }>
) {
  const platformMap = new Map<AdPlatform, PlatformMetricSummary>(
    PLATFORM_ORDER.map((platform) => [
      platform,
      {
        campaignCount: 0,
        clicks: 0,
        cpc: 0,
        ctr: 0,
        impressions: 0,
        platform,
        reach: 0,
        revenue: 0,
        roas: 0,
        spend: 0,
      },
    ])
  );

  campaignRows.forEach((campaign) => {
    const summary = platformMap.get(campaign.adAccount.platform);

    if (!summary) {
      return;
    }

    summary.campaignCount += 1;
    summary.impressions += parseMetricValue(campaign.metrics.impressions);
    summary.clicks += parseMetricValue(campaign.metrics.clicks);
    summary.spend += parseMetricValue(campaign.metrics.spend);
    summary.reach += parseMetricValue(campaign.metrics.reach);
    summary.revenue += parseMetricValue(campaign.metrics.revenue);
  });

  return PLATFORM_ORDER.map((platform) => {
    const summary = platformMap.get(platform);

    if (!summary) {
      return {
        campaignCount: 0,
        clicks: 0,
        cpc: 0,
        ctr: 0,
        impressions: 0,
        platform,
        reach: 0,
        revenue: 0,
        roas: 0,
        spend: 0,
      };
    }

    return {
      ...summary,
      cpc: summary.clicks === 0 ? 0 : summary.spend / summary.clicks,
      ctr:
        summary.impressions === 0
          ? 0
          : (summary.clicks / summary.impressions) * 100,
      roas: summary.spend === 0 ? 0 : summary.revenue / summary.spend,
    };
  });
}

function createCompositionBreakdown(
  level: PerformanceLevel,
  rows: MetricsPerformanceRow[]
): PieSlice[] {
  if (level === 'campaign') {
    return createAdAccountBreakdown(rows);
  }

  if (level === 'adSet') {
    return createCampaignBreakdown(rows);
  }

  return createAdSetBreakdown(rows);
}

function createAdAccountBreakdown(rows: MetricsPerformanceRow[]): PieSlice[] {
  const breakdownByAccount = new Map<string, number>();
  let metaColorIndex = 0;
  let googleColorIndex = 0;

  rows.forEach((row) => {
    breakdownByAccount.set(
      row.adAccount.id,
      (breakdownByAccount.get(row.adAccount.id) ?? 0) + 1
    );
  });

  return Array.from(breakdownByAccount.entries())
    .flatMap(([adAccountId, value]) => {
      const row = rows.find((item) => item.adAccount.id === adAccountId);

      if (!row) {
        return [];
      }

      const color =
        row.adAccount.platform === 'google'
          ? GOOGLE_ACCOUNT_COLORS[
              googleColorIndex++ % GOOGLE_ACCOUNT_COLORS.length
            ]
          : META_ACCOUNT_COLORS[metaColorIndex++ % META_ACCOUNT_COLORS.length];

      return [
        {
          color,
          label: row.adAccount.name,
          percentage: rows.length === 0 ? 0 : value / rows.length,
          platform: row.adAccount.platform,
          value,
        },
      ];
    })
    .sort((left, right) => right.value - left.value);
}

function createCampaignBreakdown(rows: MetricsPerformanceRow[]): PieSlice[] {
  const breakdownByCampaign = new Map<string, number>();

  rows.forEach((row) => {
    const campaignName = row.campaignName;

    if (!campaignName) {
      return;
    }

    breakdownByCampaign.set(
      campaignName,
      (breakdownByCampaign.get(campaignName) ?? 0) + 1
    );
  });

  return Array.from(breakdownByCampaign.entries())
    .map(([campaignName, value], index) => ({
      color: CAMPAIGN_COLORS[index % CAMPAIGN_COLORS.length],
      label: campaignName,
      percentage: rows.length === 0 ? 0 : value / rows.length,
      value,
    }))
    .sort((left, right) => right.value - left.value);
}

function createAdSetBreakdown(rows: MetricsPerformanceRow[]): PieSlice[] {
  const breakdownByAdSet = new Map<string, number>();

  rows.forEach((row) => {
    if (!row.adSetName) {
      return;
    }

    breakdownByAdSet.set(
      row.adSetName,
      (breakdownByAdSet.get(row.adSetName) ?? 0) + 1
    );
  });

  return Array.from(breakdownByAdSet.entries())
    .map(([adSetName, value], index) => ({
      color: CAMPAIGN_COLORS[index % CAMPAIGN_COLORS.length],
      label: adSetName,
      percentage: rows.length === 0 ? 0 : value / rows.length,
      value,
    }))
    .sort((left, right) => right.value - left.value);
}

function createStatusBreakdown(
  rows: MetricsPerformanceRow[],
  totalRows: number
) {
  return CAMPAIGN_PERFORMANCE_STATUSES.map((status) => {
    const value = rows.filter((row) => row.status === status).length;

    return {
      color: STATUS_COLORS[status],
      label: toTitleCase(formatCampaignStatus(status)),
      percentage: totalRows === 0 ? 0 : value / totalRows,
      value,
    };
  })
    .filter((slice) => slice.value > 0)
    .sort((left, right) => right.value - left.value);
}

function comparePerformanceRows(
  leftRow: MetricsPerformanceRow,
  rightRow: MetricsPerformanceRow
) {
  const roasDifference =
    parseMetricValue(rightRow.metrics.roas) -
    parseMetricValue(leftRow.metrics.roas);

  if (roasDifference !== 0) {
    return roasDifference;
  }

  return (
    parseMetricValue(rightRow.metrics.revenue) -
    parseMetricValue(leftRow.metrics.revenue)
  );
}

function getPerformanceRowThumbnail(row: MetricsPerformanceRow) {
  if (!row.previewMedia) {
    return '';
  }

  if (row.previewMedia.type === 'video') {
    return row.previewMedia.posterSrc ?? row.previewMedia.src;
  }

  return row.previewMedia.src;
}

function chunkItems<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

function renderGrid(
  bounds: ReturnType<typeof getChartBounds>,
  labels: string[]
) {
  const gridLines = 4;
  const step = labels.length > 1 ? bounds.width / (labels.length - 1) : 0;

  return (
    <>
      {Array.from({ length: gridLines }).map((_, index) => {
        const y = bounds.top + (bounds.height / (gridLines - 1)) * index;

        return (
          <line
            key={`grid-${index}`}
            stroke={CHART_COLORS.grid}
            strokeDasharray="3 3"
            strokeWidth="1"
            x1={bounds.left}
            x2={bounds.right}
            y1={y}
            y2={y}
          />
        );
      })}
      {labels.map((label, index) => {
        const x = bounds.left + step * index;

        return (
          <text
            key={label}
            fill={CHART_COLORS.labels}
            fontFamily={FONT_FAMILY}
            fontSize="9"
            textAnchor={
              index === 0
                ? 'start'
                : index === labels.length - 1
                  ? 'end'
                  : 'middle'
            }
            x={x}
            y={CHART_HEIGHT - 8}
          >
            {label}
          </text>
        );
      })}
    </>
  );
}

function getChartBounds() {
  const left = 12;
  const top = 8;
  const right = CHART_WIDTH - 10;
  const bottom = CHART_HEIGHT - 24;

  return {
    bottom,
    height: bottom - top,
    left,
    right,
    top,
    width: right - left,
  };
}

function createChartPoints(
  values: number[],
  bounds: ReturnType<typeof getChartBounds>,
  range: { max: number; min: number }
) {
  if (values.length === 1) {
    return [
      {
        x: bounds.left + bounds.width / 2,
        y: scaleValue(
          values[0],
          range.min,
          range.max,
          bounds.bottom,
          bounds.top
        ),
      },
    ];
  }

  return values.map((value, index) => ({
    x: bounds.left + (bounds.width / (values.length - 1)) * index,
    y: scaleValue(value, range.min, range.max, bounds.bottom, bounds.top),
  }));
}

function getPaddedRange(values: number[], paddingRatio: number) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const delta = max - min || max * 0.1 || 1;
  const padding = delta * paddingRatio;

  return {
    max: max + padding,
    min: Math.max(0, min - padding),
  };
}

function getRangeFromMultiple(
  valueGroups: number[][],
  paddingRatio: number,
  clampToZero: boolean
) {
  const values = valueGroups.flat();
  const min = Math.min(...values);
  const max = Math.max(...values);
  const delta = max - min || max * 0.1 || 1;
  const padding = delta * paddingRatio;

  return {
    max: max + padding,
    min: clampToZero ? Math.max(0, min - padding) : min - padding,
  };
}

function scaleValue(
  value: number,
  domainMin: number,
  domainMax: number,
  rangeMin: number,
  rangeMax: number
) {
  if (domainMax === domainMin) {
    return (rangeMin + rangeMax) / 2;
  }

  const ratio = (value - domainMin) / (domainMax - domainMin);

  return rangeMin - ratio * (rangeMin - rangeMax);
}

function createLinePath(points: Point[]) {
  if (points.length === 0) {
    return '';
  }

  return points
    .map(
      (point, index) =>
        `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`
    )
    .join(' ');
}

function createAreaPath(points: Point[], baselineY: number) {
  if (points.length === 0) {
    return '';
  }

  const linePath = createLinePath(points);
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];

  return `${linePath} L ${lastPoint.x.toFixed(2)} ${baselineY.toFixed(2)} L ${firstPoint.x.toFixed(2)} ${baselineY.toFixed(2)} Z`;
}

function describeDonutSlice(
  centerX: number,
  centerY: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number
) {
  const outerStart = polarToCartesian(centerX, centerY, outerRadius, endAngle);
  const outerEnd = polarToCartesian(centerX, centerY, outerRadius, startAngle);
  const innerStart = polarToCartesian(
    centerX,
    centerY,
    innerRadius,
    startAngle
  );
  const innerEnd = polarToCartesian(centerX, centerY, innerRadius, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${innerEnd.x} ${innerEnd.y}`,
    'Z',
  ].join(' ');
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function formatPlatformMetric(key: PlatformBreakdownMetricKey, value: number) {
  if (key === 'spend' || key === 'revenue') {
    return compactCurrencyFormatter.format(value);
  }

  if (key === 'cpc') {
    return unitCurrencyFormatter.format(value);
  }

  if (key === 'ctr') {
    return `${value.toFixed(2)}%`;
  }

  if (key === 'roas') {
    return `${value.toFixed(2)}x`;
  }

  return compactNumberFormatter.format(value);
}

function formatMetricChange(
  percentageChange: number,
  trend: 'positive' | 'negative' | 'neutral'
) {
  if (trend === 'positive') {
    return `↑ ${percentageChange}%`;
  }

  if (trend === 'negative') {
    return `↓ ${percentageChange}%`;
  }

  return `- ${percentageChange}%`;
}

function formatPlatformName(platform: AdPlatform) {
  return platform === 'meta' ? 'Meta Ads' : 'Google Ads';
}

function parseMetricValue(value: string) {
  const normalizedValue = value.replace(/[$,%x,]/g, '').trim();

  if (normalizedValue.length === 0) {
    return 0;
  }

  const suffix = normalizedValue.at(-1);
  const multiplier =
    suffix === 'K'
      ? 1_000
      : suffix === 'M'
        ? 1_000_000
        : suffix === 'B'
          ? 1_000_000_000
          : 1;
  const numericPortion =
    multiplier === 1 ? normalizedValue : normalizedValue.slice(0, -1);

  return Number(numericPortion) * multiplier;
}

function formatCompactNumber(value: number) {
  return compactNumberFormatter.format(value);
}

function formatCurrency(value: number) {
  return compactCurrencyFormatter.format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

function formatMultiplier(value: number) {
  return `${value.toFixed(2)}x`;
}

function formatPercentage(value: number) {
  const percentageValue = value * 100;

  return `${percentageValue.toFixed(percentageValue >= 10 ? 0 : 1)}%`;
}

function toTitleCase(value: string) {
  return value.replace(/\b\w/g, (character) => character.toUpperCase());
}

function getBreakdownPageTitle(level: PerformanceLevel) {
  if (level === 'campaign') {
    return 'Campaign Breakdown';
  }

  if (level === 'adSet') {
    return 'Ad Set Breakdown';
  }

  return 'Ad Breakdown';
}

function getBreakdownSummaryLabel(level: PerformanceLevel) {
  if (level === 'campaign') {
    return 'Total campaigns in the current breakdown';
  }

  if (level === 'adSet') {
    return 'Total ad sets in the current breakdown';
  }

  return 'Total ads in the current breakdown';
}

function getCompositionChartTitle(level: PerformanceLevel) {
  if (level === 'campaign') {
    return 'Campaigns by Ad Account';
  }

  if (level === 'adSet') {
    return 'Ad Sets by Campaign';
  }

  return 'Ads by Ad Set';
}

function getStatusChartTitle(level: PerformanceLevel) {
  if (level === 'campaign') {
    return 'Campaigns by Status';
  }

  if (level === 'adSet') {
    return 'Ad Sets by Status';
  }

  return 'Ads by Status';
}
