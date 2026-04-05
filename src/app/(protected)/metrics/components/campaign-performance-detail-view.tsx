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
import { getCampaignPlatformIcon } from '@/app/(protected)/metrics/campaign-performance.utils';
import { CampaignPerformanceTable } from '@/app/(protected)/metrics/components/campaign-performance-table';
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
import { MOCK_AD_ACCOUNTS } from '@/mock-data/ad-data';
import { cn } from '@/utils/utils';
import { useAtom } from 'jotai';
import { ArrowUpRightIcon, Columns3CogIcon, FunnelIcon } from 'lucide-react';

interface CampaignPerformanceDetailViewProps {
  triggerClassName?: string;
}

function toggleSelection<T extends string>(items: T[], value: T) {
  return items.includes(value)
    ? items.filter((item) => item !== value)
    : [...items, value];
}

export const CampaignPerformanceDetailView = ({
  triggerClassName,
}: CampaignPerformanceDetailViewProps) => {
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
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className={triggerClassName}>
          Detailed View
          <ArrowUpRightIcon />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-full gap-0 data-[side=right]:w-screen sm:data-[side=right]:w-[min(96vw,1400px)] sm:data-[side=right]:max-w-[1400px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader className="border-b pr-14">
          <SheetTitle>Campaign Performance</SheetTitle>
          <SheetDescription>
            Search campaigns, refine filters, and customize visible columns in
            the full performance table.
          </SheetDescription>
        </SheetHeader>
        <div className="border-b px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <SearchBar
              value={campaignSearch}
              onChange={setCampaignSearch}
              placeholder="Search campaigns..."
              containerClassName="w-full xl:w-80"
              autoFocus={false}
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
                    const PlatformIcon = getCampaignPlatformIcon(
                      adAccount.platform
                    );

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
        <div className="min-h-0 flex-1 overflow-auto p-4">
          <CampaignPerformanceTable />
        </div>
      </SheetContent>
    </Sheet>
  );
};
