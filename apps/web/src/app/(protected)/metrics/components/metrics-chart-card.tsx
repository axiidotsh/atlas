import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface MetricsChartCardProps {
  title: string;
  description: string;
  summary: string;
  summaryLabel: string;
  children: ReactNode;
}

export const MetricsChartCard = ({
  title,
  description,
  summary,
  summaryLabel,
  children,
}: MetricsChartCardProps) => {
  return (
    <Card className="gap-2">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-muted-foreground text-sm">
            {title}
          </CardTitle>
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="text-muted-foreground size-3" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{description}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-xl font-semibold">{summary}</p>
            <p className="text-muted-foreground text-xs">{summaryLabel}</p>
          </div>
          {children}
        </div>
      </CardContent>
    </Card>
  );
};
