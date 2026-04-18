'use client';

import {
  campaignPerformanceRowsAtom,
  platformBreakdownVisibleMetricsAtom,
} from '@/app/(protected)/metrics/atoms';
import { Button, buttonVariants } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useBrowserShare } from '@/hooks/use-browser-share';
import { cn } from '@/utils/utils';
import { type VariantProps } from 'class-variance-authority';
import { format } from 'date-fns';
import { useAtomValue } from 'jotai';
import { Share2Icon } from 'lucide-react';
import { useId, useState } from 'react';
import { toast } from 'sonner';
import { Label } from './ui/label';

const METRICS_SHARE_PATH = '/metrics';
type MetricsShareTab = 'share' | 'export';
type AccountBreakdownSectionId = 'campaigns' | 'ad-sets' | 'ads';
type ExportSectionId =
  | 'core-metrics'
  | 'trends'
  | 'platform-breakdown'
  | 'account-breakdown';

interface MetricsShareButtonProps {
  align?: 'center' | 'end';
  className?: string;
  size?: VariantProps<typeof buttonVariants>['size'];
  variant?: VariantProps<typeof buttonVariants>['variant'];
}

interface ShareTabOption {
  label: string;
  value: MetricsShareTab;
}

const SHARE_TAB_OPTIONS: ShareTabOption[] = [
  {
    value: 'share',
    label: 'Share',
  },
  {
    value: 'export',
    label: 'Export',
  },
];

const EXPORT_SECTION_OPTIONS: Array<{
  id: Exclude<ExportSectionId, 'account-breakdown'>;
  label: string;
}> = [
  {
    id: 'core-metrics',
    label: 'Core metrics',
  },
  {
    id: 'trends',
    label: 'Trends',
  },
  {
    id: 'platform-breakdown',
    label: 'Platform breakdown',
  },
];

const ACCOUNT_BREAKDOWN_OPTIONS: Array<{
  id: AccountBreakdownSectionId;
  label: string;
}> = [
  {
    id: 'campaigns',
    label: 'Campaigns',
  },
  {
    id: 'ad-sets',
    label: 'Ad sets',
  },
  {
    id: 'ads',
    label: 'Ads',
  },
];

const ACCOUNT_BREAKDOWN_LEVEL_MAP = {
  'ad-sets': 'adSet',
  ads: 'ad',
  campaigns: 'campaign',
} as const;
const MIN_EXPORT_DURATION_MS = 2000;

function getDefaultPdfFileName() {
  return `Metrics - ${format(new Date(), 'LLL dd, y')}`;
}

function getExportFileName(fileName: string) {
  const normalizedFileName = (
    fileName.trim() || getDefaultPdfFileName()
  ).replace(/\.pdf$/i, '');

  return normalizedFileName.replace(/[<>:"/\\|?*\u0000-\u001F]/g, '-');
}

function wait(durationMs: number) {
  return new Promise((resolve) => window.setTimeout(resolve, durationMs));
}

export const MetricsShareButton = ({
  align = 'end',
  className,
  size = 'default',
  variant = 'outline',
}: MetricsShareButtonProps) => {
  const [activeTab, setActiveTab] = useState<MetricsShareTab>('share');
  const [fileName, setFileName] = useState(() => getDefaultPdfFileName());
  const [isExporting, setIsExporting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isShareGenerated, setIsShareGenerated] = useState(false);
  const [selectedSections, setSelectedSections] = useState<
    Record<Exclude<ExportSectionId, 'account-breakdown'>, boolean>
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
  const fileNameInputId = useId();
  const { copyText } = useBrowserShare();
  const campaignRows = useAtomValue(campaignPerformanceRowsAtom);
  const visiblePlatformMetrics = useAtomValue(
    platformBreakdownVisibleMetricsAtom
  );

  const shareUrl =
    typeof window === 'undefined'
      ? METRICS_SHARE_PATH
      : new URL(METRICS_SHARE_PATH, window.location.origin).toString();

  function handleOpenChange(nextOpen: boolean) {
    setIsOpen(nextOpen);

    if (!nextOpen) {
      setActiveTab('share');
      setIsShareGenerated(false);
    }
  }

  async function handleShareCopy() {
    if (!isShareGenerated) {
      setIsShareGenerated(true);
    }

    await copyText(shareUrl, {
      successMessage: 'Share link copied to clipboard',
      errorMessage: 'Failed to copy share link',
    });
  }

  function handleSectionCheckedChange(
    sectionId: keyof typeof selectedSections,
    checked: boolean
  ) {
    setSelectedSections((currentSections) => ({
      ...currentSections,
      [sectionId]: checked,
    }));
  }

  function handleAccountBreakdownCheckedChange(
    sectionId: AccountBreakdownSectionId,
    checked: boolean
  ) {
    setSelectedAccountBreakdownSections((currentSections) => ({
      ...currentSections,
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
    if (isExporting) {
      return;
    }

    const exportFileName = getExportFileName(fileName);
    const selectedAccountBreakdownLevels = ACCOUNT_BREAKDOWN_OPTIONS.filter(
      (section) => selectedAccountBreakdownSections[section.id]
    ).map((section) => ACCOUNT_BREAKDOWN_LEVEL_MAP[section.id]);

    setIsExporting(true);

    try {
      const minimumExportDuration = wait(MIN_EXPORT_DURATION_MS);
      const blobPromise = Promise.all([
        import('@react-pdf/renderer'),
        import('@/app/(protected)/metrics/components/metrics-pdf-document'),
      ]).then(async ([{ pdf }, { MetricsPdfDocument }]) =>
        pdf(
          <MetricsPdfDocument
            campaignRows={campaignRows}
            fileName={exportFileName}
            platformBreakdownMetricKeys={visiblePlatformMetrics}
            selectedAccountBreakdownSections={selectedAccountBreakdownLevels}
            selectedSections={{
              coreMetrics: selectedSections['core-metrics'],
              platformBreakdown: selectedSections['platform-breakdown'],
              trends: selectedSections.trends,
            }}
          />
        ).toBlob()
      );
      const [blob] = await Promise.all([blobPromise, minimumExportDuration]);
      const blobUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');

      downloadLink.href = blobUrl;
      downloadLink.download = `${exportFileName}.pdf`;
      document.body.append(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 0);
      toast.success('PDF exported');
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to export PDF');
    } finally {
      setIsExporting(false);
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
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={variant}
          size={size}
          className={cn('shrink-0', className)}
        >
          <Share2Icon />
          <span>Share</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Share metrics</DialogTitle>
          <DialogDescription>
            Only the metric values you currently see are shared, and they
            won&apos;t update later.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex border-b">
            {SHARE_TAB_OPTIONS.map((tab) => {
              const isActive = activeTab === tab.value;

              return (
                <Button
                  key={tab.value}
                  type="button"
                  variant="ghost"
                  className={cn(
                    'h-10 rounded-none border-x-0 border-t-0 border-b-[3px] px-0 pr-5 text-sm font-medium shadow-none hover:bg-transparent',
                    isActive
                      ? 'border-primary text-foreground hover:text-foreground'
                      : 'text-muted-foreground hover:text-muted-foreground border-transparent'
                  )}
                  onClick={() => setActiveTab(tab.value)}
                >
                  {tab.label}
                </Button>
              );
            })}
          </div>
          {activeTab === 'share' ? (
            <div className="min-w-0 space-y-3">
              <div className="space-y-3">
                <Input
                  readOnly
                  value={isShareGenerated ? shareUrl : ''}
                  placeholder="Generate a share link to view it here"
                />
                <div
                  className={cn(
                    'flex',
                    align === 'end' ? 'justify-end' : 'justify-center'
                  )}
                >
                  <Button type="button" onClick={handleShareCopy}>
                    {isShareGenerated
                      ? 'Copy share link'
                      : 'Generate share link'}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-1">
                <Label
                  htmlFor={fileNameInputId}
                  className="text-sm font-medium"
                >
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
                          handleSectionCheckedChange(
                            section.id,
                            checked === true
                          )
                        }
                      />
                      <span className="text-sm font-medium">
                        {section.label}
                      </span>
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
                    <span className="text-sm font-medium">
                      Account breakdown
                    </span>
                  </label>
                  <div className="space-y-3 border-l pl-7">
                    {ACCOUNT_BREAKDOWN_OPTIONS.map((section) => (
                      <label
                        key={section.id}
                        className="flex items-center gap-3"
                      >
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
