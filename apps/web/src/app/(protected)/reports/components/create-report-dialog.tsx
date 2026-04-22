'use client';

import { RichTextEditor } from '@/components/chat/editor/rich-text-editor';
import { DateRangePicker } from '@/components/date-range-picker';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Kbd } from '@/components/ui/kbd';
import { Label } from '@/components/ui/label';
import { MENTION_OPTIONS } from '@/mock-data/mention-data';
import { type ReactNode, useRef, useState } from 'react';
import { type DateRange } from 'react-day-picker';

export interface CreateReportInput {
  title: string;
  instructions: string;
  dateRange?: DateRange;
}

interface CreateReportDialogProps {
  children: ReactNode;
  onCreate?: (input: CreateReportInput) => void;
}

export const CreateReportDialog = ({
  children,
  onCreate,
}: CreateReportDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const mentionMenuContainerRef = useRef<HTMLDivElement>(null);

  function resetForm() {
    setTitle('');
    setInstructions('');
    setDateRange(undefined);
  }

  function handleOpenChange(nextOpen: boolean) {
    setIsOpen(nextOpen);
    if (!nextOpen) {
      resetForm();
    }
  }

  function handleCreate() {
    const trimmedInstructions = instructions.trim();
    if (!trimmedInstructions) {
      return;
    }

    onCreate?.({
      title: title.trim(),
      instructions: trimmedInstructions,
      dateRange,
    });
    setIsOpen(false);
    resetForm();
  }

  const isSubmitDisabled = instructions.trim().length === 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create a new report</DialogTitle>
          <DialogDescription>
            Describe what you want analyzed. We&apos;ll generate your report in
            the background.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-7 py-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="report-title">
              Title
              <span className="text-muted-foreground text-xs font-normal">
                (optional)
              </span>
            </Label>
            <Input
              id="report-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Q2 performance summary"
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="report-instructions">Instructions</Label>
            <div ref={mentionMenuContainerRef} className="relative">
              <div
                id="report-instructions"
                className="border-input rounded-md border bg-transparent shadow-xs"
              >
                <RichTextEditor
                  value={instructions}
                  onValueChange={setInstructions}
                  placeholder="Summarize Q1 for @Wod Armour and highlight the top creatives..."
                  mentionOptions={MENTION_OPTIONS}
                  mentionMenuContainerRef={mentionMenuContainerRef}
                  className="min-h-32 overflow-y-auto px-3 py-2 text-sm outline-none"
                />
              </div>
            </div>
            <span className="text-muted-foreground inline-flex flex-wrap items-center gap-1 text-xs">
              Tag ad accounts, campaigns, ad sets, or ads with{' '}
              <Kbd className="bg-accent/50">@</Kbd>
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="report-date-range">
              Date range
              <span className="text-muted-foreground text-xs font-normal">
                (optional)
              </span>
            </Label>
            <DateRangePicker
              id="report-date-range"
              date={dateRange}
              onDateChange={setDateRange}
              align="center"
              className="w-full"
            />
            <span className="text-muted-foreground text-xs">
              Set this if you want to analyze a specific period
            </span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isSubmitDisabled}>
            Create report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
