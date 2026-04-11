'use client';

import { Field, FieldLabel } from '@/components/ui/field';
import { Slider } from '@/components/ui/slider';
import { TargetIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { GENDER_OPTIONS, type ProjectFormValues } from '../schema';
import { ChipSelect } from './chip-select';
import { CollapsibleSection } from './collapsible-section';
import { TagInput } from './tag-input';

interface AgeRangePreset {
  label: string;
  range: [number, number];
}

const CUSTOM_AGE_RANGE_LABEL = 'Custom';

const AGE_RANGE_PRESETS: AgeRangePreset[] = [
  { label: 'All', range: [13, 65] },
  { label: 'Teens', range: [13, 17] },
  { label: 'Young Adults', range: [18, 24] },
  { label: 'Adults', range: [18, 65] },
  { label: 'Mature Adults', range: [45, 65] },
];

function getAgeRangePresetLabel(ageRange: [number, number]) {
  return (
    AGE_RANGE_PRESETS.find(
      (preset) =>
        preset.range[0] === ageRange[0] && preset.range[1] === ageRange[1]
    )?.label ?? null
  );
}

export const AudienceSettingsSection = () => {
  const { control } = useFormContext<ProjectFormValues>();
  const [isCustomAgeRange, setIsCustomAgeRange] = useState(false);

  return (
    <CollapsibleSection
      title="Audience Settings"
      description="Define the audience for the ads and variations in this project"
      icon={TargetIcon}
    >
      <Controller
        name="ageRange"
        control={control}
        render={({ field }) => {
          const presetLabel = getAgeRangePresetLabel(field.value);
          const selectedAgeRange =
            isCustomAgeRange || !presetLabel
              ? CUSTOM_AGE_RANGE_LABEL
              : presetLabel;

          return (
            <Field>
              <FieldLabel>
                Age Range: {field.value[0]} - {field.value[1]}
              </FieldLabel>
              <ChipSelect
                options={[
                  ...AGE_RANGE_PRESETS.map((preset) => preset.label),
                  CUSTOM_AGE_RANGE_LABEL,
                ]}
                selected={[selectedAgeRange]}
                onChange={(selected) => {
                  const nextSelection = selected[0];

                  if (!nextSelection) {
                    return;
                  }

                  if (nextSelection === CUSTOM_AGE_RANGE_LABEL) {
                    setIsCustomAgeRange(true);
                    return;
                  }

                  const preset = AGE_RANGE_PRESETS.find(
                    (option) => option.label === nextSelection
                  );

                  if (!preset) {
                    return;
                  }

                  setIsCustomAgeRange(false);
                  field.onChange(preset.range);
                }}
                multiple={false}
              />
              {selectedAgeRange === CUSTOM_AGE_RANGE_LABEL && (
                <div className="mt-3 space-y-2">
                  <Slider
                    min={13}
                    max={65}
                    step={1}
                    value={field.value}
                    onValueChange={(value) =>
                      field.onChange(value as [number, number])
                    }
                  />
                </div>
              )}
            </Field>
          );
        }}
      />

      <Controller
        name="gender"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel>Gender</FieldLabel>
            <ChipSelect
              options={GENDER_OPTIONS}
              selected={field.value ? [field.value] : []}
              onChange={(selected) => field.onChange(selected[0] ?? 'All')}
              multiple={false}
            />
          </Field>
        )}
      />

      <Controller
        name="interests"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel>Interests / Keywords</FieldLabel>
            <TagInput
              tags={field.value}
              onChange={field.onChange}
              placeholder="Type and press Enter..."
            />
          </Field>
        )}
      />

      <Controller
        name="geography"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel>Geography</FieldLabel>
            <TagInput
              tags={field.value}
              onChange={field.onChange}
              placeholder="e.g., United States, Europe..."
            />
          </Field>
        )}
      />
    </CollapsibleSection>
  );
};
