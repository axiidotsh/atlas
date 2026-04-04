'use client';

import {
  campaignPerformanceAdAccountFilterAtom,
  campaignPerformanceSearchAtom,
  campaignPerformanceStatusFilterAtom,
  campaignPerformanceVisibleColumnsAtom,
} from '@/app/(protected)/metrics/atoms';
import {
  CAMPAIGN_PERFORMANCE_COLUMNS,
  CAMPAIGN_PERFORMANCE_STATUSES,
  formatCampaignStatus,
} from '@/app/(protected)/metrics/campaign-performance.config';
import { CampaignPerformanceTable } from '@/app/(protected)/metrics/components/campaign-performance-table';
import { MetricCard } from '@/app/(protected)/metrics/components/metric-card';
import { MetricToolbar } from '@/app/(protected)/metrics/components/metric-toolbar';
import { MetricsTrendsGrid } from '@/app/(protected)/metrics/components/metrics-trends-grid';
import { GoogleAdsLogo, MetaLogo } from '@/components/icons';
import { SearchBar } from '@/components/search-bar';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { MOCK_AD_ACCOUNTS } from '@/mock-data/ad-data';
import { MOCK_METRICS } from '@/mock-data/metrics';
import type { AdPlatform } from '@/mock-data/types';
import { cn } from '@/utils/utils';
import { useAtom } from 'jotai';
import { BlocksIcon, Columns3CogIcon, FunnelIcon } from 'lucide-react';

function toggleSelection<T extends string>(items: T[], value: T) {
  return items.includes(value)
    ? items.filter((item) => item !== value)
    : [...items, value];
}

function getPlatformIcon(platform: AdPlatform) {
  return platform === 'google' ? GoogleAdsLogo : MetaLogo;
}

export default function MetricsPage() {
  const [campaignSearch, setCampaignSearch] = useAtom(
    campaignPerformanceSearchAtom
  );
  const [selectedAdAccountIds, setSelectedAdAccountIds] = useAtom(
    campaignPerformanceAdAccountFilterAtom
  );
  const [selectedStatuses, setSelectedStatuses] = useAtom(
    campaignPerformanceStatusFilterAtom
  );
  const [selectedColumnIds, setSelectedColumnIds] = useAtom(
    campaignPerformanceVisibleColumnsAtom
  );
  const dimensionColumns = CAMPAIGN_PERFORMANCE_COLUMNS.filter(
    (column) => column.type === 'dimension'
  );
  const metricColumns = CAMPAIGN_PERFORMANCE_COLUMNS.filter(
    (column) => column.type === 'metric'
  );
  const hasSelectedAdAccounts = selectedAdAccountIds.length > 0;
  const hasSelectedStatuses = selectedStatuses.length > 0;

  return (
    <div className="relative flex flex-col pt-6 pb-12">
      <MetricToolbar />
      <section className="mt-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Core Metrics</h2>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
            tooltip="Add, remove or reorder cards"
          >
            <BlocksIcon />
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_METRICS.map((metric) => (
            <MetricCard
              key={metric.id}
              title={metric.title}
              description={metric.description}
              value={metric.value}
              percentageChange={metric.percentageChange}
              trend={metric.trend}
            />
          ))}
        </div>
      </section>
      <Separator className="my-10" />
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Trends</h2>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
            tooltip="Add, remove or reorder graphs"
          >
            <BlocksIcon />
          </Button>
        </div>
        <MetricsTrendsGrid />
      </section>
      <Separator className="my-10" />
      <section className="flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center sm:gap-2">
          <h2 className="text-xl font-semibold">Campaign Performance</h2>
          <div className="flex items-center gap-2">
            <SearchBar
              value={campaignSearch}
              onChange={setCampaignSearch}
              placeholder="Search campaigns..."
              containerClassName="sm:w-72 w-full sm:ml-auto"
            />
            <ButtonGroup>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    tooltip="Filter campaigns"
                  >
                    <FunnelIcon />
                    <span className="sr-only">Open campaign filters</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 min-w-64" align="end">
                  <DropdownMenuLabel>Ad Account</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={!hasSelectedAdAccounts}
                    onSelect={(event) => event.preventDefault()}
                    onCheckedChange={() => {
                      setSelectedAdAccountIds([]);
                    }}
                  >
                    All ad accounts
                  </DropdownMenuCheckboxItem>
                  {MOCK_AD_ACCOUNTS.map((adAccount) => {
                    const PlatformIcon = getPlatformIcon(adAccount.platform);

                    return (
                      <DropdownMenuCheckboxItem
                        key={adAccount.id}
                        checked={selectedAdAccountIds.includes(adAccount.id)}
                        onSelect={(event) => event.preventDefault()}
                        onCheckedChange={() => {
                          setSelectedAdAccountIds((currentAdAccountIds) =>
                            toggleSelection(currentAdAccountIds, adAccount.id)
                          );
                        }}
                      >
                        <PlatformIcon
                          className={cn(
                            'w-auto',
                            adAccount.platform === 'google' ? 'h-4' : 'h-3'
                          )}
                        />
                        {adAccount.name}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Status</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={!hasSelectedStatuses}
                    onSelect={(event) => event.preventDefault()}
                    onCheckedChange={() => {
                      setSelectedStatuses([]);
                    }}
                  >
                    All statuses
                  </DropdownMenuCheckboxItem>
                  {CAMPAIGN_PERFORMANCE_STATUSES.map((status) => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={selectedStatuses.includes(status)}
                      onSelect={(event) => event.preventDefault()}
                      onCheckedChange={() => {
                        setSelectedStatuses((currentStatuses) =>
                          toggleSelection(currentStatuses, status)
                        );
                      }}
                    >
                      <span className="capitalize">
                        {formatCampaignStatus(status)}
                      </span>
                    </DropdownMenuCheckboxItem>
                  ))}
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
                    <span className="sr-only">
                      Choose campaign performance columns
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 min-w-64" align="end">
                  <DropdownMenuLabel>Dimensions</DropdownMenuLabel>
                  {dimensionColumns.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={selectedColumnIds.includes(column.id)}
                      onSelect={(event) => event.preventDefault()}
                      onCheckedChange={() => {
                        setSelectedColumnIds((currentColumnIds) =>
                          toggleSelection(currentColumnIds, column.id)
                        );
                      }}
                    >
                      {column.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Core KPIs</DropdownMenuLabel>
                  {metricColumns.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={selectedColumnIds.includes(column.id)}
                      onSelect={(event) => event.preventDefault()}
                      onCheckedChange={() => {
                        setSelectedColumnIds((currentColumnIds) =>
                          toggleSelection(currentColumnIds, column.id)
                        );
                      }}
                    >
                      {column.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </ButtonGroup>
          </div>
        </div>
        <CampaignPerformanceTable />
      </section>
    </div>
  );
}
