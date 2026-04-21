'use client';

import { getCampaignPlatformIcon } from '@/app/(protected)/metrics/campaign-performance.utils';
import { PerformanceTable } from '@/app/(protected)/metrics/components/performance/performance-table';
import { getPerformanceRows } from '@/app/(protected)/metrics/metrics-data';
import {
  AD_SET_DIMENSION_COLUMNS,
  CAMPAIGN_DIMENSION_COLUMNS,
  DEFAULT_VISIBLE_COLUMN_IDS,
  METRIC_COLUMNS,
  formatCampaignStatus,
  getLevelLabel,
  getPerformanceDetailDescription,
  getPerformanceDetailTitle,
  toggleSelection,
  type PerformanceColumnId,
  type PerformanceSectionState,
} from '@/app/(protected)/metrics/utils/account-structure';
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { MOCK_METRICS } from '@/mock-data/metrics';
import type { CampaignStatus, PerformanceLevel } from '@/mock-data/types';
import { cn } from '@/utils/utils';
import { ArrowUpRightIcon, Columns3CogIcon, FunnelIcon } from 'lucide-react';
import { useState } from 'react';

const STATUS_FILTER_OPTIONS: CampaignStatus[] = [
  'ACTIVE',
  'PAUSED',
  'WITH_ISSUES',
  'ENDED',
];

interface PerformanceDetailViewProps {
  level: PerformanceLevel;
  triggerClassName?: string;
}

export const PerformanceDetailView = ({
  level,
  triggerClassName,
}: PerformanceDetailViewProps) => {
  const [searchByLevel, setSearchByLevel] = useState<
    PerformanceSectionState<string>
  >({ campaign: '', adSet: '', ad: '' });
  const [selectedAdAccountIdsByLevel, setSelectedAdAccountIdsByLevel] =
    useState<PerformanceSectionState<string[]>>({
      campaign: [],
      adSet: [],
      ad: [],
    });
  const [selectedStatusesByLevel, setSelectedStatusesByLevel] = useState<
    PerformanceSectionState<CampaignStatus[]>
  >({ campaign: [], adSet: [], ad: [] });
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
    level === 'campaign'
      ? CAMPAIGN_DIMENSION_COLUMNS
      : AD_SET_DIMENSION_COLUMNS;
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

  const uniqueAdAccountIds = Array.from(
    new Set(rows.map((row) => row.adAccount.id))
  );

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
                setSearchByLevel((current) => ({ ...current, [level]: value }))
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
                  {uniqueAdAccountIds.map((adAccountId) => {
                    const row = rows.find(
                      (item) => item.adAccount.id === adAccountId
                    );

                    if (!row) {
                      return null;
                    }

                    const PlatformIcon = getCampaignPlatformIcon(
                      row.adAccount.platform
                    );

                    return (
                      <DropdownMenuCheckboxItem
                        key={row.adAccount.id}
                        checked={selectedAdAccountIds.includes(
                          row.adAccount.id
                        )}
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
                  })}
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
                  {STATUS_FILTER_OPTIONS.map((status) => (
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
