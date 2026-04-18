'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/utils/utils';
import {
  EllipsisIcon,
  PencilIcon,
  Share2Icon,
  Trash2Icon,
} from 'lucide-react';
import * as React from 'react';

interface ReportActionsDropdownProps {
  contentClassName?: string;
  onCloseAutoFocus?: React.ComponentProps<
    typeof DropdownMenuContent
  >['onCloseAutoFocus'];
  onDelete?: () => void;
  onRename?: () => void;
  onShare?: () => void;
  triggerClassName?: string;
  triggerSize?: React.ComponentProps<typeof Button>['size'];
  triggerVariant?: React.ComponentProps<typeof Button>['variant'];
}

export const ReportActionsDropdown = ({
  contentClassName,
  onCloseAutoFocus,
  onDelete,
  onRename,
  onShare,
  triggerClassName,
  triggerSize = 'icon-sm',
  triggerVariant = 'ghost',
}: ReportActionsDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={triggerVariant}
          size={triggerSize}
          className={triggerClassName}
        >
          <EllipsisIcon />
          <span className="sr-only">Open report actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn(contentClassName)}
        align="end"
        onCloseAutoFocus={onCloseAutoFocus}
      >
        <DropdownMenuItem onSelect={onRename}>
          <PencilIcon />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onShare}>
          <Share2Icon />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onSelect={onDelete}>
          <Trash2Icon />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
