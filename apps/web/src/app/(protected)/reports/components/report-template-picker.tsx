'use client';

import { ReportBlockRenderer } from '@/app/(protected)/reports/components/report-blocks';
import { ReportDetail } from '@/app/(protected)/reports/components/report-detail';
import type { ReportFormValues } from '@/app/(protected)/reports/report-form';
import {
  REPORT_TEMPLATES,
  type ReportTemplate,
} from '@/app/(protected)/reports/report-templates';
import { Button } from '@/components/ui/button';
import { Field, FieldError } from '@/components/ui/field';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/utils/utils';
import { CheckIcon, EyeIcon, LayoutTemplateIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

function getTemplatePreviewBlocks(template: ReportTemplate) {
  const firstBlockType = template.report.blocks[0]?.type;
  const isShortBlock = firstBlockType === 'card' || firstBlockType === 'table';

  return template.report.blocks.slice(0, isShortBlock ? 2 : 1);
}

export const ReportTemplatePicker = () => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<ReportFormValues>();
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(
    null
  );
  const instructions = useWatch({ control, name: 'instructions' });
  const selectedTemplateId = useWatch({ control, name: 'templateId' });

  const previewTemplate = previewTemplateId
    ? (REPORT_TEMPLATES.find((template) => template.id === previewTemplateId) ??
      null)
    : null;
  const shouldShowRequirementError =
    !instructions?.trim() &&
    !selectedTemplateId &&
    Boolean(errors.instructions?.message);

  function handleTemplateChange(templateId?: string) {
    setValue('templateId', templateId, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  return (
    <>
      <Field data-invalid={shouldShowRequirementError || undefined}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REPORT_TEMPLATES.map((template) => {
            const isSelected = template.id === selectedTemplateId;
            const previewBlocks = getTemplatePreviewBlocks(template);

            return (
              <div
                key={template.id}
                className={cn(
                  'bg-card border-border/50 hover:bg-muted relative flex flex-col overflow-hidden rounded-xl border transition-colors duration-300',
                  isSelected &&
                    'border-primary/40 bg-primary/5 hover:bg-primary/5'
                )}
              >
                {isSelected ? (
                  <span
                    aria-hidden
                    className="bg-primary text-primary-foreground pointer-events-none absolute top-2 right-2 z-10 flex size-5 items-center justify-center rounded-full shadow-sm"
                  >
                    <CheckIcon className="size-3.5" />
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => setPreviewTemplateId(template.id)}
                  aria-label={`Preview ${template.title}`}
                  className="bg-background dark:bg-muted/95 border-border/50 group/preview relative block h-40 cursor-pointer overflow-hidden border-b px-3 pt-3 text-left"
                >
                  {previewBlocks.length > 0 ? (
                    <div
                      className="origin-top-left space-y-3"
                      style={{
                        transform: 'scale(0.55)',
                        width: 'calc(100% / 0.55)',
                      }}
                    >
                      {previewBlocks.map((block) => (
                        <ReportBlockRenderer key={block.id} block={block} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground flex size-full items-center justify-center gap-2 text-sm">
                      <LayoutTemplateIcon className="size-4" />
                      No preview available
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover/preview:opacity-100">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white">
                      <EyeIcon className="size-3.5" />
                      Preview
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleTemplateChange(isSelected ? undefined : template.id)
                  }
                  aria-pressed={isSelected}
                  aria-label={
                    isSelected
                      ? `Deselect ${template.title}`
                      : `Select ${template.title}`
                  }
                  className="block cursor-pointer px-4 py-3 text-left"
                >
                  <p className="truncate text-sm font-medium">
                    {template.title}
                  </p>
                  <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">
                    {template.description}
                  </p>
                </button>
              </div>
            );
          })}
        </div>
        {shouldShowRequirementError ? (
          <FieldError errors={[errors.instructions]} />
        ) : null}
      </Field>
      <Sheet
        open={Boolean(previewTemplate)}
        onOpenChange={(open) => {
          if (!open) {
            setPreviewTemplateId(null);
          }
        }}
      >
        <SheetContent className="gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-[min(90vw,1280px)] data-[side=right]:lg:max-w-4xl">
          {previewTemplate ? (
            <>
              <SheetHeader className="border-border/50 dark:bg-background border-b">
                <SheetTitle>{previewTemplate.title}</SheetTitle>
                <SheetDescription>
                  {previewTemplate.description}
                </SheetDescription>
              </SheetHeader>
              <div className="bg-background min-h-0 flex-1 overflow-y-auto px-5">
                <ReportDetail report={previewTemplate.report} />
              </div>
              <SheetFooter className="border-border/50 dark:bg-background border-t sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPreviewTemplateId(null)}
                >
                  Close
                </Button>
                <Button
                  type="button"
                  variant={
                    selectedTemplateId === previewTemplate.id
                      ? 'secondary'
                      : 'default'
                  }
                  onClick={() =>
                    handleTemplateChange(
                      selectedTemplateId === previewTemplate.id
                        ? undefined
                        : previewTemplate.id
                    )
                  }
                >
                  {selectedTemplateId === previewTemplate.id ? (
                    <>
                      <XIcon className="size-4" />
                      Deselect template
                    </>
                  ) : (
                    <>
                      <CheckIcon className="size-4" />
                      Use template
                    </>
                  )}
                </Button>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
};
