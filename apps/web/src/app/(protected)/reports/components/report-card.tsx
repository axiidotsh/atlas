'use client';

import { ReportBlockRenderer } from '@/app/(protected)/reports/components/report-blocks';
import { DeleteEntityDialog } from '@/components/entity/delete-entity-dialog';
import {
  EntityActionsDropdown,
  type EntityAction,
} from '@/components/entity/entity-actions-dropdown';
import { ReportShareDialog } from '@/components/report-share/report-share-dialog';
import { Button } from '@/components/ui/button';
import { useInlineTitleEdit } from '@/hooks/use-inline-title-edit';
import type { MockReport, ReportBlock } from '@/mock-data/reports';
import { PencilIcon, Share2Icon, Trash2Icon, XIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRef, useState } from 'react';

interface ReportCardProps {
  report: MockReport;
  onRename?: (nextTitle: string) => void;
  onDelete?: () => void;
}

const TITLE_CLASS_NAME =
  'block w-full truncate bg-transparent p-0 text-sm font-medium leading-5 outline-none';

function getReportPreviewBlocks(blocks: ReportBlock[]): ReportBlock[] {
  const firstBlockType = blocks[0]?.type;
  const isShortBlock = firstBlockType === 'card' || firstBlockType === 'table';
  return blocks.slice(0, isShortBlock ? 2 : 1);
}

export const ReportCard = ({ report, onRename, onDelete }: ReportCardProps) => {
  const { theme } = useTheme();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const shareTriggerRef = useRef<HTMLButtonElement>(null);
  const {
    isEditing,
    inputRef,
    startEditing,
    stopEditing,
    handleDropdownCloseAutoFocus,
  } = useInlineTitleEdit();
  const previewBlocks = getReportPreviewBlocks(report.blocks);

  function commitRename() {
    const nextTitle = inputRef.current?.value.trim();

    if (nextTitle && nextTitle !== report.title) {
      onRename?.(nextTitle);
    }

    stopEditing();
  }

  const actions: EntityAction[] = [
    { id: 'rename', label: 'Rename', icon: PencilIcon, onSelect: startEditing },
    {
      id: 'share',
      label: 'Share',
      icon: Share2Icon,
      onSelect: () => {
        requestAnimationFrame(() => {
          shareTriggerRef.current?.click();
        });
      },
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2Icon,
      variant: 'destructive',
      onSelect: () => setIsDeleteDialogOpen(true),
    },
  ];

  return (
    <div className="group relative">
      <DeleteEntityDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        entityLabel="report"
        entityTitle={report.title}
        onConfirm={() => onDelete?.()}
      />
      <ReportShareDialog
        report={report}
        trigger={
          <button
            ref={shareTriggerRef}
            type="button"
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
          />
        }
      />
      <EntityActionsDropdown
        actions={actions}
        triggerLabel="Open report actions"
        triggerVariant={theme === 'dark' ? 'secondary' : 'outline'}
        triggerSize="icon-xs"
        triggerClassName="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 data-open:opacity-100 max-lg:opacity-100"
        onCloseAutoFocus={handleDropdownCloseAutoFocus}
      />
      <Link
        href={`/reports/${report.id}`}
        onClick={(event) => {
          if (isEditing) {
            event.preventDefault();
          }
        }}
        className="bg-card border-border/50 hover:bg-muted flex cursor-pointer flex-col overflow-hidden rounded-xl border transition-colors duration-300"
      >
        <div className="bg-background border-border/50 dark:bg-muted/95 h-40 overflow-hidden border-b px-3 pt-3">
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
                    stopEditing();
                  }
                }}
              />
              <Button
                variant="destructive"
                size="icon-xs"
                className="absolute top-1/2 right-3 -translate-y-1/2"
                onMouseDown={(event) => event.preventDefault()}
                onClick={stopEditing}
              >
                <XIcon />
              </Button>
            </>
          ) : (
            <span className={TITLE_CLASS_NAME}>{report.title}</span>
          )}
        </div>
      </Link>
    </div>
  );
};
