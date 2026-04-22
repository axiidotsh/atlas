'use client';

import { RichTextEditor } from '@/components/chat/editor/rich-text-editor';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { MENTION_OPTIONS } from '@/mock-data/mention-data';
import { SparklesIcon } from 'lucide-react';
import { useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import type { ProjectFormValues } from '../../project-form';
import { ImageUpload } from './image-upload';

export const ProjectIdentityFields = () => {
  const { control } = useFormContext<ProjectFormValues>();

  return (
    <>
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel>Project Name</FieldLabel>
            <Input
              {...field}
              placeholder="Spring Product Launch Creatives"
              aria-invalid={fieldState.invalid}
              className="bg-background dark:bg-input/30"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="logo"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel>Logo</FieldLabel>
            <ImageUpload
              images={field.value ? [field.value] : []}
              onChange={(images) => field.onChange(images[0] ?? null)}
              multiple={false}
              label="Drop your logo here or click to upload"
            />
          </Field>
        )}
      />
    </>
  );
};

export const ProjectDescriptionField = () => {
  const { control } = useFormContext<ProjectFormValues>();
  const mentionMenuContainerRef = useRef<HTMLDivElement>(null);

  return (
    <Controller
      name="prompt"
      control={control}
      render={({ field }) => (
        <Field>
          <FieldLabel className="flex items-center gap-1.5">
            <SparklesIcon className="text-primary size-3.5" />
            Describe Your Brand or Creative Project
          </FieldLabel>
          <div ref={mentionMenuContainerRef} className="relative">
            <div className="border-input bg-background dark:bg-input/30 rounded-md border shadow-xs">
              <RichTextEditor
                value={field.value ?? ''}
                onValueChange={field.onChange}
                placeholder="A luxury skincare brand creating a spring launch creative project with paid social ads, retargeting variations, and minimalist lifestyle visuals..."
                mentionOptions={MENTION_OPTIONS}
                mentionMenuContainerRef={mentionMenuContainerRef}
                className="min-h-32 overflow-y-auto px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>
          <FieldDescription>
            We&apos;ll auto-populate any empty project details from your
            description. You can fine-tune everything below.
          </FieldDescription>
        </Field>
      )}
    />
  );
};

export const QuickStartSection = () => {
  return (
    <div className="bg-card dark:bg-muted border-border/50 space-y-5 rounded-xl border p-5 shadow-sm">
      <ProjectIdentityFields />
      <ProjectDescriptionField />
    </div>
  );
};
