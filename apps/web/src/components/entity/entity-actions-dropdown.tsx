'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/utils/utils';
import { EllipsisIcon, type LucideIcon } from 'lucide-react';
import * as React from 'react';

export interface EntityAction {
  id: string;
  label: string;
  icon: LucideIcon;
  onSelect?: () => void;
  variant?: 'default' | 'destructive';
}

interface EntityActionsDropdownProps {
  actions: EntityAction[];
  triggerLabel: string;
  triggerClassName?: string;
  triggerSize?: React.ComponentProps<typeof Button>['size'];
  triggerVariant?: React.ComponentProps<typeof Button>['variant'];
  contentClassName?: string;
  onCloseAutoFocus?: React.ComponentProps<
    typeof DropdownMenuContent
  >['onCloseAutoFocus'];
}

export const EntityActionsDropdown = ({
  actions,
  triggerLabel,
  triggerClassName,
  triggerSize = 'icon-sm',
  triggerVariant = 'ghost',
  contentClassName,
  onCloseAutoFocus,
}: EntityActionsDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={triggerVariant}
          size={triggerSize}
          className={triggerClassName}
        >
          <EllipsisIcon />
          <span className="sr-only">{triggerLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn(contentClassName)}
        align="end"
        onCloseAutoFocus={onCloseAutoFocus}
      >
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <DropdownMenuItem
              key={action.id}
              variant={action.variant}
              onSelect={action.onSelect}
            >
              <Icon />
              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
