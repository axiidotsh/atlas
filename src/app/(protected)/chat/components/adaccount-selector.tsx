'use client';

import { GoogleAdsLogo, MetaLogo } from '@/components/icons';
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
          className="text-muted-foreground text-xs font-normal"
        >
          Select Ad Accounts
          <ChevronsUpDownIcon className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Ad Accounts</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <MetaLogo />
          Wod Armour
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MetaLogo />
          Dar Global
        </DropdownMenuItem>
        <DropdownMenuItem>
          <GoogleAdsLogo />
          Hyperice
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
