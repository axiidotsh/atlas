'use client';

import { formatCampaignStatus } from '@/app/(protected)/metrics/campaign-performance.config';
import { parseCampaignMetricValue } from '@/app/(protected)/metrics/campaign-performance.utils';
import {
  getMetricLabel,
  getPerformanceRows,
  type MetricsPerformanceRow,
} from '@/app/(protected)/metrics/metrics-data';
import { MetricsLevelToggle } from '@/app/(protected)/metrics/components/metrics-level-toggle';
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
import {
  getCampaignPlatformIcon,
  getCampaignStatusClassName,
} from '@/app/(protected)/metrics/campaign-performance.utils';

type PerformanceColumnId = 'adAccount' | 'campaignName' | 'status' | CoreMetricId;

interface PerformanceColumnOption {
  id: PerformanceColumnId;
  label: string;
  type: 'dimension' | 'metric';
}

interface PerformanceSectionState<T> {
  campaign: T;
  adSet: T;
}

const DISPLAY_LIMIT = 3;

const CAMPAIGN_DIMENSION_COLUMNS: PerformanceColumnOption[] = [
  { id: 'adAccount', label: 'Ad Account', type: 'dimension' },
  { id: 'status', label: 'Status', type: 'dimension' },
];

const AD_SET_DIMENSION_COLUMNS: PerformanceColumnOption[] = [
  { id: 'campaignName', label: 'Campaign', type: 'dimension' },
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
  adSet: [
    'campaignName',
    'adAccount',
    'status',
    'impressions',
    'spend',
    'revenue',
    'roas',
  ],
};

export const MetricsPerformanceSection = () => {
  const [level, setLevel] = useState<PerformanceLevel>('campaign');
  const [selectedMetricId, setSelectedMetricId] = useState<CoreMetricId>('roas');
  const selectedMetricLabel = getMetricLabel(selectedMetricId);
  const rows = getPerformanceRows(level);
  const rankedRows = [...rows].sort((leftRow, rightRow) =>
    comparePerformanceRows(leftRow, rightRow, selectedMetricId)
  );
  const topRows = rankedRows.slice(0, DISPLAY_LIMIT);
  const topRowIds = new Set(topRows.map((row) => row.id));
  const bottomRows =
    rankedRows.length <= DISPLAY_LIMIT
      ? [...rankedRows].reverse()
      : [...rankedRows]
          .reverse()
          .filter((row) => !topRowIds.has(row.id))
          .slice(0, DISPLAY_LIMIT);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <h2 className="text-xl font-semibold">Performance</h2>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <MetricsLevelToggle value={level} onValueChange={setLevel} />
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between sm:w-auto"
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
            <PerformanceDetailView
              level={level}
              triggerClassName="w-full justify-between sm:w-auto"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <PerformanceListCard
          title="Top Performers"
          description={`Highest ${selectedMetricLabel} across all ${getLevelLabel(level)}`}
          rows={topRows}
          metricLabel={selectedMetricLabel}
          selectedMetricId={selectedMetricId}
          tone="top"
        />
        <PerformanceListCard
          title="Bottom Performers"
          description={`Lowest ${selectedMetricLabel} across all ${getLevelLabel(level)}`}
          rows={bottomRows}
          metricLabel={selectedMetricLabel}
          selectedMetricId={selectedMetricId}
          tone="bottom"
        />
      </div>
    </section>
  );
};

interface PerformanceListCardProps {
  title: string;
  description: string;
  rows: MetricsPerformanceRow[];
  metricLabel: string;
  selectedMetricId: CoreMetricId;
  tone: 'top' | 'bottom';
}

const PerformanceListCard = ({
  title,
  description,
  rows,
  metricLabel,
  selectedMetricId,
  tone,
}: PerformanceListCardProps) => {
  return (
    <Card className="gap-4">
      <CardHeader>
        <div className="space-y-1">
          <CardTitle className="text-sm">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No performance data is available right now.
          </p>
        ) : (
          <div className="px-2">
            {rows.map((row, index) => {
              const PlatformIcon = getCampaignPlatformIcon(row.adAccount.platform);

              return (
                <div key={row.id}>
                  {index > 0 ? <div className="bg-border h-px w-full" /> : null}
                  <div className="flex items-center justify-between gap-6 py-3">
                    <div className="min-w-0 space-y-1">
                      <p className="truncate text-sm font-medium">{row.name}</p>
                      <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        {row.campaignName ? (
                          <>
                            <span className="truncate">{row.campaignName}</span>
                            <span aria-hidden="true">/</span>
                          </>
                        ) : null}
                        <PlatformIcon className="size-3" />
                        <span className="truncate">{row.adAccount.name}</span>
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
                      <p className="text-muted-foreground text-xs">
                        {metricLabel}
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
  const isCampaignNameVisible = visibleColumnIdSet.has('campaignName');
  const isAdAccountVisible = visibleColumnIdSet.has('adAccount');
  const isStatusVisible = visibleColumnIdSet.has('status');

  const columnCount =
    1 +
    Number(isCampaignNameVisible) +
    Number(isAdAccountVisible) +
    Number(isStatusVisible) +
    visibleMetrics.length;

  return (
    <div className="dark:bg-muted bg-card overflow-auto rounded-xl border">
      <Table>
        <TableHeader className="dark:bg-card bg-muted">
          <TableRow>
            <TableHead className="dark:bg-card bg-muted md:after:bg-border/80 h-14 min-w-80 px-5 text-sm font-semibold md:sticky md:left-0 md:z-20 md:after:absolute md:after:inset-y-0 md:after:right-0 md:after:w-px">
              {level === 'campaign' ? 'Campaign' : 'Ad Set'}
            </TableHead>
            {isCampaignNameVisible ? (
              <TableHead className="h-14 min-w-72 px-5 text-sm font-semibold">
                Campaign
              </TableHead>
            ) : null}
            {isAdAccountVisible ? (
              <TableHead className="h-14 min-w-64 px-5 text-sm font-semibold">
                Ad Account
              </TableHead>
            ) : null}
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
                    <p className="text-muted-foreground text-xs tracking-[0.02em]">
                      {row.id}
                    </p>
                  </div>
                </TableCell>
                {isCampaignNameVisible ? (
                  <TableCell className="min-w-72 px-5 py-4">
                    <p className="text-foreground text-sm font-medium">
                      {row.campaignName ?? '-'}
                    </p>
                  </TableCell>
                ) : null}
                {isAdAccountVisible ? (
                  <TableCell className="min-w-64 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <PlatformIcon className="size-4" />
                      <p className="text-foreground text-sm font-medium">
                        {row.adAccount.name}
                      </p>
                    </div>
                  </TableCell>
                ) : null}
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
