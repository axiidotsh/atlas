'use client';

import type { BreakdownDatum } from '@/app/(protected)/metrics/utils/account-structure';
import { formatPercentage } from '@/app/(protected)/metrics/utils/account-structure';
import { GoogleAdsLogo, MetaLogo } from '@/components/icons';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Cell, Pie, PieChart } from 'recharts';

interface BreakdownLabelProps {
  slice: BreakdownDatum;
}

const BreakdownLabel = ({ slice }: BreakdownLabelProps) => {
  if (slice.platform === 'meta') {
    return (
      <>
        <MetaLogo className="h-3 w-auto" />
        <span className="truncate">{slice.label}</span>
      </>
    );
  }

  if (slice.platform === 'google') {
    return (
      <>
        <GoogleAdsLogo className="h-4 w-auto" />
        <span className="truncate">{slice.label}</span>
      </>
    );
  }

  return <span className="truncate">{slice.label}</span>;
};

interface BreakdownPieCardProps {
  data: BreakdownDatum[];
  config: ChartConfig;
}

export const BreakdownPieCard = ({ data, config }: BreakdownPieCardProps) => {
  return (
    <div className="flex flex-col items-center gap-5 pb-3">
      <ChartContainer className="mx-auto aspect-square h-56" config={config}>
        <PieChart accessibilityLayer>
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                nameKey="id"
                formatter={(_value, _name, item) => {
                  const slice = item.payload as BreakdownDatum;

                  return (
                    <div className="flex min-w-36 items-center justify-between gap-4">
                      <div className="text-muted-foreground flex items-center gap-2">
                        <BreakdownLabel slice={slice} />
                      </div>
                      <span className="text-foreground font-mono font-medium tabular-nums">
                        {slice.value} ({formatPercentage(slice.percentage)})
                      </span>
                    </div>
                  );
                }}
              />
            }
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="id"
            innerRadius={58}
            outerRadius={82}
            paddingAngle={3}
            strokeWidth={0}
          >
            {data.map((slice) => (
              <Cell key={slice.id} fill={slice.fill} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>

      <div className="flex w-full max-w-xs flex-col items-center gap-2">
        {data.map((slice) => (
          <div
            key={slice.id}
            className="text-muted-foreground flex w-full items-center justify-between gap-4 text-xs"
          >
            <div className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: slice.fill }}
              />
              <BreakdownLabel slice={slice} />
            </div>
            <p className="tabular-nums">
              {slice.value} ({formatPercentage(slice.percentage)})
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
