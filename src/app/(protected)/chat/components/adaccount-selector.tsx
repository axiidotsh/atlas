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
import { MOCK_AD_ACCOUNTS } from '@/mock-data/ad-data';
import type { AdPlatform } from '@/mock-data/types';
import { ChevronsUpDownIcon } from 'lucide-react';

function getPlatformIcon(platform: AdPlatform) {
  return platform === 'google' ? GoogleAdsLogo : MetaLogo;
}

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
        {MOCK_AD_ACCOUNTS.map((adAccount) => {
          const PlatformIcon = getPlatformIcon(adAccount.platform);

          return (
            <DropdownMenuItem key={adAccount.id}>
              <PlatformIcon />
              {adAccount.name}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
