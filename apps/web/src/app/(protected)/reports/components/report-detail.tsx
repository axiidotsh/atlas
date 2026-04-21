'use client';

import { ReportBlockRenderer } from '@/app/(protected)/reports/components/report-blocks';
import { groupReportBlocks } from '@/app/(protected)/reports/report-block-utils';
import type { MockReport } from '@/mock-data/reports';
import { cn } from '@/utils/utils';

interface ReportDetailProps {
  report: MockReport;
}

export const ReportDetail = ({ report }: ReportDetailProps) => {
  const groups = groupReportBlocks(report.blocks);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-6 sm:py-8">
      {groups.map((group, index) => {
        if (group.type === 'card') {
          const count = group.blocks.length;
          const useThreeCols = count <= 3 || count % 3 === 0;
          const cardCols = useThreeCols ? 'lg:grid-cols-3' : 'lg:grid-cols-4';
          return (
            <div
              key={index}
              className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2', cardCols)}
            >
              {group.blocks.map((block) => (
                <ReportBlockRenderer key={block.id} block={block} />
              ))}
            </div>
          );
        }

        if (group.type === 'graph') {
          const graphCols =
            group.blocks.length === 1 ? 'lg:grid-cols-1' : 'lg:grid-cols-2';
          return (
            <div
              key={index}
              className={cn('grid grid-cols-1 gap-4', graphCols)}
            >
              {group.blocks.map((block) => (
                <ReportBlockRenderer key={block.id} block={block} />
              ))}
            </div>
          );
        }

        return (
          <div key={index} className="flex flex-col gap-6">
            {group.blocks.map((block) => (
              <ReportBlockRenderer key={block.id} block={block} />
            ))}
          </div>
        );
      })}
    </div>
  );
};
