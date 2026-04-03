import { MOCK_STUDIO_PROJECTS } from '@/mock-data/studio-projects';
import {
  RectangleVerticalIcon,
  SmartphoneIcon,
  SquareIcon,
  type LucideIcon,
} from 'lucide-react';
import { STUDIO_ASPECT_RATIOS, StudioAspectRatio } from './atoms';

export function getStudioProject(projectId: string) {
  return MOCK_STUDIO_PROJECTS.find((project) => project.id === projectId);
}

interface StudioAspectRatioOption {
  value: StudioAspectRatio;
  label: string;
  icon: LucideIcon;
}

export const STUDIO_ASPECT_RATIO_OPTIONS: StudioAspectRatioOption[] = [
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

export function isStudioAspectRatio(value: string): value is StudioAspectRatio {
  return STUDIO_ASPECT_RATIOS.includes(value as StudioAspectRatio);
}

export function getAspectRatio(aspectRatio: string) {
  return (
    STUDIO_ASPECT_RATIO_OPTIONS.find(
      (option) => option.value === aspectRatio
    ) ?? STUDIO_ASPECT_RATIO_OPTIONS[0]
  );
}
