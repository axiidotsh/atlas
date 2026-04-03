'use client';

import {
  STUDIO_ASPECT_RATIOS,
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
import {
  ChevronsUpDownIcon,
  RectangleVerticalIcon,
  SmartphoneIcon,
  SquareIcon,
  type LucideIcon,
} from 'lucide-react';

interface StudioAspectRatioOption {
  value: StudioAspectRatio;
  label: string;
  icon: LucideIcon;
}

const STUDIO_ASPECT_RATIO_OPTIONS: StudioAspectRatioOption[] = [
  {
    value: '1:1',
    label: '1:1',
    icon: SquareIcon,
  },
  {
    value: '4:5',
    label: '4:5',
    icon: RectangleVerticalIcon,
  },
  {
    value: '3:4',
    label: '3:4',
    icon: RectangleVerticalIcon,
  },
  {
    value: '2:3',
    label: '2:3',
    icon: RectangleVerticalIcon,
  },
  {
    value: '9:16',
    label: '9:16',
    icon: SmartphoneIcon,
  },
];

function isStudioAspectRatio(value: string): value is StudioAspectRatio {
  return STUDIO_ASPECT_RATIOS.includes(value as StudioAspectRatio);
}

export const AspectRatioSelector = () => {
  const [aspectRatio, setAspectRatio] = useAtom(studioAspectRatioAtom);

  const selectedAspectRatio =
    STUDIO_ASPECT_RATIO_OPTIONS.find(
      (option) => option.value === aspectRatio
    ) ?? STUDIO_ASPECT_RATIO_OPTIONS[0];

  const SelectedAspectRatioIcon = selectedAspectRatio.icon;

  function handleAspectRatioChange(value: string) {
    if (!isStudioAspectRatio(value)) return;

    setAspectRatio(value);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground gap-1.5 text-xs font-normal"
        >
          <SelectedAspectRatioIcon className="size-3.5" />
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
