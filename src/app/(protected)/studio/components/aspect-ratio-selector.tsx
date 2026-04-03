'use client';

import {
  studioAspectRatioAtom,
  type StudioAspectRatio,
} from '@/app/(protected)/studio/atoms';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAtom } from 'jotai';
import { ChevronsUpDownIcon } from 'lucide-react';
import {
  getAspectRatio,
  isStudioAspectRatio,
  STUDIO_ASPECT_RATIO_OPTIONS,
} from '../utils';

export const AspectRatioSelector = () => {
  const [aspectRatio, setAspectRatio] = useAtom(studioAspectRatioAtom);
  const selectedAspectRatio = getAspectRatio(aspectRatio);

  function handleAspectRatioChange(value: string) {
    if (!isStudioAspectRatio(value)) return;
    setAspectRatio(value as StudioAspectRatio);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground gap-1.5 text-xs font-normal"
        >
          <selectedAspectRatio.icon className="size-3.5" />
          Aspect ratio {selectedAspectRatio.label}
          <ChevronsUpDownIcon className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuLabel>Aspect ratio</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={aspectRatio}
          onValueChange={handleAspectRatioChange}
        >
          {STUDIO_ASPECT_RATIO_OPTIONS.map((option) => {
            const AspectRatioIcon = option.icon;

            return (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                <AspectRatioIcon className="size-3.5" />
                {option.label}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
