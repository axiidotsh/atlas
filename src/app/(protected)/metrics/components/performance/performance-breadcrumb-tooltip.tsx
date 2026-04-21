'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PerformanceBreadcrumbTooltipProps {
  label: string;
}

export const PerformanceBreadcrumbTooltip = ({
  label,
}: PerformanceBreadcrumbTooltipProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="truncate">{label}</span>
      </TooltipTrigger>
      <TooltipContent sideOffset={6}>{label}</TooltipContent>
    </Tooltip>
  );
};
