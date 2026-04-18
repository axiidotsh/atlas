'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/utils/utils';
import type {
  ReportBlock,
  ReportCardBlock,
  ReportGraphBlock,
  ReportTableBlock,
  ReportTextBlock,
} from '@/mock-data/reports';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Streamdown } from 'streamdown';
import 'streamdown/styles.css';

const graphChartConfig = {
  value: {
    label: 'Value',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

interface ReportBlockRendererProps {
  block: ReportBlock;
  className?: string;
}

export const ReportBlockRenderer = ({
  block,
  className,
}: ReportBlockRendererProps) => {
  if (block.type === 'text') {
    return <ReportTextBlockRenderer block={block} className={className} />;
  }

  if (block.type === 'graph') {
    return <ReportGraphBlockRenderer block={block} className={className} />;
  }

  if (block.type === 'card') {
    return <ReportCardBlockRenderer block={block} className={className} />;
  }

  return <ReportTableBlockRenderer block={block} className={className} />;
};

interface ReportTextBlockRendererProps {
  block: ReportTextBlock;
  className?: string;
}

const ReportTextBlockRenderer = ({
  block,
  className,
}: ReportTextBlockRendererProps) => {
  return (
    <div className={cn('w-full', className)}>
      <Streamdown className="[&_ol]:list-outside [&_ol]:pl-8 [&_ul]:list-outside [&_ul]:pl-8">
        {block.content}
      </Streamdown>
    </div>
  );
};

interface ReportCardBlockRendererProps {
  block: ReportCardBlock;
  className?: string;
}

const ReportCardBlockRenderer = ({
  block,
  className,
}: ReportCardBlockRendererProps) => {
  return (
    <Card className={cn('gap-2', className)}>
      <CardHeader>
        <CardTitle className="text-muted-foreground text-sm">
          {block.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-semibold">{block.value}</p>
      </CardContent>
      {block.footer ? (
        <CardFooter>
          <p className="text-muted-foreground text-xs">{block.footer}</p>
        </CardFooter>
      ) : null}
    </Card>
  );
};

interface ReportGraphBlockRendererProps {
  block: ReportGraphBlock;
  className?: string;
}

const ReportGraphBlockRenderer = ({
  block,
  className,
}: ReportGraphBlockRendererProps) => {
  const chartData = block.data.map((point) => ({
    label: point.label,
    value: point.value,
  }));

  return (
    <Card className={cn('gap-2', className)}>
      <CardHeader>
        <CardTitle className="text-muted-foreground text-sm">
          {block.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {block.value || block.caption ? (
            <div className="space-y-1">
              {block.value ? (
                <p className="text-xl font-semibold">{block.value}</p>
              ) : null}
              {block.caption ? (
                <p className="text-muted-foreground text-xs">{block.caption}</p>
              ) : null}
            </div>
          ) : null}
          <ChartContainer className="h-56 w-full" config={graphChartConfig}>
            <AreaChart data={chartData} accessibilityLayer>
              <defs>
                <linearGradient
                  id={`report-graph-${block.id}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-value)"
                    stopOpacity={0.28}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-value)"
                    stopOpacity={0.04}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis hide domain={['dataMin', 'dataMax']} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--color-value)"
                strokeWidth={2}
                fill={`url(#report-graph-${block.id})`}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

interface ReportTableBlockRendererProps {
  block: ReportTableBlock;
  className?: string;
}

const ReportTableBlockRenderer = ({
  block,
  className,
}: ReportTableBlockRendererProps) => {
  return (
    <div
      className={cn(
        'dark:bg-muted bg-card overflow-hidden rounded-xl border',
        className
      )}
    >
      <Table>
        <TableHeader className="dark:bg-card bg-muted">
          <TableRow>
            {block.header.map((heading) => (
              <TableHead
                key={heading}
                className="h-12 px-5 text-sm font-semibold"
              >
                {heading}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {block.rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex} className="px-5 py-3 text-sm">
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
