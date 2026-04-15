'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/utils/utils';
import { CogIcon, EllipsisIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import * as React from 'react';

interface ProjectActionsDropdownProps {
  contentClassName?: string;
  onCloseAutoFocus?: React.ComponentProps<
    typeof DropdownMenuContent
  >['onCloseAutoFocus'];
  onDelete?: () => void;
  onRename?: () => void;
  onSettings?: () => void;
  triggerClassName?: string;
  triggerSize?: React.ComponentProps<typeof Button>['size'];
  triggerVariant?: React.ComponentProps<typeof Button>['variant'];
}

export const ProjectActionsDropdown = ({
  contentClassName,
  onCloseAutoFocus,
  onDelete,
  onRename,
  onSettings,
  triggerClassName,
  triggerSize = 'icon-sm',
  triggerVariant = 'ghost',
}: ProjectActionsDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={triggerVariant}
          size={triggerSize}
          className={triggerClassName}
        >
          <EllipsisIcon />
          <span className="sr-only">Open project actions</span>
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
        <DropdownMenuItem onSelect={onSettings}>
          <CogIcon />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onSelect={onDelete}>
          <Trash2Icon />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
