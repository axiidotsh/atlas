'use client';

import {
  formatCampaignStatus,
  type CampaignPerformanceRow,
} from '@/app/(protected)/metrics/config/campaign-performance.config';
import {
  PLATFORM_BREAKDOWN_METRIC_LABELS,
  type PlatformBreakdownMetricKey,
} from '@/app/(protected)/metrics/config/platform-breakdown.config';
import {
  getPerformanceRows,
  type MetricsPerformanceRow,
} from '@/app/(protected)/metrics/metrics-data';
import {
  AreaTrendSvg,
  BarLineTrendSvg,
  DonutChartSvg,
  DualLineTrendSvg,
} from '@/app/(protected)/metrics/pdf/pdf-charts';
import {
  CHART_COLORS,
  DISPLAY_ROW_LIMIT,
  SECTION_GAP,
  pdfStyles as styles,
} from '@/app/(protected)/metrics/pdf/pdf-design';
import {
  PLATFORM_BREAKDOWN_METRIC_KEYS,
  chunkItems,
  comparePerformanceRows,
  createCompositionBreakdown,
  createPlatformSummaries,
  createStatusBreakdown,
  formatCompactNumber,
  formatCurrency,
  formatMetricChange,
  formatMultiplier,
  formatPercent,
  formatPercentage,
  formatPlatformMetric,
  formatPlatformName,
  getBreakdownPageTitle,
  getBreakdownSummaryLabel,
  getCompositionChartTitle,
  getPerformanceRowThumbnail,
  getStatusChartTitle,
  type PieSlice,
  type PlatformMetricSummary,
} from '@/app/(protected)/metrics/pdf/pdf-formatters';
import { MOCK_METRIC_TRENDS } from '@/mock-data/metric-trends';
import { MOCK_METRICS } from '@/mock-data/metrics';
import type { AdPlatform, PerformanceLevel } from '@/mock-data/types';
import {
  Defs,
  Document,
  Ellipse,
  LinearGradient,
  Page,
  Path,
  Image as PdfImage,
  Stop,
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
