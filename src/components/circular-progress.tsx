const ICON_RADIUS = 10;
const ICON_VIEWBOX = 24;
const ICON_CENTER = 12;
const ICON_STROKE_WIDTH = 2;

interface CircularProgressProps {
  value: number;
  maxValue: number;
  size?: number;
}

export const CircularProgress = ({
  value,
  maxValue,
  size,
}: CircularProgressProps) => {
  const circumference = 2 * Math.PI * ICON_RADIUS;
  const usedPercent = value / maxValue;
  const dashOffset = circumference * (1 - usedPercent);

  const height = size ?? 20;
  const width = size ?? 20;

  return (
    <svg
      aria-label="Model context usage"
      height={height}
      role="img"
      style={{ color: 'currentcolor' }}
      viewBox={`0 0 ${ICON_VIEWBOX} ${ICON_VIEWBOX}`}
      width={width}
    >
      <circle
        cx={ICON_CENTER}
        cy={ICON_CENTER}
        fill="none"
        opacity="0.25"
        r={ICON_RADIUS}
        stroke="currentColor"
        strokeWidth={ICON_STROKE_WIDTH}
      />
      <circle
        cx={ICON_CENTER}
        cy={ICON_CENTER}
        fill="none"
        opacity="0.7"
        r={ICON_RADIUS}
        stroke="currentColor"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        strokeWidth={ICON_STROKE_WIDTH}
        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
      />
    </svg>
  );
};
