'use client';

import { MetricsChartCard } from '@/app/(protected)/metrics/components/metrics-chart-card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { MOCK_METRIC_TRENDS } from '@/mock-data/metric-trends';
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';

const ctrChartConfig = {
  ctr: {
    label: 'CTR',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

const roasChartConfig = {
  roas: {
    label: 'ROAS',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

const audienceChartConfig = {
  impressions: {
    label: 'Impressions',
    color: 'var(--chart-1)',
  },
  reach: {
    label: 'Reach',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

const revenueEfficiencyChartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'var(--chart-2)',
  },
  spend: {
    label: 'Spend',
    color: 'var(--chart-4)',
  },
} satisfies ChartConfig;

const latestTrendPoint = MOCK_METRIC_TRENDS[MOCK_METRIC_TRENDS.length - 1];

export const MetricsTrendsGrid = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <MetricsChartCard
        title="CTR Momentum"
        description="Click-through rate movement over the last six reporting months."
        summary={formatPercent(latestTrendPoint.ctr)}
        summaryLabel="Latest monthly click-through rate"
      >
        <ChartContainer className="h-56 w-full" config={ctrChartConfig}>
          <AreaChart data={MOCK_METRIC_TRENDS} accessibilityLayer>
            <defs>
              <linearGradient id="ctr-fill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-ctr)"
                  stopOpacity={0.28}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-ctr)"
                  stopOpacity={0.04}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis hide domain={['dataMin - 0.1', 'dataMax + 0.1']} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              type="monotone"
              dataKey="ctr"
              stroke="var(--color-ctr)"
              strokeWidth={2}
              fill="url(#ctr-fill)"
            />
          </AreaChart>
        </ChartContainer>
      </MetricsChartCard>

      <MetricsChartCard
        title="ROAS Trajectory"
        description="Return on ad spend tracked month over month."
        summary={formatMultiplier(latestTrendPoint.roas)}
        summaryLabel="Latest monthly efficiency multiple"
      >
        <ChartContainer className="h-56 w-full" config={roasChartConfig}>
          <AreaChart data={MOCK_METRIC_TRENDS} accessibilityLayer>
            <defs>
              <linearGradient id="roas-fill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-roas)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-roas)"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis hide domain={['dataMin - 0.1', 'dataMax + 0.1']} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              type="monotone"
              dataKey="roas"
              stroke="var(--color-roas)"
              strokeWidth={2}
              fill="url(#roas-fill)"
            />
          </AreaChart>
        </ChartContainer>
      </MetricsChartCard>

      <MetricsChartCard
        title="Audience Scale"
        description="Compare monthly impression delivery against unique reach."
        summary={`${formatCompactNumber(latestTrendPoint.impressions)} / ${formatCompactNumber(latestTrendPoint.reach)}`}
        summaryLabel="Impressions vs reach in the latest month"
      >
        <ChartContainer className="h-56 w-full" config={audienceChartConfig}>
          <LineChart data={MOCK_METRIC_TRENDS} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              hide
              tickFormatter={formatCompactNumber}
              domain={[0, 'dataMax + 300000']}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey="impressions"
              stroke="var(--color-impressions)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="reach"
              stroke="var(--color-reach)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </MetricsChartCard>

      <MetricsChartCard
        title="Revenue vs Spend"
        description="Attributed revenue compared with media spend over the same period."
        summary={`${formatCurrency(latestTrendPoint.revenue)} / ${formatCurrency(latestTrendPoint.spend)}`}
        summaryLabel="Revenue vs spend in the latest month"
      >
        <ChartContainer
          className="h-56 w-full"
          config={revenueEfficiencyChartConfig}
        >
          <ComposedChart data={MOCK_METRIC_TRENDS} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              hide
              tickFormatter={formatCurrency}
              domain={[0, 'dataMax + 40000']}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="spend"
              fill="var(--color-spend)"
              radius={[8, 8, 0, 0]}
              maxBarSize={28}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ChartContainer>
      </MetricsChartCard>
    </div>
  );
};

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

function formatMultiplier(value: number) {
  return `${value.toFixed(2)}x`;
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}
