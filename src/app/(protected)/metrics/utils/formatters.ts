export function parseMetricValue(value: string): number {
  const normalizedValue = value.replace(/[$,%x,]/g, '').trim();

  if (normalizedValue.length === 0) {
    return 0;
  }

  const suffix = normalizedValue.at(-1);
  const multiplier =
    suffix === 'K'
      ? 1_000
      : suffix === 'M'
        ? 1_000_000
        : suffix === 'B'
          ? 1_000_000_000
          : 1;
  const numericPortion =
    multiplier === 1 ? normalizedValue : normalizedValue.slice(0, -1);

  return Number(numericPortion) * multiplier;
}

export function toTitleCase(value: string): string {
  return value.replace(/\b\w/g, (character) => character.toUpperCase());
}
