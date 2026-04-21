'use client';

import {
  studioAspectRatioAtom,
  type StudioAspectRatio,
} from '@/app/(protected)/studio/atoms';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAtom } from 'jotai';
import { ChevronsUpDownIcon } from 'lucide-react';
import { STUDIO_ASPECT_RATIO_OPTIONS } from '../../utils';

export const AspectRatioSelector = () => {
  const [aspectRatios, setAspectRatios] = useAtom(studioAspectRatioAtom);

  function handleToggle(value: StudioAspectRatio) {
    if (value === 'auto') {
      setAspectRatios(['auto']);
      return;
    }

    const withoutAuto = aspectRatios.filter((r) => r !== 'auto');
    const isSelected = withoutAuto.includes(value);

    if (isSelected) {
      const next = withoutAuto.filter((r) => r !== value);
      setAspectRatios(next.length === 0 ? ['auto'] : next);
    } else {
      setAspectRatios([...withoutAuto, value]);
    }
  }

  function getLabel() {
    if (aspectRatios.length === 0 || aspectRatios.includes('auto')) {
      return 'Auto';
    }
    if (aspectRatios.length <= 2) {
      return aspectRatios.join(', ');
    }
    return `${aspectRatios[0]}, ${aspectRatios[1]} +${aspectRatios.length - 2}`;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground gap-1.5 text-xs font-normal"
        >
          Aspect ratio: {getLabel()}
          <ChevronsUpDownIcon className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuLabel>Aspect ratio</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {STUDIO_ASPECT_RATIO_OPTIONS.map((option) => {
          const AspectRatioIcon = option.icon;
          const isChecked =
            option.value === 'auto'
              ? aspectRatios.includes('auto')
              : aspectRatios.includes(option.value);

          return (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={isChecked}
              onCheckedChange={() => handleToggle(option.value)}
              onSelect={(e) => e.preventDefault()}
            >
              <AspectRatioIcon className="size-3.5" />
              {option.label}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
