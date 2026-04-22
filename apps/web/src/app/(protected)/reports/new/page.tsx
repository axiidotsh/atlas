'use client';

import { CreateReportForm } from '@/app/(protected)/reports/components/create-report-form';
import { ReportTemplatePicker } from '@/app/(protected)/reports/components/report-template-picker';
import {
  createReportFormValues,
  reportFormSchema,
  type ReportFormValues,
} from '@/app/(protected)/reports/report-form';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { SparklesIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';

export default function NewReportPage() {
  const router = useRouter();

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema as never) as never,
    defaultValues: createReportFormValues(),
  });

  function handleSubmit() {
    router.push('/reports');
  }

  return (
    <div className="mx-auto w-full max-w-5xl py-6 sm:py-14 2xl:py-20">
      <div className="mb-8 flex items-center gap-3">
        <div>
          <h1 className="text-xl font-semibold">Create New Report</h1>
          <p className="text-muted-foreground text-sm">
            Describe what you want analyzed and define the time window for the
            report.
          </p>
        </div>
      </div>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <CreateReportForm />
          <div className="relative flex items-center py-2">
            <div className="flex-1 border-t" />
            <span className="text-muted-foreground px-3 text-xs font-medium">
              Or start from a template
            </span>
            <div className="flex-1 border-t" />
          </div>
          <ReportTemplatePicker />
          <div className="bg-background sticky bottom-0 -mx-1 flex items-center justify-end gap-3 border-t px-1 py-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/reports">Cancel</Link>
            </Button>
            <Button type="submit">
              <SparklesIcon className="size-4" />
              Create Report
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
