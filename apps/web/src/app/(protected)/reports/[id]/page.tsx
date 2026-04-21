import { ReportDetail } from '@/app/(protected)/reports/components/report-detail';
import { getReport } from '@/mock-data/reports';
import { notFound } from 'next/navigation';

interface ReportPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params;
  const report = getReport(id);

  if (!report) {
    notFound();
  }

  return <ReportDetail report={report} />;
}
