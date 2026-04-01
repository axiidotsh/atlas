import { CircularProgress } from '@/components/circular-progress';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Progress } from '@/components/ui/progress';

interface TokenUsageProps {
  usedTokens: number;
  maxTokens: number;
}

export const TokenUsage = ({ usedTokens, maxTokens }: TokenUsageProps) => {
  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger>
        <CircularProgress value={usedTokens} maxValue={maxTokens} size={16} />
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs">20%</span>
            <span className="text-muted-foreground text-xs">40k / 128k</span>
          </div>
          <Progress value={usedTokens} max={maxTokens} />
          <p className="text-muted-foreground mt-2 text-xs">
            Your tokens will refresh in 20 days
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
