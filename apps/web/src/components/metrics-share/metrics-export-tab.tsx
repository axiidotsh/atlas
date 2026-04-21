'use client';

import { metricsShareDialogOpenAtom } from '@/app/(protected)/metrics/atoms';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMetricsPdfExport } from '@/hooks/use-metrics-pdf-export';
import { sanitizePdfFileName } from '@/utils/pdf';
import { cn } from '@/utils/utils';
import { format } from 'date-fns';
import { useSetAtom } from 'jotai';
import { useId, useState } from 'react';

type AccountBreakdownSectionId = 'campaigns' | 'ad-sets' | 'ads';
type ExportSectionId = 'core-metrics' | 'trends' | 'platform-breakdown';

const EXPORT_SECTION_OPTIONS: Array<{
  id: ExportSectionId;
  label: string;
}> = [
  { id: 'core-metrics', label: 'Core metrics' },
  { id: 'trends', label: 'Trends' },
  { id: 'platform-breakdown', label: 'Platform breakdown' },
];

const ACCOUNT_BREAKDOWN_OPTIONS: Array<{
  id: AccountBreakdownSectionId;
  label: string;
}> = [
  { id: 'campaigns', label: 'Campaigns' },
  { id: 'ad-sets', label: 'Ad sets' },
  { id: 'ads', label: 'Ads' },
];

const ACCOUNT_BREAKDOWN_LEVEL_MAP = {
  'ad-sets': 'adSet',
  ads: 'ad',
  campaigns: 'campaign',
} as const;

function getDefaultPdfFileName(): string {
  return `Metrics - ${format(new Date(), 'LLL dd, y')}`;
}

interface MetricsExportTabProps {
  align: 'center' | 'end';
}

export const MetricsExportTab = ({ align }: MetricsExportTabProps) => {
  const fileNameInputId = useId();
  const setIsDialogOpen = useSetAtom(metricsShareDialogOpenAtom);
  const [fileName, setFileName] = useState(getDefaultPdfFileName);
  const [selectedSections, setSelectedSections] = useState<
    Record<ExportSectionId, boolean>
  >({
    'core-metrics': true,
    'platform-breakdown': true,
    trends: true,
  });
  const [
    selectedAccountBreakdownSections,
    setSelectedAccountBreakdownSections,
  ] = useState<Record<AccountBreakdownSectionId, boolean>>({
    'ad-sets': true,
    ads: true,
    campaigns: true,
  });
  const { isExporting, exportPdf } = useMetricsPdfExport();

  function handleSectionCheckedChange(
    sectionId: ExportSectionId,
    checked: boolean
  ) {
    setSelectedSections((current) => ({ ...current, [sectionId]: checked }));
  }

  function handleAccountBreakdownCheckedChange(
    sectionId: AccountBreakdownSectionId,
    checked: boolean
  ) {
    setSelectedAccountBreakdownSections((current) => ({
      ...current,
      [sectionId]: checked,
    }));
  }

  function handleAllAccountBreakdownCheckedChange(checked: boolean) {
    setSelectedAccountBreakdownSections({
      'ad-sets': checked,
      ads: checked,
      campaigns: checked,
    });
  }

  async function handlePdfExport() {
    const selectedAccountBreakdownLevels = ACCOUNT_BREAKDOWN_OPTIONS.filter(
      (section) => selectedAccountBreakdownSections[section.id]
    ).map((section) => ACCOUNT_BREAKDOWN_LEVEL_MAP[section.id]);

    const didExport = await exportPdf({
      fileName: sanitizePdfFileName(fileName, getDefaultPdfFileName()),
      selectedSections: {
        coreMetrics: selectedSections['core-metrics'],
        platformBreakdown: selectedSections['platform-breakdown'],
        trends: selectedSections.trends,
      },
      selectedAccountBreakdownLevels,
    });

    if (didExport) {
      setIsDialogOpen(false);
    }
  }

  const selectedAccountBreakdownCount = ACCOUNT_BREAKDOWN_OPTIONS.filter(
    (section) => selectedAccountBreakdownSections[section.id]
  ).length;
  const hasSelectedExportSection =
    Object.values(selectedSections).some(Boolean) ||
    selectedAccountBreakdownCount > 0;
  const isAccountBreakdownChecked =
    selectedAccountBreakdownCount === ACCOUNT_BREAKDOWN_OPTIONS.length;
  const isAccountBreakdownIndeterminate =
    selectedAccountBreakdownCount > 0 &&
    selectedAccountBreakdownCount < ACCOUNT_BREAKDOWN_OPTIONS.length;

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <Label htmlFor={fileNameInputId} className="text-sm font-medium">
          File name
        </Label>
        <Input
          id={fileNameInputId}
          value={fileName}
          onChange={(event) => setFileName(event.target.value)}
          placeholder={getDefaultPdfFileName()}
        />
      </div>
      <div className="space-y-4">
        <p className="text-sm font-medium">Sections</p>
        <div className="space-y-3">
          {EXPORT_SECTION_OPTIONS.map((section) => (
            <label
              key={section.id}
              className="flex cursor-pointer items-center gap-3"
            >
              <Checkbox
                checked={selectedSections[section.id]}
                onCheckedChange={(checked) =>
                  handleSectionCheckedChange(section.id, checked === true)
                }
              />
              <span className="text-sm font-medium">{section.label}</span>
            </label>
          ))}
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <Checkbox
              checked={
                isAccountBreakdownIndeterminate
                  ? 'indeterminate'
                  : isAccountBreakdownChecked
              }
              onCheckedChange={(checked) =>
                handleAllAccountBreakdownCheckedChange(checked === true)
              }
            />
            <span className="text-sm font-medium">Account breakdown</span>
          </label>
          <div className="space-y-3 border-l pl-7">
            {ACCOUNT_BREAKDOWN_OPTIONS.map((section) => (
              <label key={section.id} className="flex items-center gap-3">
                <Checkbox
                  checked={selectedAccountBreakdownSections[section.id]}
                  onCheckedChange={(checked) =>
                    handleAccountBreakdownCheckedChange(
                      section.id,
                      checked === true
                    )
                  }
                />
                <span className="text-sm">{section.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <div
        className={cn(
          'flex',
          align === 'end' ? 'justify-end' : 'justify-center'
        )}
      >
        <Button
          type="button"
          className="min-w-32"
          disabled={!hasSelectedExportSection || isExporting}
          onClick={handlePdfExport}
        >
          {isExporting ? 'Exporting...' : 'Export as PDF'}
        </Button>
      </div>
    </div>
  );
};
