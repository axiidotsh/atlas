'use client';

import {
  reportsViewAtom,
  type ReportsView,
} from '@/app/(protected)/reports/atoms';
import { ReportCard } from '@/app/(protected)/reports/components/report-card';
import { ReportTable } from '@/app/(protected)/reports/components/report-table';
import { SearchBar } from '@/components/search-bar';
import { Button, buttonVariants } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getReports, type ReportStatus } from '@/mock-data/reports';
import { cn } from '@/utils/utils';
import { useAtom } from 'jotai';
import {
  ArrowUpDownIcon,
  FunnelIcon,
  LayoutGridIcon,
  PlusIcon,
  TableIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type ReportsSortOption =
  | 'created-desc'
  | 'created-asc'
  | 'name-asc'
  | 'name-desc';

const REPORTS_SORT_OPTIONS: Array<{
  value: ReportsSortOption;
  label: string;
}> = [
  { value: 'created-desc', label: 'Newest first' },
  { value: 'created-asc', label: 'Oldest first' },
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
];

const REPORTS_VIEW_OPTIONS: Array<{
  value: ReportsView;
  label: string;
  icon: typeof LayoutGridIcon;
}> = [
  { value: 'grid', label: 'Grid', icon: LayoutGridIcon },
  { value: 'table', label: 'Table', icon: TableIcon },
];

const REPORTS_STATUS_OPTIONS: Array<{
  value: ReportStatus;
  label: string;
}> = [
  { value: 'private', label: 'Private' },
  { value: 'public', label: 'Public' },
];

const RESET_MENU_ITEM_CLASS_NAME =
  'text-muted-foreground justify-center text-xs';

export default function ReportsPage() {
  const [reportQuery, setReportQuery] = useState('');
  const [reports, setReports] = useState(() => getReports());
  const [sortOption, setSortOption] =
    useState<ReportsSortOption>('created-desc');
  const [selectedStatuses, setSelectedStatuses] = useState<ReportStatus[]>([]);
  const [activeView, setActiveView] = useAtom(reportsViewAtom);

  const normalizedQuery = reportQuery.trim().toLowerCase();
  const visibleReports = reports
    .filter((report) => report.title.toLowerCase().includes(normalizedQuery))
    .filter((report) => {
      if (selectedStatuses.length === 0) {
        return true;
      }

      return selectedStatuses.includes(report.status);
    })
    .sort((leftReport, rightReport) => {
      if (sortOption === 'name-asc') {
        return leftReport.title.localeCompare(rightReport.title);
      }

      if (sortOption === 'name-desc') {
        return rightReport.title.localeCompare(leftReport.title);
      }

      if (sortOption === 'created-desc') {
        return (rightReport.createdAt ?? '').localeCompare(
          leftReport.createdAt ?? ''
        );
      }

      if (sortOption === 'created-asc') {
        return (leftReport.createdAt ?? '').localeCompare(
          rightReport.createdAt ?? ''
        );
      }

      return 0;
    });

  function toggleStatusFilter(status: ReportStatus) {
    setSelectedStatuses((currentStatuses) =>
      currentStatuses.includes(status)
        ? currentStatuses.filter((currentStatus) => currentStatus !== status)
        : [...currentStatuses, status]
    );
  }

  function resetSortOption() {
    setSortOption('created-desc');
  }

  function resetFilters() {
    setSelectedStatuses([]);
  }

  function handleRenameReport(reportId: string, nextTitle: string) {
    setReports((currentReports) =>
      currentReports.map((report) =>
        report.id === reportId ? { ...report, title: nextTitle } : report
      )
    );
  }

  function handleDeleteReport(reportId: string) {
    setReports((currentReports) =>
      currentReports.filter((report) => report.id !== reportId)
    );
  }

  const ActiveViewIcon =
    REPORTS_VIEW_OPTIONS.find((option) => option.value === activeView)?.icon ??
    LayoutGridIcon;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 py-6 sm:py-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Your Reports</h1>
        <Link href="/reports/new" className={cn(buttonVariants())}>
          <PlusIcon />
          New Report
        </Link>
      </div>
      <div className="flex gap-2">
        <SearchBar
          value={reportQuery}
          onChange={setReportQuery}
          placeholder="Search your reports..."
          containerClassName="h-9 flex-1 rounded-md"
          inputClassName="h-full"
        />
        <ButtonGroup>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Change view">
                <ActiveViewIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>View</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={activeView}
                onValueChange={(value) => setActiveView(value as ReportsView)}
              >
                {REPORTS_VIEW_OPTIONS.map((option) => (
                  <DropdownMenuRadioItem
                    key={option.value}
                    value={option.value}
                  >
                    <option.icon className="size-4" />
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Sort reports">
                <ArrowUpDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>Sort reports</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={sortOption}
                onValueChange={(value) =>
                  setSortOption(value as ReportsSortOption)
                }
              >
                {REPORTS_SORT_OPTIONS.map((option) => (
                  <DropdownMenuRadioItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={RESET_MENU_ITEM_CLASS_NAME}
                onSelect={resetSortOption}
              >
                Reset
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Filter reports">
                <FunnelIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter reports</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              {REPORTS_STATUS_OPTIONS.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={selectedStatuses.includes(option.value)}
                  onCheckedChange={() => toggleStatusFilter(option.value)}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={RESET_MENU_ITEM_CLASS_NAME}
                onSelect={resetFilters}
              >
                Clear
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </div>
      {activeView === 'grid' ? (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {visibleReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onRename={(nextTitle) => handleRenameReport(report.id, nextTitle)}
              onDelete={() => handleDeleteReport(report.id)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <ReportTable
            reports={visibleReports}
            onRename={handleRenameReport}
            onDelete={handleDeleteReport}
          />
        </div>
      )}
    </div>
  );
}
