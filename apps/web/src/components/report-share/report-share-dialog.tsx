'use client';

import { ReportExportTab } from '@/components/report-share/report-export-tab';
import { ShareExportDialog } from '@/components/share/share-export-dialog';
import { ShareLinkTab } from '@/components/share/share-link-tab';
import { Button, buttonVariants } from '@/components/ui/button';
import type { MockReport } from '@/mock-data/reports';
import { cn } from '@/utils/utils';
import { type VariantProps } from 'class-variance-authority';
import { Share2Icon } from 'lucide-react';
import { type ReactNode, useState } from 'react';

type ReportShareDialogTab = 'share' | 'export';

interface ReportShareDialogProps {
  align?: 'center' | 'end';
  className?: string;
  report: MockReport;
  size?: VariantProps<typeof buttonVariants>['size'];
  trigger?: ReactNode;
  variant?: VariantProps<typeof buttonVariants>['variant'];
}

export const ReportShareDialog = ({
  align = 'end',
  className,
  report,
  size = 'default',
  trigger,
  variant = 'outline',
}: ReportShareDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ReportShareDialogTab>('share');
  const sharePath = report.sharePath ?? `/share/reports/${report.id}`;

  function handleOpenChange(nextOpen: boolean) {
    setIsOpen(nextOpen);

    if (!nextOpen) {
      setActiveTab('share');
    }
  }

  return (
    <ShareExportDialog
      open={isOpen}
      onOpenChange={handleOpenChange}
      value={activeTab}
      onTabChange={setActiveTab}
      title="Share report"
      description="Anyone with the link can view this report, or you can export the full report as a PDF."
      shareContent={
        <ShareLinkTab
          align={align}
          sharePath={sharePath}
          successMessage="Report link copied to clipboard"
          errorMessage="Failed to copy report link"
        />
      }
      exportContent={
        <ReportExportTab
          align={align}
          report={report}
          onExportSuccess={() => setIsOpen(false)}
        />
      }
      trigger={
        trigger ?? (
          <Button
            type="button"
            variant={variant}
            size={size}
            className={cn('shrink-0', className)}
          >
            <Share2Icon />
            <span>Share</span>
          </Button>
        )
      }
    />
  );
};
