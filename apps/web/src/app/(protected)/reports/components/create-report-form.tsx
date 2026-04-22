'use client';

import { RichTextEditor } from '@/components/chat/editor/rich-text-editor';
import { DateRangePicker } from '@/components/date-range-picker';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Kbd } from '@/components/ui/kbd';
import { MENTION_OPTIONS } from '@/mock-data/mention-data';
import { useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import type { ReportFormValues } from '../report-form';

export const CreateReportForm = () => {
  const { control } = useFormContext<ReportFormValues>();
  const mentionMenuContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-card dark:bg-muted border-border/50 space-y-7 rounded-xl border p-5 shadow-sm">
      <Controller
        name="title"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel>
              Title
              <span className="text-muted-foreground text-xs font-normal">
                (optional)
              </span>
            </FieldLabel>
            <Input
              {...field}
              placeholder="Q2 performance summary"
              aria-invalid={fieldState.invalid}
              className="bg-background dark:bg-input/30"
            />
            {fieldState.invalid ? (
              <FieldError errors={[fieldState.error]} />
            ) : null}
          </Field>
        )}
      />
      <Controller
        name="instructions"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel>Instructions</FieldLabel>
            <div ref={mentionMenuContainerRef} className="relative">
              <div className="border-input bg-background dark:bg-input/30 rounded-md border shadow-xs">
                <RichTextEditor
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Summarize Q1 for @Wod Armour and highlight the top creatives..."
                  mentionOptions={MENTION_OPTIONS}
                  mentionMenuContainerRef={mentionMenuContainerRef}
                  className="min-h-32 overflow-y-auto px-3 py-2 text-sm outline-none"
                />
              </div>
            </div>
            <FieldDescription className="inline-flex flex-wrap items-center gap-1 text-xs">
              Tag ad accounts, campaigns, ad sets, or ads with
              <Kbd className="bg-accent/50">@</Kbd>
            </FieldDescription>
            {fieldState.invalid ? (
              <FieldError errors={[fieldState.error]} />
            ) : null}
          </Field>
        )}
      />
      <Controller
        name="dateRange"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel>
              Date range
              <span className="text-muted-foreground text-xs font-normal">
                (optional)
              </span>
            </FieldLabel>
            <DateRangePicker
              id="report-date-range"
              date={field.value}
              onDateChange={field.onChange}
              align="center"
              className="w-full"
            />
            <FieldDescription>
              Set this if you want to analyze a specific period
            </FieldDescription>
          </Field>
        )}
      />
    </div>
  );
};
