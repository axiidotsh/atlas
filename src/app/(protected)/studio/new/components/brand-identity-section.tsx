'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/utils';
import { ChevronDownIcon, FingerprintIcon } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  AD_STYLE_PRESETS,
  FONT_PRESETS,
  PRIMARY_GOAL_PRESETS,
  VISUAL_GUIDELINE_PRESETS,
  VOICE_TONE_PRESETS,
  type ProjectFormValues,
} from '../../project-form';
import { ChipSelect } from './chip-select';
import { CollapsibleSection } from './collapsible-section';

const CUSTOM_VALUE = '__custom__';

function isCustomGoal(value: string) {
  return (
    value === CUSTOM_VALUE ||
    (value !== '' &&
      !PRIMARY_GOAL_PRESETS.includes(
        value as (typeof PRIMARY_GOAL_PRESETS)[number]
      ))
  );
}

const GOOGLE_FONTS_URL = `https://fonts.googleapis.com/css2?${FONT_PRESETS.map((f) => `family=${f.replace(/ /g, '+')}`).join('&')}&display=swap`;

export const BrandIdentitySection = () => {
  const { control } = useFormContext<ProjectFormValues>();

  return (
    <>
      <link rel="stylesheet" href={GOOGLE_FONTS_URL} precedence="default" />
      <CollapsibleSection
        title="Brand & Creative"
        description="Define your goal, voice, typography, and visual direction"
        icon={FingerprintIcon}
      >
        <Controller
          name="primaryGoal"
          control={control}
          render={({ field }) => {
            const isCustom = isCustomGoal(field.value);
            const displayValue = isCustom
              ? 'Custom'
              : field.value || 'Select a goal';

            return (
              <Field>
                <FieldLabel>Primary Goal</FieldLabel>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'justify-between font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {displayValue}
                      <ChevronDownIcon className="text-muted-foreground size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuRadioGroup
                      value={isCustom ? CUSTOM_VALUE : field.value}
                      onValueChange={(value) => {
                        field.onChange(
                          value === CUSTOM_VALUE ? CUSTOM_VALUE : value
                        );
                      }}
                    >
                      {PRIMARY_GOAL_PRESETS.map((goal) => (
                        <DropdownMenuRadioItem key={goal} value={goal}>
                          {goal}
                        </DropdownMenuRadioItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioItem value={CUSTOM_VALUE}>
                        Custom
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                {isCustom && (
                  <Input
                    autoFocus
                    placeholder="Describe your goal..."
                    value={field.value === CUSTOM_VALUE ? '' : field.value}
                    onChange={(event) =>
                      field.onChange(event.target.value || CUSTOM_VALUE)
                    }
                    className="bg-background dark:bg-input/30 mt-2"
                  />
                )}
              </Field>
            );
          }}
        />
        <Controller
          name="typography"
          control={control}
          render={({ field }) => {
            const selectedFont = FONT_PRESETS.includes(
              field.value as (typeof FONT_PRESETS)[number]
            )
              ? field.value
              : '';
            const displayValue = selectedFont || 'Select a font';

            return (
              <Field>
                <FieldLabel>Typography</FieldLabel>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'justify-between font-normal',
                        !selectedFont && 'text-muted-foreground'
                      )}
                    >
                      <span
                        style={{
                          fontFamily: selectedFont || undefined,
                        }}
                      >
                        {displayValue}
                      </span>
                      <ChevronDownIcon className="text-muted-foreground size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="max-h-60 overflow-y-auto"
                  >
                    <DropdownMenuRadioGroup
                      value={selectedFont}
                      onValueChange={field.onChange}
                    >
                      {FONT_PRESETS.map((font) => (
                        <DropdownMenuRadioItem key={font} value={font}>
                          <span style={{ fontFamily: font }}>{font}</span>
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Field>
            );
          }}
        />
        <Controller
          name="voiceTones"
          control={control}
          render={({ field }) => {
            const hasCustomTone = field.value.includes(CUSTOM_VALUE);

            return (
              <Field>
                <FieldLabel>Voice / Tone</FieldLabel>
                <ChipSelect
                  options={[...VOICE_TONE_PRESETS, 'Custom']}
                  selected={field.value.map((v: string) =>
                    v === CUSTOM_VALUE ? 'Custom' : v
                  )}
                  onChange={(selected) =>
                    field.onChange(
                      selected.map((v) => (v === 'Custom' ? CUSTOM_VALUE : v))
                    )
                  }
                />
                {hasCustomTone && (
                  <Controller
                    name="customVoiceTone"
                    control={control}
                    render={({ field: customField }) => (
                      <Input
                        {...customField}
                        autoFocus
                        placeholder="Describe your tone (e.g., witty, sophisticated)..."
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
    </>
  );
};
