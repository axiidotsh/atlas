'use client';

import { platformBreakdownVisibleMetricsAtom } from '@/app/(protected)/metrics/atoms';
import {
  PLATFORM_BREAKDOWN_METRIC_KEYS,
  PLATFORM_BREAKDOWN_METRIC_LABELS,
  type PlatformBreakdownMetricKey,
} from '@/app/(protected)/metrics/config/platform-breakdown.config';
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
import { ChevronDownIcon } from 'lucide-react';

export const PlatformBreakdownMetricsMenu = () => {
  const [visibleMetrics, setVisibleMetrics] = useAtom(
    platformBreakdownVisibleMetricsAtom
  );

  const toggleMetric = (key: PlatformBreakdownMetricKey, checked: boolean) => {
    setVisibleMetrics((current) => {
      if (checked) {
        return PLATFORM_BREAKDOWN_METRIC_KEYS.filter(
          (metric) => current.includes(metric) || metric === key
        );
      }

      return current.filter((metric) => metric !== key);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="justify-between sm:w-auto"
        >
          Metrics
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Visible metrics</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {PLATFORM_BREAKDOWN_METRIC_KEYS.map((key) => (
          <DropdownMenuCheckboxItem
            key={key}
            checked={visibleMetrics.includes(key)}
            onCheckedChange={(checked) => toggleMetric(key, checked)}
            onSelect={(event) => event.preventDefault()}
          >
            {PLATFORM_BREAKDOWN_METRIC_LABELS[key]}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
