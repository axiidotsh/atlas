'use client';

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SparklesIcon } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';
import type { ProjectFormValues } from '../schema';
import { ImageUpload } from './image-upload';

export const QuickStartSection = () => {
  const { control } = useFormContext<ProjectFormValues>();

  return (
    <div className="bg-card dark:bg-muted border-border/50 space-y-5 rounded-xl border p-5 shadow-sm">
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
        name="prompt"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel className="flex items-center gap-1.5">
              <SparklesIcon className="text-primary size-3.5" />
              Describe Your Brand or Creative Project
            </FieldLabel>
            <Textarea
              {...field}
              placeholder="A luxury skincare brand creating a spring launch creative project with paid social ads, retargeting variations, and minimalist lifestyle visuals..."
              className="min-h-32 resize-none"
            />
            <FieldDescription>
              We&apos;ll auto-populate the project details based on your
              description. You can fine-tune the ads and audience settings
              below.
            </FieldDescription>
          </Field>
        )}
      />
      <Controller
        name="referenceImages"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel>Reference Images</FieldLabel>
            <ImageUpload
              images={field.value}
              onChange={field.onChange}
              label="Drop reference images here or click to upload"
            />
          </Field>
        )}
      />
    </div>
  );
};
