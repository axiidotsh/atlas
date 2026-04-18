'use client';

import { formatCampaignStatus } from '@/app/(protected)/metrics/campaign-performance.config';
import { parseCampaignMetricValue } from '@/app/(protected)/metrics/campaign-performance.utils';
import {
  getCampaignPlatformIcon,
  getCampaignStatusClassName,
} from '@/app/(protected)/metrics/campaign-performance.utils';
import {
  CREATIVE_INSIGHT_ROWS,
  getMetricLabel,
  getPerformanceRows,
  type CreativeInsightRow,
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
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
  ImageIcon,
  PlayIcon,
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
  ad: T;
}

interface BreakdownDatum {
  id: string;
  label: string;
  value: number;
  fill: string;
  percentage: number;
  platform?: AdPlatform;
}

interface DetailRow {
  label: string;
  value: React.ReactNode;
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
  { id: 'status', label: 'Status', type: 'dimension' },
];

const AD_SET_DIMENSION_COLUMNS: PerformanceColumnOption[] = [
  { id: 'status', label: 'Status', type: 'dimension' },
];

const METRIC_COLUMNS: PerformanceColumnOption[] = MOCK_METRICS.map((metric) => ({
  id: metric.id,
  label: metric.title,
  type: 'metric',
}));

const DEFAULT_METRIC_COLUMN_IDS = MOCK_METRICS.map(
  (metric) => metric.id
) satisfies CoreMetricId[];

const DEFAULT_VISIBLE_COLUMN_IDS: PerformanceSectionState<PerformanceColumnId[]> = {
  campaign: ['status', ...DEFAULT_METRIC_COLUMN_IDS],
  adSet: ['status', ...DEFAULT_METRIC_COLUMN_IDS],
  ad: ['status', ...DEFAULT_METRIC_COLUMN_IDS],
};

const creativeInsightRowsById = new Map(
  CREATIVE_INSIGHT_ROWS.map((creative) => [creative.id, creative])
);

export const MetricsAccountStructureSection = () => {
  const [level, setLevel] = useState<PerformanceLevel>('campaign');
  const rows = getPerformanceRows(level);
  const totalRows = rows.length;
  const compositionBreakdown: BreakdownDatum[] =
    level === 'campaign'
      ? createAdAccountBreakdown(rows, totalRows)
      : level === 'adSet'
        ? createCampaignBreakdown(rows, totalRows)
        : createAdSetBreakdown(rows, totalRows);
  const statusBreakdown = createStatusBreakdown(rows, totalRows);
  const summaryLabel = getBreakdownSummaryLabel(level);

  return (
    <section className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-4">
        <h2 className="text-xl font-semibold">Account Breakdown</h2>
        <div className="grid grid-cols-2 gap-2 sm:justify-self-end">
          <MetricsLevelToggle value={level} onValueChange={setLevel} />
          <PerformanceDetailView
            level={level}
            triggerClassName="w-full justify-between sm:w-auto"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <MetricsChartCard
            title={getCompositionChartTitle(level)}
            description={getCompositionChartDescription(level)}
            summary={String(totalRows)}
            summaryLabel={summaryLabel}
          >
            <BreakdownPieCard
              data={compositionBreakdown}
              config={createChartConfig(compositionBreakdown)}
            />
          </MetricsChartCard>
          <MetricsChartCard
            title={getStatusChartTitle(level)}
            description={getStatusChartDescription(level)}
            summary={String(totalRows)}
            summaryLabel={summaryLabel}
          >
            <BreakdownPieCard
              data={statusBreakdown}
              config={createChartConfig(statusBreakdown)}
            />
          </MetricsChartCard>
        </div>
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

interface PerformanceItemDetailSheetProps {
  row: MetricsPerformanceRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PerformanceItemDetailSheet = ({
  row,
  open,
  onOpenChange,
}: PerformanceItemDetailSheetProps) => {
  if (!row) {
    return null;
  }

  const creative = row.level === 'ad' ? creativeInsightRowsById.get(row.id) : null;
  const sheetDescription = getPerformanceItemSheetDescription(row.level);
  const contextRows = getPerformanceContextRows(row, creative);
  const metricRows = getPerformanceMetricRows(row, creative);
  const adCopyRows = creative ? getAdCopyRows(creative) : [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="bg-background w-full gap-0 data-[side=right]:w-screen sm:data-[side=right]:w-[min(96vw,1120px)] sm:data-[side=right]:max-w-[1120px]"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <SheetHeader className="border-b pr-14">
          <SheetTitle>{row.name}</SheetTitle>
          <SheetDescription>{sheetDescription}</SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-auto">
          <div className="space-y-6 p-4 sm:p-6">
            <DetailRowsCard
              title={getPerformanceDetailsCardTitle(row.level)}
              description={`Structure, status, and hierarchy for this ${getPerformanceItemLabel(row.level)}.`}
              rows={contextRows}
            />
            <DetailRowsCard
              title="Metrics"
              description={`Current performance metrics for this ${getPerformanceItemLabel(row.level)}.`}
              rows={metricRows}
            />
            {creative ? (
              <DetailRowsCard
                title="Ad Copy"
                description="Copy and messaging used in this ad."
                rows={adCopyRows}
              />
            ) : null}
            {creative ? (
              <Card className="gap-4 py-5">
                <CardHeader className="px-5">
                  <div className="space-y-1">
                    <CardTitle className="text-sm">Ad Gallery</CardTitle>
                    <CardDescription>
                      Assets used in this ad creative.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="px-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {creative.media.map((media) => (
                      <div key={media.id}>
                        <MediaDetail media={media} title={media.title} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface PerformanceListCardProps {
  level: PerformanceLevel;
  tone: 'top' | 'bottom';
}

const PerformanceListCard = ({ level, tone }: PerformanceListCardProps) => {
  const [selectedMetricId, setSelectedMetricId] = useState<CoreMetricId>('roas');
  const [selectedRow, setSelectedRow] = useState<MetricsPerformanceRow | null>(null);
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
    <>
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
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedRow(row)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setSelectedRow(row);
                        }
                      }}
                      className="-mx-5 flex cursor-pointer items-center justify-between gap-6 rounded-xl px-5 py-3 transition-colors hover:bg-accent/70 dark:hover:bg-accent/40"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          {level === 'ad' ? (
                            <img
                              src={getPerformanceRowThumbnail(row)}
                              alt=""
                              className="size-10 min-w-10 shrink-0 rounded-md object-cover"
                            />
                          ) : null}
                          <div className="min-w-0 space-y-1">
                            <p className="truncate text-sm font-medium">{row.name}</p>
                            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                              <PlatformIcon className="size-3" />
                              <BreadcrumbTooltip label={row.adAccount.name} />
                              {row.campaignName ? (
                                <>
                                  <span aria-hidden="true">/</span>
                                  <BreadcrumbTooltip label={row.campaignName} />
                                </>
                              ) : null}
                              {row.adSetName ? (
                                <>
                                  <span aria-hidden="true">/</span>
                                  <BreadcrumbTooltip label={row.adSetName} />
                                </>
                              ) : null}
                              <span aria-hidden="true">/</span>
                              <span className="shrink-0 whitespace-nowrap capitalize">
                                {formatCampaignStatus(row.status)}
                              </span>
                            </div>
                          </div>
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
      <PerformanceItemDetailSheet
        row={selectedRow}
        open={selectedRow !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedRow(null);
          }
        }}
      />
    </>
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
    ad: '',
  });
  const [selectedAdAccountIdsByLevel, setSelectedAdAccountIdsByLevel] = useState<
    PerformanceSectionState<string[]>
  >({
    campaign: [],
    adSet: [],
    ad: [],
  });
  const [selectedStatusesByLevel, setSelectedStatusesByLevel] = useState<
    PerformanceSectionState<CampaignStatus[]>
  >({
    campaign: [],
    adSet: [],
    ad: [],
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
      row.adSetName?.toLowerCase().includes(normalizedSearchValue) ||
      formatCampaignStatus(row.status).includes(normalizedSearchValue);

    const matchesAdAccount =
      selectedAdAccountIds.length === 0 ||
      selectedAdAccountIds.includes(row.adAccount.id);

    const matchesStatus =
      selectedStatuses.length === 0 || selectedStatuses.includes(row.status);

    return matchesSearch && matchesAdAccount && matchesStatus;
  });
  const title = getPerformanceDetailTitle(level);
  const description = getPerformanceDetailDescription(level);

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
  const [selectedRow, setSelectedRow] = useState<MetricsPerformanceRow | null>(null);
  const visibleColumnIdSet = new Set(visibleColumnIds);
  const isStatusVisible = visibleColumnIdSet.has('status');

  const columnCount = 1 + Number(isStatusVisible) + visibleMetrics.length;

  return (
    <>
      <div className="dark:bg-muted bg-card overflow-auto rounded-xl border">
        <Table>
          <TableHeader className="dark:bg-card bg-muted">
            <TableRow>
              <TableHead className="dark:bg-card bg-muted md:after:bg-border/80 h-14 min-w-80 px-5 text-sm font-semibold md:sticky md:left-0 md:z-20 md:after:absolute md:after:inset-y-0 md:after:right-0 md:after:w-px">
                {level === 'campaign' ? 'Campaign' : level === 'adSet' ? 'Ad Set' : 'Ad'}
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
                <TableRow
                  key={row.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedRow(row)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedRow(row);
                    }
                  }}
                  className="group cursor-pointer"
                >
                  <TableCell className="bg-card dark:bg-muted md:after:bg-border/80 min-w-80 px-5 py-4 align-top whitespace-normal transition-colors group-hover:bg-accent/70 dark:group-hover:bg-accent/40 md:sticky md:left-0 md:z-10 md:after:absolute md:after:inset-y-0 md:after:right-0 md:after:w-px">
                    <div
                      className={cn(
                        'space-y-1.5',
                        level === 'ad' && 'flex items-start gap-3 space-y-0'
                      )}
                    >
                      {level === 'ad' ? (
                        <img
                          src={getPerformanceRowThumbnail(row)}
                          alt=""
                          className="size-10 min-w-10 shrink-0 rounded-md object-cover"
                        />
                      ) : null}
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-foreground min-w-0 text-sm font-medium">
                            {row.name}
                          </p>
                          <ArrowUpRightIcon className="text-muted-foreground size-4 shrink-0" />
                        </div>
                        <div className="text-muted-foreground flex items-center gap-2 text-xs">
                          <PlatformIcon className="size-3.5" />
                          <BreadcrumbTooltip label={row.adAccount.name} />
                          {row.campaignName ? (
                            <>
                              <span aria-hidden="true">/</span>
                              <BreadcrumbTooltip label={row.campaignName} />
                            </>
                          ) : null}
                          {row.adSetName ? (
                            <>
                              <span aria-hidden="true">/</span>
                              <BreadcrumbTooltip label={row.adSetName} />
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  {isStatusVisible ? (
                    <TableCell className="min-w-40 px-5 py-4 transition-colors group-hover:bg-accent/70 dark:group-hover:bg-accent/40">
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
                      className="px-7 py-4 text-right text-sm tabular-nums transition-colors group-hover:bg-accent/70 dark:group-hover:bg-accent/40"
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
      <PerformanceItemDetailSheet
        row={selectedRow}
        open={selectedRow !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedRow(null);
          }
        }}
      />
    </>
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
  if (level === 'campaign') {
    return 'campaigns';
  }

  if (level === 'adSet') {
    return 'ad sets';
  }

  return 'ads';
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

function createAdSetBreakdown(rows: MetricsPerformanceRow[], totalRows: number) {
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
      id: adSetName,
      label: adSetName,
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

function getCompositionChartDescription(level: PerformanceLevel) {
  if (level === 'campaign') {
    return 'See how campaign volume is distributed across connected ad accounts.';
  }

  if (level === 'adSet') {
    return 'See which campaigns are carrying the largest ad set footprint right now.';
  }

  return 'See which ad sets are carrying the highest ad volume in the current mix.';
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

function getStatusChartDescription(level: PerformanceLevel) {
  if (level === 'campaign') {
    return 'Track the current campaign mix across active, paused, ended, and issue states.';
  }

  if (level === 'adSet') {
    return 'Track the current ad set mix across active, paused, ended, and issue states.';
  }

  return 'Track the current ad mix across active, paused, ended, and issue states.';
}

function getPerformanceDetailTitle(level: PerformanceLevel) {
  if (level === 'campaign') {
    return 'Campaign Performance';
  }

  if (level === 'adSet') {
    return 'Ad Set Performance';
  }

  return 'Ad Performance';
}

function getPerformanceDetailDescription(level: PerformanceLevel) {
  if (level === 'campaign') {
    return 'Search campaigns, refine filters, and customize visible columns in the full performance table.';
  }

  if (level === 'adSet') {
    return 'Search ad sets, refine filters, and customize visible columns in the full performance table.';
  }

  return 'Search ads, refine filters, and customize visible columns in the full performance table.';
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

interface AdAccountPlatformIconProps {
  platform: AdPlatform;
}

const AdAccountPlatformIcon = ({ platform }: AdAccountPlatformIconProps) => {
  return platform === 'google' ? (
    <GoogleAdsLogo className="h-4 w-auto" />
  ) : (
    <MetaLogo className="h-3 w-auto" />
  );
};

function getPerformanceItemLabel(level: PerformanceLevel) {
  if (level === 'campaign') {
    return 'campaign';
  }

  if (level === 'adSet') {
    return 'ad set';
  }

  return 'ad';
}

function getPerformanceItemSheetDescription(level: PerformanceLevel) {
  if (level === 'campaign') {
    return 'Review the full performance snapshot and account context for this campaign.';
  }

  if (level === 'adSet') {
    return 'Review the full performance snapshot and campaign context for this ad set.';
  }

  return 'Review the full performance snapshot, hierarchy, and creative assets for this ad.';
}

function getPerformanceDetailsCardTitle(level: PerformanceLevel) {
  if (level === 'campaign') {
    return 'Campaign Details';
  }

  if (level === 'adSet') {
    return 'Ad Set Details';
  }

  return 'Ad Details';
}

function getPerformanceContextRows(
  row: MetricsPerformanceRow,
  creative: CreativeInsightRow | null | undefined
) {
  const rows: DetailRow[] = [
    {
      label: 'Status',
      value: (
        <Badge
          variant="outline"
          className={cn('capitalize', getCampaignStatusClassName(row.status))}
        >
          {formatCampaignStatus(row.status)}
        </Badge>
      ),
    },
    {
      label: 'ID',
      value: row.id,
    },
    {
      label: toTitleCase(getPerformanceItemLabel(row.level)),
      value: row.name,
    },
    {
      label: 'Ad Account',
      value: (
        <div className="flex items-center gap-2">
          <AdAccountPlatformIcon platform={row.adAccount.platform} />
          <span>{row.adAccount.name}</span>
        </div>
      ),
    },
  ];

  if (row.campaignName) {
    rows.push({
      label: 'Campaign',
      value: row.campaignName,
    });
  }

  if (row.adSetName) {
    rows.push({
      label: 'Ad Set',
      value: row.adSetName,
    });
  }

  if (creative) {
    rows.push({
      label: 'Destination',
      value: creative.destination,
    });
  }

  return rows;
}

function getPerformanceMetricRows(
  row: MetricsPerformanceRow,
  creative: CreativeInsightRow | null | undefined
) {
  const coreRows: DetailRow[] = MOCK_METRICS.map((metric) => ({
    label: metric.title,
    value: row.metrics[metric.id],
  }));

  const detailRows: DetailRow[] =
    creative?.detailMetrics.map((metric) => ({
      label: metric.label,
      value: metric.value,
    })) ?? [];

  return [...coreRows, ...detailRows];
}

function getAdCopyRows(creative: CreativeInsightRow) {
  return [
    {
      label: 'Headline',
      value: creative.headline,
    },
    {
      label: 'Primary Text',
      value: creative.primaryText,
    },
  ] satisfies DetailRow[];
}

interface BreadcrumbTooltipProps {
  label: string;
}

const BreadcrumbTooltip = ({ label }: BreadcrumbTooltipProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="truncate">{label}</span>
      </TooltipTrigger>
      <TooltipContent sideOffset={6}>{label}</TooltipContent>
    </Tooltip>
  );
};

interface DetailRowsCardProps {
  title: string;
  description: string;
  rows: DetailRow[];
}

const DetailRowsCard = ({
  title,
  description,
  rows,
}: DetailRowsCardProps) => {
  const gridTemplate = 'minmax(160px,0.45fr) minmax(0,1fr)';

  return (
    <Card className="gap-4 py-5">
      <CardHeader className="px-5">
        <div className="space-y-1">
          <CardTitle className="text-sm">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-5">
        <div className="px-2">
          {rows.map((row, index) => (
            <div key={`${row.label}-${index}`}>
              {index > 0 ? <Separator /> : null}
              <div
                className="grid items-start gap-4 py-3"
                style={{ gridTemplateColumns: gridTemplate }}
              >
                <p className="text-muted-foreground text-sm">{row.label}</p>
                <div className="text-sm leading-6 break-words">{row.value}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface MediaDetailProps {
  media: CreativeInsightRow['media'][number];
  title: string;
}

const MediaDetail = ({ media, title }: MediaDetailProps) => {
  return (
    <div className="group relative h-56 overflow-hidden rounded-xl">
      <div className="absolute inset-0 z-10 bg-linear-to-b from-black/5 via-transparent to-black/70" />
      <div className="absolute inset-x-0 bottom-0 z-20 p-4 text-white">
        <div className="flex items-center gap-2">
          {media.type === 'video' ? (
            <PlayIcon className="size-4 fill-current" />
          ) : (
            <ImageIcon className="size-4" />
          )}
          <p className="truncate text-sm font-medium">{title}</p>
        </div>
      </div>
      <div className="bg-muted size-full">
        {media.type === 'video' ? (
          <video
            src={media.src}
            poster={media.posterSrc}
            className="size-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          <img
            src={media.src}
            alt={title}
            className="size-full object-cover"
          />
        )}
      </div>
    </div>
  );
};
