import { getReport, type MockReport } from '@/mock-data/reports';

export interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  report: MockReport;
}

function getTemplateReport(reportId: string) {
  const report = getReport(reportId);

  if (!report) {
    throw new Error(`Missing report template source: ${reportId}`);
  }

  return report;
}

export const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'executive-summary',
    title: 'Executive Summary',
    description:
      'A high-level narrative with KPI cards, trend graphs, and a concise wrap-up for leadership.',
    report: getTemplateReport('report-exec-overview'),
  },
  {
    id: 'performance-deep-dive',
    title: 'Performance Deep Dive',
    description:
      'A detailed channel breakdown with key metrics, pacing context, and performance trends.',
    report: getTemplateReport('report-q1-performance'),
  },
  {
    id: 'weekly-digest',
    title: 'Weekly Digest',
    description:
      'A lighter weekly readout with top wins, watchouts, and next-step recommendations.',
    report: getTemplateReport('report-weekly-digest'),
  },
];
