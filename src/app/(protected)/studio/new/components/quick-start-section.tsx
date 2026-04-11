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
    <div className="bg-muted border-border/50 space-y-5 rounded-xl border p-5 shadow-sm">
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel>Project Name</FieldLabel>
            <Input
              {...field}
              placeholder="My Campaign"
              aria-invalid={fieldState.invalid}
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
              Describe Your Brand or Campaign
            </FieldLabel>
            <Textarea
              {...field}
              placeholder="A luxury skincare brand targeting women 25-45. Minimalist aesthetic with gold accents, clean typography, and lifestyle photography..."
              className="border-primary/20 bg-primary/[0.02] focus-visible:border-primary/40 focus-visible:ring-primary/20 min-h-32 resize-none text-base"
            />
            <FieldDescription>
              We&apos;ll auto-populate the rest based on your description. You
              can fine-tune in the sections below.
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
