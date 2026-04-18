'use client';

import { formatCampaignStatus } from '@/app/(protected)/metrics/campaign-performance.config';
import { parseCampaignMetricValue } from '@/app/(protected)/metrics/campaign-performance.utils';
import {
  getCampaignPlatformIcon,
  getCampaignStatusClassName,
} from '@/app/(protected)/metrics/campaign-performance.utils';
import {
  AD_SET_PERFORMANCE_ROWS,
  CAMPAIGN_PERFORMANCE_ROWS,
  getMetricLabel,
  getPerformanceRows,
  type MetricsPerformanceRow,
} from '@/app/(protected)/metrics/metrics-data';
import { MetricsChartCard } from '@/app/(protected)/metrics/components/metrics-chart-card';
import { MetricsLevelToggle } from '@/app/(protected)/metrics/components/metrics-level-toggle';
import { GoogleAdsLogo, MetaLogo } from '@/components/icons';
import { SearchBar } from '@/components/search-bar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MOCK_METRICS } from '@/mock-data/metrics';
import type {
  AdPlatform,
  CampaignStatus,
  CoreMetricId,
  PerformanceLevel,
} from '@/mock-data/types';
import { cn } from '@/utils/utils';
import {
  ArrowUpRightIcon,
  ChevronDownIcon,
  Columns3CogIcon,
  FunnelIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Cell, Pie, PieChart } from 'recharts';

type PerformanceColumnId = 'adAccount' | 'status' | CoreMetricId;

interface PerformanceColumnOption {
  id: PerformanceColumnId;
  label: string;
  type: 'dimension' | 'metric';
}

interface PerformanceSectionState<T> {
  campaign: T;
  adSet: T;
}

interface BreakdownDatum {
  id: string;
  label: string;
  value: number;
  fill: string;
  percentage: number;
  platform?: AdPlatform;
}

const DISPLAY_LIMIT = 5;

const META_ACCOUNT_COLORS = ['var(--chart-1)', 'var(--chart-2)'] as const;

const GOOGLE_ACCOUNT_COLORS = ['#fbbc04', '#34a853'] as const;

const CAMPAIGN_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--primary)',
] as const;

const STATUS_COLORS: Record<CampaignStatus, string> = {
  ACTIVE: 'var(--primary)',
  PAUSED: 'var(--muted-foreground)',
  WITH_ISSUES: 'var(--destructive)',
  ENDED: 'var(--chart-4)',
};

const CAMPAIGN_DIMENSION_COLUMNS: PerformanceColumnOption[] = [
  { id: 'adAccount', label: 'Ad Account', type: 'dimension' },
  { id: 'status', label: 'Status', type: 'dimension' },
];

const AD_SET_DIMENSION_COLUMNS: PerformanceColumnOption[] = [
  { id: 'adAccount', label: 'Ad Account', type: 'dimension' },
  { id: 'status', label: 'Status', type: 'dimension' },
];

const METRIC_COLUMNS: PerformanceColumnOption[] = MOCK_METRICS.map((metric) => ({
  id: metric.id,
  label: metric.title,
  type: 'metric',
}));

const DEFAULT_VISIBLE_COLUMN_IDS: PerformanceSectionState<PerformanceColumnId[]> = {
  campaign: ['adAccount', 'status', 'impressions', 'spend', 'revenue', 'roas'],
  adSet: ['adAccount', 'status', 'impressions', 'spend', 'revenue', 'roas'],
};

export const MetricsAccountStructureSection = () => {
  const [level, setLevel] = useState<PerformanceLevel>('campaign');

  const rows =
    level === 'campaign' ? CAMPAIGN_PERFORMANCE_ROWS : AD_SET_PERFORMANCE_ROWS;
  const totalRows = rows.length;
  const compositionBreakdown: BreakdownDatum[] =
    level === 'campaign'
      ? createAdAccountBreakdown(rows, totalRows)
      : createCampaignBreakdown(rows, totalRows);
  const statusBreakdown = createStatusBreakdown(rows, totalRows);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <h2 className="text-xl font-semibold">Account Breakdown</h2>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <MetricsLevelToggle value={level} onValueChange={setLevel} />
          <PerformanceDetailView
            level={level}
            triggerClassName="w-full justify-between sm:w-auto"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <MetricsChartCard
          title={
            level === 'campaign'
              ? 'Campaigns by Ad Account'
              : 'Ad Sets by Campaign'
          }
          description={
            level === 'campaign'
              ? 'See how campaign volume is distributed across connected ad accounts.'
              : 'See which campaigns are carrying the largest ad set footprint right now.'
          }
          summary={String(totalRows)}
          summaryLabel={
            level === 'campaign'
              ? 'Total campaigns in the current breakdown'
              : 'Total ad sets in the current breakdown'
          }
        >
          <BreakdownPieCard
            data={compositionBreakdown}
            config={createChartConfig(compositionBreakdown)}
          />
        </MetricsChartCard>
        <MetricsChartCard
          title={level === 'campaign' ? 'Campaigns by Status' : 'Ad Sets by Status'}
          description={
            level === 'campaign'
              ? 'Track the current campaign mix across active, paused, ended, and issue states.'
              : 'Track the current ad set mix across active, paused, ended, and issue states.'
          }
          summary={String(totalRows)}
          summaryLabel={
            level === 'campaign'
              ? 'Total campaigns in the current breakdown'
              : 'Total ad sets in the current breakdown'
          }
        >
          <BreakdownPieCard
            data={statusBreakdown}
            config={createChartConfig(statusBreakdown)}
          />
        </MetricsChartCard>
        <PerformanceListCard level={level} tone="top" />
        <PerformanceListCard level={level} tone="bottom" />
      </div>
    </section>
  );
};

interface BreakdownPieCardProps {
  data: BreakdownDatum[];
  config: ChartConfig;
}

const BreakdownPieCard = ({ data, config }: BreakdownPieCardProps) => {
  return (
    <div className="flex flex-col items-center gap-5 pb-3">
      <ChartContainer className="mx-auto aspect-square h-56" config={config}>
        <PieChart accessibilityLayer>
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                nameKey="id"
                formatter={(_value, _name, item) => {
                  const slice = item.payload as BreakdownDatum;

                  return (
                    <div className="flex min-w-36 items-center justify-between gap-4">
                      <div className="text-muted-foreground flex items-center gap-2">
                        <BreakdownLabel slice={slice} />
                      </div>
                      <span className="font-mono font-medium text-foreground tabular-nums">
                        {slice.value} ({formatPercentage(slice.percentage)})
                      </span>
                    </div>
                  );
                }}
              />
            }
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="id"
            innerRadius={58}
            outerRadius={82}
            paddingAngle={3}
            strokeWidth={0}
          >
            {data.map((slice) => (
              <Cell key={slice.id} fill={slice.fill} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>

      <div className="flex w-full max-w-xs flex-col items-center gap-2">
        {data.map((slice) => (
          <div
            key={slice.id}
            className="text-muted-foreground flex w-full items-center justify-between gap-4 text-xs"
          >
            <div className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: slice.fill }}
              />
              <BreakdownLabel slice={slice} />
            </div>
            <p className="tabular-nums">
              {slice.value} ({formatPercentage(slice.percentage)})
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

interface BreakdownLabelProps {
  slice: BreakdownDatum;
}

const BreakdownLabel = ({ slice }: BreakdownLabelProps) => {
  if (slice.platform === 'meta') {
    return (
      <>
        <MetaLogo className="h-3 w-auto" />
        <span className="truncate">{slice.label}</span>
      </>
    );
  }

  if (slice.platform === 'google') {
    return (
      <>
        <GoogleAdsLogo className="h-4 w-auto" />
        <span className="truncate">{slice.label}</span>
      </>
    );
  }

  return <span className="truncate">{slice.label}</span>;
};

interface PerformanceListCardProps {
  level: PerformanceLevel;
  tone: 'top' | 'bottom';
}

const PerformanceListCard = ({ level, tone }: PerformanceListCardProps) => {
  const [selectedMetricId, setSelectedMetricId] = useState<CoreMetricId>('roas');
  const selectedMetricLabel = getMetricLabel(selectedMetricId);
  const rows = getPerformanceRows(level);
  const rankedRows = [...rows].sort((leftRow, rightRow) =>
    comparePerformanceRows(leftRow, rightRow, selectedMetricId)
  );
  const displayRows =
    tone === 'top'
      ? rankedRows.slice(0, DISPLAY_LIMIT)
      : rankedRows.slice(-DISPLAY_LIMIT).reverse();
  const title = tone === 'top' ? 'Top Performers' : 'Bottom Performers';

  return (
    <Card className="gap-4">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-muted-foreground text-sm">{title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground h-7 text-xs"
              >
                {selectedMetricLabel}
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 min-w-48">
              <DropdownMenuLabel>Performance Metric</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={selectedMetricId}
                onValueChange={(value) =>
                  setSelectedMetricId(value as CoreMetricId)
                }
              >
                {MOCK_METRICS.map((metric) => (
                  <DropdownMenuRadioItem key={metric.id} value={metric.id}>
                    {metric.title}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {displayRows.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No performance data is available right now.
          </p>
        ) : (
          <div className="px-2">
            {displayRows.map((row, index) => {
              const PlatformIcon = getCampaignPlatformIcon(row.adAccount.platform);

              return (
                <div key={row.id}>
                  {index > 0 ? <div className="bg-border h-px w-full" /> : null}
                  <div className="flex items-center justify-between gap-6 py-3">
                    <div className="min-w-0 space-y-1">
                      <p className="truncate text-sm font-medium">{row.name}</p>
                      <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <PlatformIcon className="size-3" />
                        <span className="truncate">{row.adAccount.name}</span>
                        {row.campaignName ? (
                          <>
                            <span aria-hidden="true">/</span>
                            <span className="truncate">{row.campaignName}</span>
                          </>
                        ) : null}
                        <span aria-hidden="true">/</span>
                        <span className="capitalize">
                          {formatCampaignStatus(row.status)}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p
                        className={cn(
                          'text-sm font-medium tabular-nums',
                          tone === 'bottom' &&
                            'text-destructive dark:text-red-300'
                        )}
                      >
                        {row.metrics[selectedMetricId]}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface PerformanceDetailViewProps {
  level: PerformanceLevel;
  triggerClassName?: string;
}

const PerformanceDetailView = ({
  level,
  triggerClassName,
}: PerformanceDetailViewProps) => {
  const [searchByLevel, setSearchByLevel] = useState<PerformanceSectionState<string>>({
    campaign: '',
    adSet: '',
  });
  const [selectedAdAccountIdsByLevel, setSelectedAdAccountIdsByLevel] = useState<
    PerformanceSectionState<string[]>
  >({
    campaign: [],
    adSet: [],
  });
  const [selectedStatusesByLevel, setSelectedStatusesByLevel] = useState<
    PerformanceSectionState<CampaignStatus[]>
  >({
    campaign: [],
    adSet: [],
  });
  const [selectedColumnIdsByLevel, setSelectedColumnIdsByLevel] = useState<
    PerformanceSectionState<PerformanceColumnId[]>
  >(DEFAULT_VISIBLE_COLUMN_IDS);

  const rows = getPerformanceRows(level);
  const searchValue = searchByLevel[level];
  const selectedAdAccountIds = selectedAdAccountIdsByLevel[level];
  const selectedStatuses = selectedStatusesByLevel[level];
  const selectedColumnIds = selectedColumnIdsByLevel[level];
  const visibleColumnIds = new Set(selectedColumnIds);
  const dimensionColumns =
    level === 'campaign' ? CAMPAIGN_DIMENSION_COLUMNS : AD_SET_DIMENSION_COLUMNS;
  const visibleMetrics = MOCK_METRICS.filter((metric) =>
    visibleColumnIds.has(metric.id)
  );
  const filteredRows = rows.filter((row) => {
    const normalizedSearchValue = searchValue.trim().toLowerCase();
    const matchesSearch =
      normalizedSearchValue.length === 0 ||
      row.name.toLowerCase().includes(normalizedSearchValue) ||
      row.id.toLowerCase().includes(normalizedSearchValue) ||
      row.adAccount.name.toLowerCase().includes(normalizedSearchValue) ||
      row.campaignName?.toLowerCase().includes(normalizedSearchValue) ||
      formatCampaignStatus(row.status).includes(normalizedSearchValue);

    const matchesAdAccount =
      selectedAdAccountIds.length === 0 ||
      selectedAdAccountIds.includes(row.adAccount.id);

    const matchesStatus =
      selectedStatuses.length === 0 || selectedStatuses.includes(row.status);

    return matchesSearch && matchesAdAccount && matchesStatus;
  });
  const title = level === 'campaign' ? 'Campaign Performance' : 'Ad Set Performance';
  const description =
    level === 'campaign'
      ? 'Search campaigns, refine filters, and customize visible columns in the full performance table.'
      : 'Search ad sets, refine filters, and customize visible columns in the full performance table.';

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className={triggerClassName}>
          Detailed View
          <ArrowUpRightIcon />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-full gap-0 data-[side=right]:w-screen sm:data-[side=right]:w-[min(96vw,1400px)] sm:data-[side=right]:max-w-[1400px]"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <SheetHeader className="border-b pr-14">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="border-b px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <SearchBar
              value={searchValue}
              onChange={(value) =>
                setSearchByLevel((current) => ({
                  ...current,
                  [level]: value,
                }))
              }
              placeholder={`Search ${getLevelLabel(level)}...`}
              containerClassName="w-full xl:w-80"
              autoFocus={false}
            />
            <ButtonGroup>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="outline" tooltip="Filter rows">
                    <FunnelIcon />
                    <span className="sr-only">Open filters</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 min-w-64" align="end">
                  <DropdownMenuLabel>Ad Account</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={selectedAdAccountIds.length === 0}
                    onSelect={(event) => event.preventDefault()}
                    onCheckedChange={() =>
                      setSelectedAdAccountIdsByLevel((current) => ({
                        ...current,
                        [level]: [],
                      }))
                    }
                  >
                    All ad accounts
                  </DropdownMenuCheckboxItem>
                  {Array.from(new Set(rows.map((row) => row.adAccount.id))).map(
                    (adAccountId) => {
                      const row = rows.find((item) => item.adAccount.id === adAccountId);

                      if (!row) {
                        return null;
                      }

                      const PlatformIcon = getCampaignPlatformIcon(
                        row.adAccount.platform
                      );

                      return (
                        <DropdownMenuCheckboxItem
                          key={row.adAccount.id}
                          checked={selectedAdAccountIds.includes(row.adAccount.id)}
                          onSelect={(event) => event.preventDefault()}
                          onCheckedChange={() =>
                            setSelectedAdAccountIdsByLevel((current) => ({
                              ...current,
                              [level]: toggleSelection(
                                current[level],
                                row.adAccount.id
                              ),
                            }))
                          }
                        >
                          <PlatformIcon
                            className={cn(
                              'w-auto',
                              row.adAccount.platform === 'google' ? 'h-4' : 'h-3'
                            )}
                          />
                          {row.adAccount.name}
                        </DropdownMenuCheckboxItem>
                      );
                    }
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Status</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={selectedStatuses.length === 0}
                    onSelect={(event) => event.preventDefault()}
                    onCheckedChange={() =>
                      setSelectedStatusesByLevel((current) => ({
                        ...current,
                        [level]: [],
                      }))
                    }
                  >
                    All statuses
                  </DropdownMenuCheckboxItem>
                  {(['ACTIVE', 'PAUSED', 'WITH_ISSUES', 'ENDED'] as CampaignStatus[]).map(
                    (status) => (
                      <DropdownMenuCheckboxItem
                        key={status}
                        checked={selectedStatuses.includes(status)}
                        onSelect={(event) => event.preventDefault()}
                        onCheckedChange={() =>
                          setSelectedStatusesByLevel((current) => ({
                            ...current,
                            [level]: toggleSelection(current[level], status),
                          }))
                        }
                      >
                        <span className="capitalize">
                          {formatCampaignStatus(status)}
                        </span>
                      </DropdownMenuCheckboxItem>
                    )
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    tooltip="Choose visible columns"
                  >
                    <Columns3CogIcon />
                    <span className="sr-only">Choose visible columns</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 min-w-64" align="end">
                  <DropdownMenuLabel>Dimensions</DropdownMenuLabel>
                  {dimensionColumns.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={visibleColumnIds.has(column.id)}
                      onSelect={(event) => event.preventDefault()}
                      onCheckedChange={() =>
                        setSelectedColumnIdsByLevel((current) => ({
                          ...current,
                          [level]: toggleSelection(current[level], column.id),
                        }))
                      }
                    >
                      {column.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Core KPIs</DropdownMenuLabel>
                  {METRIC_COLUMNS.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={visibleColumnIds.has(column.id)}
                      onSelect={(event) => event.preventDefault()}
                      onCheckedChange={() =>
                        setSelectedColumnIdsByLevel((current) => ({
                          ...current,
                          [level]: toggleSelection(current[level], column.id),
                        }))
                      }
                    >
                      {column.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </ButtonGroup>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-4">
          <PerformanceTable
            level={level}
            rows={filteredRows}
            visibleColumnIds={selectedColumnIds}
            visibleMetrics={visibleMetrics.map((metric) => metric.id)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface PerformanceTableProps {
  level: PerformanceLevel;
  rows: MetricsPerformanceRow[];
  visibleColumnIds: PerformanceColumnId[];
  visibleMetrics: CoreMetricId[];
}

const PerformanceTable = ({
  level,
  rows,
  visibleColumnIds,
  visibleMetrics,
}: PerformanceTableProps) => {
  const visibleColumnIdSet = new Set(visibleColumnIds);
  const isAdAccountVisible = visibleColumnIdSet.has('adAccount');
  const isStatusVisible = visibleColumnIdSet.has('status');

  const columnCount = 1 + Number(isStatusVisible) + visibleMetrics.length;

  return (
    <div className="dark:bg-muted bg-card overflow-auto rounded-xl border">
      <Table>
        <TableHeader className="dark:bg-card bg-muted">
          <TableRow>
            <TableHead className="dark:bg-card bg-muted md:after:bg-border/80 h-14 min-w-80 px-5 text-sm font-semibold md:sticky md:left-0 md:z-20 md:after:absolute md:after:inset-y-0 md:after:right-0 md:after:w-px">
              {level === 'campaign' ? 'Campaign' : 'Ad Set'}
            </TableHead>
            {isStatusVisible ? (
              <TableHead className="h-14 min-w-40 px-5 text-sm font-semibold">
                Status
              </TableHead>
            ) : null}
            {visibleMetrics.map((metricId) => (
              <TableHead
                key={metricId}
                className="h-14 px-7 text-right text-sm font-semibold"
              >
                {getMetricLabel(metricId)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columnCount}
                className="text-muted-foreground px-5 py-10 text-center text-sm"
              >
                No {getLevelLabel(level)} match the current filters.
              </TableCell>
            </TableRow>
          ) : null}
          {rows.map((row) => {
            const PlatformIcon = getCampaignPlatformIcon(row.adAccount.platform);

            return (
              <TableRow key={row.id} className="group">
                <TableCell className="bg-card group-hover:bg-muted dark:bg-muted dark:group-hover:bg-muted md:after:bg-border/80 min-w-80 px-5 py-4 align-top whitespace-normal md:sticky md:left-0 md:z-10 md:after:absolute md:after:inset-y-0 md:after:right-0 md:after:w-px">
                  <div className="space-y-1.5">
                    <p className="text-foreground text-sm font-medium">
                      {row.name}
                    </p>
                    {isAdAccountVisible ? (
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        <PlatformIcon className="size-3.5" />
                        <span>{row.adAccount.name}</span>
                        {row.campaignName ? (
                          <>
                            <span aria-hidden="true">/</span>
                            <span className="truncate">{row.campaignName}</span>
                          </>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </TableCell>
                {isStatusVisible ? (
                  <TableCell className="min-w-40 px-5 py-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        'capitalize',
                        getCampaignStatusClassName(row.status)
                      )}
                    >
                      {formatCampaignStatus(row.status)}
                    </Badge>
                  </TableCell>
                ) : null}
                {visibleMetrics.map((metricId) => (
                  <TableCell
                    key={metricId}
                    className="px-7 py-4 text-right text-sm tabular-nums"
                  >
                    {row.metrics[metricId]}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

function comparePerformanceRows(
  leftRow: MetricsPerformanceRow,
  rightRow: MetricsPerformanceRow,
  selectedMetricId: CoreMetricId
) {
  const metricDifference =
    parseCampaignMetricValue(rightRow.metrics[selectedMetricId]) -
    parseCampaignMetricValue(leftRow.metrics[selectedMetricId]);

  if (metricDifference !== 0) {
    return metricDifference;
  }

  return (
    parseCampaignMetricValue(rightRow.metrics.revenue) -
    parseCampaignMetricValue(leftRow.metrics.revenue)
  );
}

function toggleSelection<T extends string>(items: T[], value: T) {
  return items.includes(value)
    ? items.filter((item) => item !== value)
    : [...items, value];
}

function getLevelLabel(level: PerformanceLevel) {
  return level === 'campaign' ? 'campaigns' : 'ad sets';
}

function createAdAccountBreakdown(
  rows: MetricsPerformanceRow[],
  totalRows: number
) {
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

      const fill =
        row.adAccount.platform === 'google'
          ? GOOGLE_ACCOUNT_COLORS[
              googleColorIndex++ % GOOGLE_ACCOUNT_COLORS.length
            ]
          : META_ACCOUNT_COLORS[metaColorIndex++ % META_ACCOUNT_COLORS.length];

      return [
        {
          id: adAccountId,
          label: row.adAccount.name,
          value,
          fill,
          percentage: totalRows === 0 ? 0 : (value / totalRows) * 100,
          platform: row.adAccount.platform,
        },
      ];
    })
    .sort((left, right) => right.value - left.value);
}

function createCampaignBreakdown(rows: MetricsPerformanceRow[], totalRows: number) {
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
      id: campaignName,
      label: campaignName,
      value,
      fill: CAMPAIGN_COLORS[index % CAMPAIGN_COLORS.length],
      percentage: totalRows === 0 ? 0 : (value / totalRows) * 100,
    }))
    .sort((left, right) => right.value - left.value);
}

function createStatusBreakdown(rows: MetricsPerformanceRow[], totalRows: number) {
  const statusCounts = new Map<CampaignStatus, number>();

  rows.forEach((row) => {
    statusCounts.set(row.status, (statusCounts.get(row.status) ?? 0) + 1);
  });

  return Object.entries(STATUS_COLORS)
    .map(([status, fill]) => {
      const value = statusCounts.get(status as CampaignStatus) ?? 0;

      return {
        id: status,
        label: toTitleCase(formatCampaignStatus(status as CampaignStatus)),
        value,
        fill,
        percentage: totalRows === 0 ? 0 : (value / totalRows) * 100,
      };
    })
    .filter((item) => item.value > 0)
    .sort((left, right) => right.value - left.value);
}

function createChartConfig(data: BreakdownDatum[]) {
  return Object.fromEntries(
    data.map((item) => [
      item.id,
      {
        label: item.label,
        color: item.fill,
      },
    ])
  ) satisfies ChartConfig;
}

function formatPercentage(value: number) {
  return `${value.toFixed(value >= 10 ? 0 : 1)}%`;
}

function toTitleCase(value: string) {
  return value.replace(/\b\w/g, (character) => character.toUpperCase());
}
