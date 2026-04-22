import type { DateRange } from 'react-day-picker';
import { z } from 'zod';

const reportDateRangeSchema: z.ZodType<DateRange> = z.object({
  from: z.union([z.date(), z.undefined()]),
  to: z.union([z.date(), z.undefined()]).optional(),
});

export const reportFormSchema = z
  .object({
    title: z.string().max(100).default(''),
    instructions: z.string().default(''),
    templateId: z.string().optional(),
    dateRange: reportDateRangeSchema.optional(),
  })
  .superRefine(({ instructions, templateId }, context) => {
    if (instructions.trim() || templateId) {
      return;
    }

    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['instructions'],
      message: 'Add instructions or choose a template',
    });
  });

export type ReportFormValues = z.infer<typeof reportFormSchema>;

export const DEFAULT_REPORT_FORM_VALUES: ReportFormValues = {
  title: '',
  instructions: '',
  templateId: undefined,
  dateRange: undefined,
};

export function createReportFormValues(
  overrides: Partial<ReportFormValues> = {}
): ReportFormValues {
  const dateRange = overrides.dateRange
    ? {
        from: overrides.dateRange.from,
        to: overrides.dateRange.to,
      }
    : undefined;

  return {
    ...DEFAULT_REPORT_FORM_VALUES,
    ...overrides,
    dateRange,
  };
}
