'use client';

import { PlatformIcon } from '@/components/platform-icon';
import { SearchBar } from '@/components/search-bar';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MOCK_AD_ACCOUNTS } from '@/mock-data/ad-data';
import type { MockAdAccount } from '@/mock-data/types';
import { cn } from '@/utils/utils';
import { VariantProps } from 'class-variance-authority';
import { ChevronsUpDownIcon } from 'lucide-react';
import { useState } from 'react';

type ButtonVariants = VariantProps<typeof buttonVariants>;
type ButtonVariant = NonNullable<ButtonVariants['variant']>;
type ButtonSize = NonNullable<ButtonVariants['size']>;

interface AdAccountSelectorProps {
  selectedAdAccountIds: MockAdAccount['id'][];
  onSelectedAdAccountIdsChange: (adAccountIds: MockAdAccount['id'][]) => void;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const AdAccountSelector = ({
  selectedAdAccountIds,
  onSelectedAdAccountIdsChange,
  className,
  variant = 'default',
  size = 'sm',
}: AdAccountSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const allAdAccountIds = MOCK_AD_ACCOUNTS.map((adAccount) => adAccount.id);
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredAdAccounts = MOCK_AD_ACCOUNTS.filter((adAccount) => {
    if (!normalizedSearchQuery) {
      return true;
    }

    return (
      adAccount.name.toLowerCase().includes(normalizedSearchQuery) ||
      adAccount.id.toLowerCase().includes(normalizedSearchQuery)
    );
  });
  const selectedAdAccounts = MOCK_AD_ACCOUNTS.filter((adAccount) =>
    selectedAdAccountIds.includes(adAccount.id)
  );
  const selectedAdAccount =
    selectedAdAccounts.length === 1 ? selectedAdAccounts[0] : null;
  const selectedPlatforms = Array.from(
    new Set(selectedAdAccounts.map((adAccount) => adAccount.platform))
  );
  const hasSelectedAdAccounts = selectedAdAccounts.length > 0;
  const hasAllAdAccountsSelected =
    selectedAdAccountIds.length === allAdAccountIds.length;

  function toggleSelection(value: string) {
    return selectedAdAccountIds.includes(value)
      ? selectedAdAccountIds.filter((item) => item !== value)
      : [...selectedAdAccountIds, value];
  }

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={(nextOpen) => {
        setIsOpen(nextOpen);

        if (!nextOpen) {
          setSearchQuery('');
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn(
            'min-w-0 justify-between gap-2 font-normal',
            hasSelectedAdAccounts ? 'text-foreground' : 'text-muted-foreground',
            size === 'sm' && 'text-xs',
            className
          )}
        >
          {selectedAdAccount ? (
            <span className="flex min-w-0 items-center gap-2">
              <PlatformIcon platform={selectedAdAccount.platform} />
              <span className="truncate">{selectedAdAccount.name}</span>
            </span>
          ) : selectedAdAccounts.length > 1 ? (
            <span className="flex min-w-0 items-center gap-2">
              <span className="flex items-center gap-1.5">
                {selectedPlatforms.map((platform) => {
                  return (
                    <span key={platform}>
                      <PlatformIcon platform={platform} />
                    </span>
                  );
                })}
              </span>
              <span className="truncate">
                {selectedAdAccounts.length} ad accounts
              </span>
            </span>
          ) : (
            <>
              <span className="sm:hidden">Ad Accounts</span>
              <span className="hidden sm:inline">Select Ad Accounts</span>
            </>
          )}
          <ChevronsUpDownIcon className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56">
        <div className="p-0.5">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search ad accounts..."
            size="sm"
            containerClassName="bg-transparent border-0 ring-0! pl-1.5"
            shouldStopKeyDownPropagation
          />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={hasAllAdAccountsSelected}
          onSelect={(event) => event.preventDefault()}
          onCheckedChange={() => onSelectedAdAccountIdsChange(allAdAccountIds)}
        >
          All ad accounts
        </DropdownMenuCheckboxItem>
        {filteredAdAccounts.length === 0 ? (
          <div className="text-muted-foreground px-2 py-3 text-sm">
            No ad accounts found
          </div>
        ) : (
          filteredAdAccounts.map((adAccount) => (
            <DropdownMenuCheckboxItem
              key={adAccount.id}
              checked={selectedAdAccountIds.includes(adAccount.id)}
              onSelect={(event) => event.preventDefault()}
              onCheckedChange={() =>
                onSelectedAdAccountIdsChange(toggleSelection(adAccount.id))
              }
            >
              <PlatformIcon platform={adAccount.platform} />
              {adAccount.name}
            </DropdownMenuCheckboxItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-muted-foreground justify-center text-xs"
          disabled={!hasSelectedAdAccounts}
          onSelect={() => onSelectedAdAccountIdsChange([])}
        >
          Clear selected ad accounts
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
