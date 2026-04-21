import type { MockReport, ReportBlock } from '@/mock-data/reports';

export interface ReportBlockGroup {
  type: ReportBlock['type'];
  blocks: ReportBlock[];
}

export function groupReportBlocks(blocks: ReportBlock[]): ReportBlockGroup[] {
  const groups: ReportBlockGroup[] = [];

  for (const block of blocks) {
    const lastGroup = groups[groups.length - 1];

    if (
      lastGroup &&
      lastGroup.type === block.type &&
      (block.type === 'card' || block.type === 'graph')
    ) {
      lastGroup.blocks.push(block);
      continue;
    }

    groups.push({ type: block.type, blocks: [block] });
  }

  return groups;
}

export function getPdfReportBlocks(report: MockReport): ReportBlock[] {
  const [firstBlock, ...restBlocks] = report.blocks;

  if (firstBlock?.type !== 'text') {
    return report.blocks;
  }

  const normalizedTitle = normalizeTitle(report.title);
  const lines = firstBlock.content.split('\n');
  const firstLine = lines[0]?.trim();

  if (!firstLine?.startsWith('# ')) {
    return report.blocks;
  }

  if (normalizeTitle(firstLine.slice(2)) !== normalizedTitle) {
    return report.blocks;
  }

  const contentWithoutTitle = lines
    .join('\n')
    .replace(/^# .+\n*/, '')
    .trim();

  if (!contentWithoutTitle) {
    return restBlocks;
  }

  return [{ ...firstBlock, content: contentWithoutTitle }, ...restBlocks];
}

function normalizeTitle(value: string) {
  return value.trim().toLowerCase();
}
