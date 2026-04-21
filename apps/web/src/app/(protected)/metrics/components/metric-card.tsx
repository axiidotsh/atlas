import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/utils/utils';
import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  InfoIcon,
  MinusIcon,
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  description: string;
  value: string;
  percentageChange: number;
  trend: 'positive' | 'negative' | 'neutral';
}

export const MetricCard = ({
  title,
  description,
  percentageChange,
  value,
  trend,
}: MetricCardProps) => {
  const TrendIcon =
    trend === 'positive' ? (
      <ArrowUpRightIcon />
    ) : trend === 'negative' ? (
      <ArrowDownRightIcon />
    ) : (
      <MinusIcon />
    );

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
        <p className="text-xl font-semibold">{value}</p>
      </CardContent>
      <CardFooter>
        <div
          className={cn(
            'text-muted-foreground flex items-center gap-0.5 text-xs [&_svg]:size-3.5',
            trend === 'negative' && 'text-destructive dark:text-red-300',
            trend === 'positive' && 'text-green-600 dark:text-green-300'
          )}
        >
          {TrendIcon}
          {percentageChange}%
        </div>
      </CardFooter>
    </Card>
  );
};
