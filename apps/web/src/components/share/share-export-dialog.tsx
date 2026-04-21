'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/utils/utils';
import type { ReactNode } from 'react';

type ShareExportDialogTab = 'share' | 'export';

const SHARE_EXPORT_TABS: Array<{
  label: string;
  value: ShareExportDialogTab;
}> = [
  { value: 'share', label: 'Share' },
  { value: 'export', label: 'Export' },
];

interface ShareExportDialogProps {
  description: string;
  exportContent: ReactNode;
  onOpenChange: (open: boolean) => void;
  onTabChange: (tab: ShareExportDialogTab) => void;
  open: boolean;
  shareContent: ReactNode;
  title: string;
  trigger: ReactNode;
  value: ShareExportDialogTab;
}

export const ShareExportDialog = ({
  description,
  exportContent,
  onOpenChange,
  onTabChange,
  open,
  shareContent,
  title,
  trigger,
  value,
}: ShareExportDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex border-b">
            {SHARE_EXPORT_TABS.map((tab) => {
              const isActive = value === tab.value;

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
                  onClick={() => onTabChange(tab.value)}
                >
                  {tab.label}
                </Button>
              );
            })}
          </div>
          {value === 'share' ? shareContent : exportContent}
        </div>
      </DialogContent>
    </Dialog>
  );
};
