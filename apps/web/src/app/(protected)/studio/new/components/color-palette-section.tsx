'use client';

import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerHueSlider,
  ColorPickerInput,
  ColorPickerTrigger,
} from '@/components/ui/color-picker';
import { cn } from '@/utils/utils';
import { PaletteIcon } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  COLOR_PALETTE_PRESETS,
  DEFAULT_COLOR_PALETTE,
  type ProjectFormValues,
} from '../../project-form';
import { CollapsibleSection } from './collapsible-section';

const PALETTE_SWATCH_LABELS = [
  'Primary',
  'Secondary',
  'Accent',
  'Surface',
  'Highlight',
] as const;

function arePalettesEqual(left: string[], right: string[]) {
  return (
    left.length === right.length &&
    left.every(
      (color, index) =>
        color.trim().toLowerCase() === right[index]?.trim().toLowerCase()
    )
  );
}

function getPaletteSwatchLabel(index: number) {
  return PALETTE_SWATCH_LABELS[index] ?? `Color ${index + 1}`;
}

export const ColorPaletteSection = () => {
  const { control } = useFormContext<ProjectFormValues>();

  return (
    <CollapsibleSection
      title="Color System"
      description="Choose and refine your brand colors"
      icon={PaletteIcon}
    >
      <Controller
        name="colorPalette"
        control={control}
        render={({ field }) => {
          const currentPalette =
            field.value?.length > 0 ? field.value : DEFAULT_COLOR_PALETTE;

          function handlePresetPalette(colors: string[]) {
            if (arePalettesEqual(currentPalette, colors)) {
              return;
            }

            field.onChange([...colors]);
          }

          function handlePaletteColorChange(index: number, newColor: string) {
            if (currentPalette[index] === newColor) {
              return;
            }

            const nextPalette = currentPalette.map((color, colorIndex) =>
              colorIndex === index ? newColor : color
            );

            field.onChange(nextPalette);
          }

          return (
            <div className="space-y-5">
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Preset Palettes</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {Object.entries(COLOR_PALETTE_PRESETS).map(
                    ([name, colors]) => {
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => handlePresetPalette(colors)}
                          className={cn(
                            'bg-background dark:bg-input/30 hover:bg-muted dark:hover:bg-input/50 flex cursor-pointer flex-col gap-3 rounded-xl border px-3 pt-3 pb-5 text-left transition-colors'
                          )}
                        >
                          <span className="text-sm font-medium">{name}</span>
                          <div className="flex gap-1.5">
                            {colors.slice(0, 5).map((color) => (
                              <div
                                key={color}
                                className="h-8 flex-1 rounded-lg border border-black/5 first:rounded-l-xl last:rounded-r-xl"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.95fr)]">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Customize Colors</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {currentPalette.map((color, index) => (
                      <ColorPicker
                        key={index}
                        value={color}
                        onValueChange={(newColor) =>
                          handlePaletteColorChange(index, newColor)
                        }
                      >
                        <ColorPickerTrigger asChild>
                          <button
                            type="button"
                            aria-label={`Edit ${getPaletteSwatchLabel(index)} color`}
                            className="bg-background dark:bg-input/30 hover:bg-muted dark:hover:bg-input/50 flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors"
                          >
                            <span
                              className="size-10 shrink-0 rounded-xl border border-black/5 shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-medium">
                                {getPaletteSwatchLabel(index)}
                              </span>
                              <span className="text-muted-foreground block text-xs tracking-[0.14em] uppercase">
                                {color}
                              </span>
                            </span>
                            <span className="text-muted-foreground text-xs">
                              Edit
                            </span>
                          </button>
                        </ColorPickerTrigger>
                        <ColorPickerContent className="w-80">
                          <div className="space-y-3">
                            <ColorPickerArea />
                            <ColorPickerHueSlider />
                            <div className="flex items-center gap-2">
                              <ColorPickerEyeDropper />
                              <ColorPickerInput />
                            </div>
                          </div>
                        </ColorPickerContent>
                      </ColorPicker>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Live Preview</p>
                  </div>
                  <div className="bg-muted/40 border-border/70 rounded-2xl border p-3">
                    <div className="border-border/70 bg-background/50 space-y-4 rounded-xl border p-4 shadow-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="size-3 rounded-full"
                          style={{ backgroundColor: currentPalette[0] }}
                        />
                        <div
                          className="h-2.5 w-20 rounded-full"
                          style={{ backgroundColor: currentPalette[4] }}
                        />
                      </div>
                      <div
                        className="h-28 rounded-2xl"
                        style={{
                          background: `linear-gradient(135deg, ${currentPalette[0]} 0%, ${currentPalette[2]} 55%, ${currentPalette[3]} 100%)`,
                        }}
                      />
                      <div className="space-y-2">
                        <div
                          className="h-3 w-2/3 rounded-full"
                          style={{ backgroundColor: currentPalette[0] }}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {currentPalette.map((color, index) => (
                          <span
                            key={`${color}-${index}`}
                            className="h-8 w-16 rounded-full border border-black/5"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      />
    </CollapsibleSection>
  );
};
