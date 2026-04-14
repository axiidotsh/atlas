import { getStudioConversation } from '@/mock-data/conversations';
import {
  CropIcon,
  RectangleVerticalIcon,
  SmartphoneIcon,
  SquareIcon,
  type LucideIcon,
} from 'lucide-react';
import { StudioAspectRatio } from './atoms';

export function getStudioProject(projectId: string) {
  return getStudioConversation(projectId);
}

interface StudioAspectRatioOption {
  value: StudioAspectRatio;
  label: string;
  icon: LucideIcon;
}

export const STUDIO_ASPECT_RATIO_OPTIONS: StudioAspectRatioOption[] = [
  {
    value: 'auto',
    label: 'Auto',
    icon: CropIcon,
  },
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

