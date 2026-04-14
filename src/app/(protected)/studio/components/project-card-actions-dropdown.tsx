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
import { useTheme } from 'next-themes';
import * as React from 'react';

interface ProjectCardActionsDropdownProps {
  onCloseAutoFocus: React.ComponentProps<
    typeof DropdownMenuContent
  >['onCloseAutoFocus'];
  onDelete?: () => void;
  onRename?: () => void;
  onSettings?: () => void;
}

export const ProjectCardActionsDropdown = ({
  onCloseAutoFocus,
  onDelete,
  onRename,
  onSettings,
}: ProjectCardActionsDropdownProps) => {
  const { theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={theme === 'dark' ? 'secondary' : 'outline'}
          size="icon-xs"
          className={cn(
            'absolute top-2 right-2 opacity-0 group-hover:opacity-100 data-open:opacity-100 max-lg:opacity-100'
          )}
        >
          <EllipsisIcon />
          <span className="sr-only">Open project actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-full min-w-44"
        align="end"
        onCloseAutoFocus={onCloseAutoFocus}
      >
        <DropdownMenuItem onSelect={onSettings}>
          <CogIcon />
          Project settings
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onRename}>
          <PencilIcon />
          Rename project
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onSelect={onDelete}>
          <Trash2Icon />
          Delete project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
