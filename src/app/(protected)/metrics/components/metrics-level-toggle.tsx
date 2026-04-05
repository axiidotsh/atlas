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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="justify-between sm:w-auto">
          {value === 'campaign' ? 'Campaigns' : 'Ad Sets'}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 min-w-40">
        <DropdownMenuLabel>Performance Level</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(nextValue) => onValueChange(nextValue as PerformanceLevel)}
        >
          <DropdownMenuRadioItem value="campaign">
            Campaigns
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="adSet">Ad Sets</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
