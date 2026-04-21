'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { PerformanceLevel } from '@/mock-data/types';
import { ChevronDownIcon } from 'lucide-react';

interface MetricsLevelToggleProps {
  value: PerformanceLevel;
  onValueChange: (value: PerformanceLevel) => void;
}

export const MetricsLevelToggle = ({
  value,
  onValueChange,
}: MetricsLevelToggleProps) => {
  const label =
    value === 'campaign' ? 'Campaigns' : value === 'adSet' ? 'Ad Sets' : 'Ads';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-between sm:min-w-36"
        >
          {label}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 min-w-40">
        <DropdownMenuLabel>Performance Level</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(nextValue) =>
            onValueChange(nextValue as PerformanceLevel)
          }
        >
          <DropdownMenuRadioItem value="campaign">
            Campaigns
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="adSet">Ad Sets</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="ad">Ads</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
