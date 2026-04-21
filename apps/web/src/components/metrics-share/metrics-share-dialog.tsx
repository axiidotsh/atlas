'use client';

import {
  metricsShareDialogOpenAtom,
  metricsShareDialogTabAtom,
  type MetricsShareDialogTab,
} from '@/app/(protected)/metrics/atoms';
import { MetricsExportTab } from '@/components/metrics-share/metrics-export-tab';
import { MetricsShareTab } from '@/components/metrics-share/metrics-share-tab';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/utils/utils';
import { type VariantProps } from 'class-variance-authority';
import { useAtom, useSetAtom } from 'jotai';
import { Share2Icon } from 'lucide-react';

const SHARE_TAB_OPTIONS: Array<{
  label: string;
  value: MetricsShareDialogTab;
}> = [
  { value: 'share', label: 'Share' },
  { value: 'export', label: 'Export' },
];

interface MetricsShareDialogProps {
  align?: 'center' | 'end';
  className?: string;
  size?: VariantProps<typeof buttonVariants>['size'];
  variant?: VariantProps<typeof buttonVariants>['variant'];
}

export const MetricsShareDialog = ({
  align = 'end',
  className,
  size = 'default',
  variant = 'outline',
}: MetricsShareDialogProps) => {
  const [isOpen, setIsOpen] = useAtom(metricsShareDialogOpenAtom);
  const [activeTab, setActiveTab] = useAtom(metricsShareDialogTabAtom);
  const resetTab = useSetAtom(metricsShareDialogTabAtom);

  function handleOpenChange(nextOpen: boolean) {
    setIsOpen(nextOpen);

    if (!nextOpen) {
      resetTab('share');
    }
  }

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
                    'h-10 rounded-none border-x-0 border-t-0 border-b-[3px] bg-transparent! px-0 pr-5 text-sm font-medium shadow-none',
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
            <MetricsShareTab align={align} />
          ) : (
            <MetricsExportTab align={align} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
