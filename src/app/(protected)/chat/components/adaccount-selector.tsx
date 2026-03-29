'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronsUpDownIcon } from 'lucide-react';

export const AdAccountSelector = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground font-normal"
        >
          Select Ad Accounts
          <ChevronsUpDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Ad Accounts</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Wod Armour</DropdownMenuItem>
        <DropdownMenuItem>Dar Global</DropdownMenuItem>
        <DropdownMenuItem>Hyperice</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
