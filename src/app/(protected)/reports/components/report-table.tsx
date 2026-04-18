'use client';

import { DeleteReportDialog } from '@/app/(protected)/reports/components/delete-report-dialog';
import { ReportActionsDropdown } from '@/app/(protected)/reports/components/report-actions-dropdown';
import { ShareDialog } from '@/components/share-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useBrowserShare } from '@/hooks/use-browser-share';
import type { MockReport } from '@/mock-data/reports';
import { cn } from '@/utils/utils';
import { GlobeIcon, LinkIcon, LockIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface ReportTableProps {
  reports: MockReport[];
  onRename?: (reportId: string, nextTitle: string) => void;
  onDelete?: (reportId: string) => void;
}

function formatDate(dateString?: string) {
  if (!dateString) {
    return '—';
  }

  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

interface ReportTableRowProps {
  report: MockReport;
  onRename?: (nextTitle: string) => void;
  onDelete?: () => void;
}

const ReportTableRow = ({ report, onRename, onDelete }: ReportTableRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const shareTriggerRef = useRef<HTMLButtonElement>(null);
  const shouldKeepInputFocusedRef = useRef(false);
  const { copyText } = useBrowserShare();

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

  async function copyPublicLink() {
    if (!report.sharePath) {
      return;
    }

    const url = new URL(report.sharePath, window.location.origin).toString();

    await copyText(url, {
      successMessage: 'Report link copied to clipboard',
      errorMessage: 'Failed to copy report link',
    });
  }

  return (
    <TableRow>
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
      <TableCell className="p-0">
        {isEditing ? (
          <div className="p-2">
            <input
              ref={inputRef}
              defaultValue={report.title}
              className="w-full min-w-0 bg-transparent text-sm font-medium outline-none"
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
          </div>
        ) : (
          <Link
            href={`/reports/${report.id}`}
            className="group block p-2"
          >
            <span className="truncate text-sm font-medium group-hover:underline">
              {report.title}
            </span>
          </Link>
        )}
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={cn(
            'capitalize',
            report.status === 'public' &&
              'border-green-500/40 text-green-700 dark:text-green-300'
          )}
        >
          {report.status === 'public' ? (
            <GlobeIcon className="size-3" />
          ) : (
            <LockIcon className="size-3" />
          )}
          {report.status}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDate(report.createdAt)}
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-1">
          {report.sharePath ? (
            <Button
              variant="ghost"
              size="icon-sm"
              tooltip="Copy public link"
              onClick={copyPublicLink}
            >
              <LinkIcon />
              <span className="sr-only">Copy public link</span>
            </Button>
          ) : null}
          <ReportActionsDropdown
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
        </div>
      </TableCell>
    </TableRow>
  );
};

export const ReportTable = ({ reports, onRename, onDelete }: ReportTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Report</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="w-24 text-right">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.map((report) => (
          <ReportTableRow
            key={report.id}
            report={report}
            onRename={(nextTitle) => onRename?.(report.id, nextTitle)}
            onDelete={() => onDelete?.(report.id)}
          />
        ))}
      </TableBody>
    </Table>
  );
};
