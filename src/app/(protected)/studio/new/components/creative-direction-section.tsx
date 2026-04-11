'use client';

import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ClapperboardIcon } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  AD_STYLE_PRESETS,
  VISUAL_GUIDELINE_PRESETS,
  type ProjectFormValues,
} from '../schema';
import { ChipSelect } from './chip-select';
import { CollapsibleSection } from './collapsible-section';

const CUSTOM_VALUE = '__custom__';

export const CreativeDirectionSection = () => {
  const { control } = useFormContext<ProjectFormValues>();

  return (
    <CollapsibleSection
      title="Creative Direction"
      description="Set your default ad styles and visual guidelines"
      icon={ClapperboardIcon}
    >
      <Controller
        name="adStyles"
        control={control}
        render={({ field }) => {
          const hasCustom = field.value.includes(CUSTOM_VALUE);

          return (
            <Field>
              <FieldLabel>Ad Styles</FieldLabel>
              <ChipSelect
                options={[...AD_STYLE_PRESETS, 'Custom']}
                selected={field.value.map((v: string) =>
                  v === CUSTOM_VALUE ? 'Custom' : v
                )}
                onChange={(selected) =>
                  field.onChange(
                    selected.map((v) => (v === 'Custom' ? CUSTOM_VALUE : v))
                  )
                }
              />
              {hasCustom && (
                <Controller
                  name="customAdStyle"
                  control={control}
                  render={({ field: customField }) => (
                    <Input
                      {...customField}
                      autoFocus
                      placeholder="Describe your ad style (e.g., retro, hand-drawn)..."
                      className="mt-2"
                    />
                  )}
                />
              )}
            </Field>
          );
        }}
      />

      <Controller
        name="visualGuidelines"
        control={control}
        render={({ field }) => {
          const hasCustom = field.value.includes(CUSTOM_VALUE);

          return (
            <Field>
              <FieldLabel>Visual Guidelines</FieldLabel>
              <ChipSelect
                options={[...VISUAL_GUIDELINE_PRESETS, 'Custom']}
                selected={field.value.map((v: string) =>
                  v === CUSTOM_VALUE ? 'Custom' : v
                )}
                onChange={(selected) =>
                  field.onChange(
                    selected.map((v) => (v === 'Custom' ? CUSTOM_VALUE : v))
                  )
                }
              />
              {hasCustom && (
                <Controller
                  name="customVisualGuideline"
                  control={control}
                  render={({ field: customField }) => (
                    <Input
                      {...customField}
                      autoFocus
                      placeholder="Describe your visual guideline (e.g., neon accents, duotone)..."
                      className="mt-2"
                    />
                  )}
                />
              )}
            </Field>
          );
        }}
      />
    </CollapsibleSection>
  );
};
