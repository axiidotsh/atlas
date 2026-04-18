'use client';

import { DeleteReportDialog } from '@/app/(protected)/reports/components/delete-report-dialog';
import { ReportActionsDropdown } from '@/app/(protected)/reports/components/report-actions-dropdown';
import { ReportBlockRenderer } from '@/app/(protected)/reports/components/report-blocks';
import { ShareDialog } from '@/components/share-dialog';
import { Button } from '@/components/ui/button';
import type { MockReport } from '@/mock-data/reports';
import { XIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

interface ReportCardProps {
  report: MockReport;
  onRename?: (nextTitle: string) => void;
  onDelete?: () => void;
}

const TITLE_CLASS_NAME =
  'block w-full truncate bg-transparent p-0 text-sm font-medium leading-5 outline-none';

export const ReportCard = ({
  report,
  onRename,
  onDelete,
}: ReportCardProps) => {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const shareTriggerRef = useRef<HTMLButtonElement>(null);
  const shouldKeepInputFocusedRef = useRef(false);
  const firstBlockType = report.blocks[0]?.type;
  const previewBlocks =
    firstBlockType === 'card' || firstBlockType === 'table'
      ? report.blocks.slice(0, 2)
      : report.blocks.slice(0, 1);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const frameId = requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });

    return () => cancelAnimationFrame(frameId);
  }, [isEditing]);

  function commitRename() {
    const nextTitle = inputRef.current?.value.trim();

    if (nextTitle && nextTitle !== report.title) {
      onRename?.(nextTitle);
    }

    setIsEditing(false);
  }

  return (
    <div className="group relative">
      <DeleteReportDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        reportTitle={report.title}
        onConfirm={() => onDelete?.()}
      />
      <ShareDialog
        title="Share report"
        description="Anyone with the link can view this report."
        copySuccessMessage="Report link copied to clipboard"
        copyErrorMessage="Failed to copy report link"
        sharePath={report.sharePath ?? `/share/reports/${report.id}`}
      >
        <button
          ref={shareTriggerRef}
          type="button"
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
        />
      </ShareDialog>
      <ReportActionsDropdown
        triggerVariant={theme === 'dark' ? 'secondary' : 'outline'}
        triggerSize="icon-xs"
        triggerClassName="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 data-open:opacity-100 max-lg:opacity-100"
        onCloseAutoFocus={(event) => {
          if (!shouldKeepInputFocusedRef.current) {
            return;
          }

          event.preventDefault();
          shouldKeepInputFocusedRef.current = false;

          requestAnimationFrame(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
          });
        }}
        onRename={() => {
          shouldKeepInputFocusedRef.current = true;
          setIsEditing(true);
        }}
        onShare={() => {
          requestAnimationFrame(() => {
            shareTriggerRef.current?.click();
          });
        }}
        onDelete={() => setIsDeleteDialogOpen(true)}
      />
      <div className="bg-card border-border/50 hover:bg-muted flex cursor-pointer flex-col overflow-hidden rounded-xl border transition-colors duration-300">
        <div className="bg-background border-border/50 h-40 overflow-hidden border-b px-3 pt-3">
          {previewBlocks.length > 0 ? (
            <div
              className="origin-top-left space-y-3"
              style={{
                transform: 'scale(0.55)',
                width: 'calc(100% / 0.55)',
              }}
            >
              {previewBlocks.map((block) => (
                <ReportBlockRenderer key={block.id} block={block} />
              ))}
            </div>
          ) : null}
        </div>
        <div className="relative px-4 py-3 pr-12">
          {isEditing ? (
            <>
              <input
                ref={inputRef}
                defaultValue={report.title}
                className={TITLE_CLASS_NAME}
                onBlur={commitRename}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    commitRename();
                  } else if (event.key === 'Escape') {
                    event.preventDefault();
                    setIsEditing(false);
                  }
                }}
              />
              <Button
                variant="destructive"
                size="icon-xs"
                className="absolute top-1/2 right-3 -translate-y-1/2"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => setIsEditing(false)}
              >
                <XIcon />
              </Button>
            </>
          ) : (
            <span className={TITLE_CLASS_NAME}>{report.title}</span>
          )}
        </div>
      </div>
    </div>
  );
};
