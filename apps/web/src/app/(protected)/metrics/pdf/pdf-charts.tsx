'use client';

import {
  CHART_COLORS,
  CHART_HEIGHT,
  CHART_WIDTH,
  DONUT_SIZE,
  FONT_FAMILY,
  MUTED,
} from '@/app/(protected)/metrics/pdf/pdf-design';
import type {
  PieSlice,
  Point,
} from '@/app/(protected)/metrics/pdf/pdf-formatters';
import type { ReactElement } from 'react';

interface ChartBounds {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
}

function getChartBounds(): ChartBounds {
  const left = 12;
  const top = 8;
  const right = CHART_WIDTH - 10;
  const bottom = CHART_HEIGHT - 24;

  return {
    bottom,
    height: bottom - top,
    left,
    right,
    top,
    width: right - left,
  };
}

function scaleValue(
  value: number,
  domainMin: number,
  domainMax: number,
  rangeMin: number,
  rangeMax: number
): number {
  if (domainMax === domainMin) {
    return (rangeMin + rangeMax) / 2;
  }

  const ratio = (value - domainMin) / (domainMax - domainMin);

  return rangeMin - ratio * (rangeMin - rangeMax);
}

function createChartPoints(
  values: number[],
  bounds: ChartBounds,
  range: { max: number; min: number }
): Point[] {
  if (values.length === 1) {
    return [
      {
        x: bounds.left + bounds.width / 2,
        y: scaleValue(
          values[0],
          range.min,
          range.max,
          bounds.bottom,
          bounds.top
        ),
      },
    ];
  }

  return values.map((value, index) => ({
    x: bounds.left + (bounds.width / (values.length - 1)) * index,
    y: scaleValue(value, range.min, range.max, bounds.bottom, bounds.top),
  }));
}

function getPaddedRange(
  values: number[],
  paddingRatio: number
): { max: number; min: number } {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const delta = max - min || max * 0.1 || 1;
  const padding = delta * paddingRatio;

  return {
    max: max + padding,
    min: Math.max(0, min - padding),
  };
}

function getRangeFromMultiple(
  valueGroups: number[][],
  paddingRatio: number,
  clampToZero: boolean
): { max: number; min: number } {
  const values = valueGroups.flat();
  const min = Math.min(...values);
  const max = Math.max(...values);
  const delta = max - min || max * 0.1 || 1;
  const padding = delta * paddingRatio;

  return {
    max: max + padding,
    min: clampToZero ? Math.max(0, min - padding) : min - padding,
  };
}

function createLinePath(points: Point[]): string {
  if (points.length === 0) {
    return '';
  }

  return points
    .map(
      (point, index) =>
        `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`
    )
    .join(' ');
}

function createAreaPath(points: Point[], baselineY: number): string {
  if (points.length === 0) {
    return '';
  }

  const linePath = createLinePath(points);
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];

  return `${linePath} L ${lastPoint.x.toFixed(2)} ${baselineY.toFixed(2)} L ${firstPoint.x.toFixed(2)} ${baselineY.toFixed(2)} Z`;
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number } {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeDonutSlice(
  centerX: number,
  centerY: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number
): string {
  const outerStart = polarToCartesian(centerX, centerY, outerRadius, endAngle);
  const outerEnd = polarToCartesian(centerX, centerY, outerRadius, startAngle);
  const innerStart = polarToCartesian(
    centerX,
    centerY,
    innerRadius,
    startAngle
  );
  const innerEnd = polarToCartesian(centerX, centerY, innerRadius, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${innerEnd.x} ${innerEnd.y}`,
    'Z',
  ].join(' ');
}

function renderGrid(bounds: ChartBounds, labels: string[]): ReactElement {
  const gridLines = 4;
  const step = labels.length > 1 ? bounds.width / (labels.length - 1) : 0;

  return (
    <>
      {Array.from({ length: gridLines }).map((_, index) => {
        const y = bounds.top + (bounds.height / (gridLines - 1)) * index;

        return (
          <line
            key={`grid-${index}`}
            stroke={CHART_COLORS.grid}
            strokeDasharray="3 3"
            strokeWidth="1"
            x1={bounds.left}
            x2={bounds.right}
            y1={y}
            y2={y}
          />
        );
      })}
      {labels.map((label, index) => {
        const x = bounds.left + step * index;

        return (
          <text
            key={label}
            fill={CHART_COLORS.labels}
            fontFamily={FONT_FAMILY}
            fontSize="9"
            textAnchor={
              index === 0
                ? 'start'
                : index === labels.length - 1
                  ? 'end'
                  : 'middle'
            }
            x={x}
            y={CHART_HEIGHT - 8}
          >
            {label}
          </text>
        );
      })}
    </>
  );
}

export const DonutChartSvg = ({ data }: { data: PieSlice[] }) => {
  const center = DONUT_SIZE / 2;
  const outerRadius = 62;
  const innerRadius = 38;
  const slices = data.reduce<
    Array<{
      color: string;
      label: string;
      nextAngle: number;
      path: string;
    }>
  >((items, slice) => {
    const startAngle =
      items.length === 0 ? -90 : items[items.length - 1].nextAngle;
    const angle = Math.max(slice.percentage * 360, 3);
    const endAngle = startAngle + angle;

    return [
      ...items,
      {
        color: slice.color,
        label: slice.label,
        nextAngle: endAngle + 1.5,
        path: describeDonutSlice(
          center,
          center,
          outerRadius,
          innerRadius,
          startAngle,
          endAngle
        ),
      },
    ];
  }, []);

  return (
    <svg
      height={DONUT_SIZE}
      viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}
      width={DONUT_SIZE}
    >
      <circle
        cx={center}
        cy={center}
        fill="none"
        r={outerRadius}
        stroke={MUTED}
        strokeWidth={outerRadius - innerRadius}
      />
      {slices.map((slice) => (
        <path key={slice.label} d={slice.path} fill={slice.color} />
      ))}
    </svg>
  );
};

export const AreaTrendSvg = ({
  color,
  data,
  fillColor,
}: {
  color: string;
  data: Array<{ label: string; value: number }>;
  fillColor: string;
}) => {
  const bounds = getChartBounds();
  const points = createChartPoints(
    data.map((item) => item.value),
    bounds,
    getPaddedRange(
      data.map((item) => item.value),
      0.18
    )
  );

  return (
    <svg
      height={CHART_HEIGHT}
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      width={CHART_WIDTH}
    >
      {renderGrid(
        bounds,
        data.map((item) => item.label)
      )}
      <path
        d={createAreaPath(points, bounds.bottom)}
        fill={fillColor}
        fillOpacity="0.35"
      />
      <path
        d={createLinePath(points)}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
      />
    </svg>
  );
};

export const DualLineTrendSvg = ({
  data,
  primaryColor,
  secondaryColor,
}: {
  data: Array<{ label: string; primaryValue: number; secondaryValue: number }>;
  primaryColor: string;
  secondaryColor: string;
}) => {
  const bounds = getChartBounds();
  const primaryValues = data.map((item) => item.primaryValue);
  const secondaryValues = data.map((item) => item.secondaryValue);
  const range = getRangeFromMultiple(
    [primaryValues, secondaryValues],
    0.12,
    true
  );
  const primaryPoints = createChartPoints(primaryValues, bounds, range);
  const secondaryPoints = createChartPoints(secondaryValues, bounds, range);

  return (
    <svg
      height={CHART_HEIGHT}
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      width={CHART_WIDTH}
    >
      {renderGrid(
        bounds,
        data.map((item) => item.label)
      )}
      <path
        d={createLinePath(primaryPoints)}
        fill="none"
        stroke={primaryColor}
        strokeWidth="2.5"
      />
      <path
        d={createLinePath(secondaryPoints)}
        fill="none"
        stroke={secondaryColor}
        strokeWidth="2.5"
      />
    </svg>
  );
};

export const BarLineTrendSvg = ({
  barColor,
  data,
  lineColor,
}: {
  barColor: string;
  data: Array<{ barValue: number; label: string; lineValue: number }>;
  lineColor: string;
}) => {
  const bounds = getChartBounds();
  const range = getRangeFromMultiple(
    [data.map((item) => item.barValue), data.map((item) => item.lineValue)],
    0.12,
    true
  );
  const step = bounds.width / data.length;
  const barWidth = step * 0.48;
  const linePoints = createChartPoints(
    data.map((item) => item.lineValue),
    {
      ...bounds,
      left: bounds.left + step / 2,
      width: bounds.width - step,
    },
    range
  );

  return (
    <svg
      height={CHART_HEIGHT}
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      width={CHART_WIDTH}
    >
      {renderGrid(
        bounds,
        data.map((item) => item.label)
      )}
      {data.map((item, index) => {
        const x = bounds.left + step * index + (step - barWidth) / 2;
        const y = scaleValue(
          item.barValue,
          range.min,
          range.max,
          bounds.bottom,
          bounds.top
        );
        const height = bounds.bottom - y;

        return (
          <rect
            key={item.label}
            fill={barColor}
            height={Math.max(4, height)}
            rx="6"
            ry="6"
            width={barWidth}
            x={x}
            y={y}
          />
        );
      })}
      <path
        d={createLinePath(linePoints)}
        fill="none"
        stroke={lineColor}
        strokeWidth="2.5"
      />
    </svg>
  );
};
