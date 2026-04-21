import type { CreativeInsightRow } from '@/app/(protected)/metrics/metrics-data';
import { parseMetricValue } from '@/app/(protected)/metrics/utils/formatters';
import type { CoreMetricId, MockCreativeMedia } from '@/mock-data/types';

export const CREATIVE_DISPLAY_LIMIT = 5;

export function getCreativeThumbnail(media: MockCreativeMedia): string {
  if (media.type === 'video') {
    return media.posterSrc ?? media.src;
  }
  return media.src;
}

export function compareCreatives(
  leftAd: CreativeInsightRow,
  rightAd: CreativeInsightRow,
  selectedMetricId: CoreMetricId
): number {
  const metricDifference =
    parseMetricValue(rightAd.metrics[selectedMetricId]) -
    parseMetricValue(leftAd.metrics[selectedMetricId]);

  if (metricDifference !== 0) {
    return metricDifference;
  }

  return (
    parseMetricValue(rightAd.metrics.revenue) -
    parseMetricValue(leftAd.metrics.revenue)
  );
}
