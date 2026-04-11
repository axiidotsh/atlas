'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';
import { CheckIcon } from 'lucide-react';

interface ChipSelectProps {
  options: readonly string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiple?: boolean;
}

export const ChipSelect = ({
  options,
  selected,
  onChange,
  multiple = true,
}: ChipSelectProps) => {
  function handleToggle(option: string) {
    if (multiple) {
      const next = selected.includes(option)
        ? selected.filter((s) => s !== option)
        : [...selected, option];
      onChange(next);
    } else {
      onChange(selected.includes(option) ? [] : [option]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selected.includes(option);

        return (
          <Button
            key={option}
            type="button"
            onClick={() => handleToggle(option)}
            variant={isSelected ? 'default' : 'outline'}
            size="xs"
            className={cn('rounded-full', isSelected && 'bg-primary/80')}
          >
            {isSelected && <CheckIcon className="size-3" />}
            {option}
          </Button>
        );
      })}
    </div>
  );
};
