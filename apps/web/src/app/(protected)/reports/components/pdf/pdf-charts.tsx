'use client';

import {
  GRAPH_HEIGHT,
  GRAPH_INNER_HEIGHT,
  GRAPH_INNER_WIDTH,
  GRAPH_PADDING,
  GRAPH_WIDTH,
} from '@/app/(protected)/reports/components/pdf/pdf-design';
import type { ReportGraphBlock } from '@/mock-data/reports';
import { Circle, Line, Path, Svg } from '@react-pdf/renderer';

export const ReportAreaChartSvg = ({
  data,
}: {
  data: ReportGraphBlock['data'];
}) => {
  const points = createGraphPoints(data);
  const linePath = createLinePath(points);
  const fillPath = createFillPath(points);

  return (
    <Svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT}>
      {[0, 1, 2, 3].map((index) => {
        const y = GRAPH_PADDING + (GRAPH_INNER_HEIGHT / 3) * index;

        return (
          <Line
            key={index}
            x1={GRAPH_PADDING}
            y1={y}
            x2={GRAPH_WIDTH - GRAPH_PADDING}
            y2={y}
            stroke="#E5E7EB"
            strokeWidth={1}
          />
        );
      })}
      <Path d={fillPath} fill="#DBEAFE" opacity={0.7} />
      <Path
        d={linePath}
        fill="none"
        stroke="#2563EB"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map((point, index) => (
        <Circle key={index} cx={point.x} cy={point.y} r={2.6} fill="#2563EB" />
      ))}
    </Svg>
  );
};

function createGraphPoints(data: ReportGraphBlock['data']) {
  const maxValue = Math.max(...data.map((point) => point.value));
  const minValue = Math.min(...data.map((point) => point.value));
  const valueRange = maxValue - minValue || 1;

  return data.map((point, index) => {
    const x =
      GRAPH_PADDING +
      (data.length === 1 ? 0 : (GRAPH_INNER_WIDTH / (data.length - 1)) * index);
    const normalizedValue = (point.value - minValue) / valueRange;
    const y =
      GRAPH_PADDING + GRAPH_INNER_HEIGHT - normalizedValue * GRAPH_INNER_HEIGHT;

    return { x, y };
  });
}

function createLinePath(points: Array<{ x: number; y: number }>) {
  return points
    .map(
      (point, index) =>
        `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`
    )
    .join(' ');
}

function createFillPath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) {
    return '';
  }

  const linePath = createLinePath(points);
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const baselineY = GRAPH_PADDING + GRAPH_INNER_HEIGHT;

  return `${linePath} L ${lastPoint.x.toFixed(2)} ${baselineY.toFixed(2)} L ${firstPoint.x.toFixed(2)} ${baselineY.toFixed(2)} Z`;
}
