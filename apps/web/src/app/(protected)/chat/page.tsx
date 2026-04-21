'use client';

import { useSetAtom } from 'jotai';
import { useState } from 'react';

import { queryAtom } from '@/app/(protected)/chat/atoms';
import {
  DEFAULT_PRESET_ID,
  PRESET_GROUPS,
} from '@/app/(protected)/chat/presets';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/utils/utils';

export default function ChatPage() {
  const setQuery = useSetAtom(queryAtom);
  const [selectedPresetId, setSelectedPresetId] =
    useState<string>(DEFAULT_PRESET_ID);

  const activePreset =
    PRESET_GROUPS.find((preset) => preset.id === selectedPresetId) ??
    PRESET_GROUPS[0];

  return (
    <div className="flex h-full w-full items-center justify-center py-10">
      <div className="flex w-full max-w-2xl flex-col gap-8">
        <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          What should we work on today?
        </h1>
        <div className="flex flex-wrap gap-3">
          {PRESET_GROUPS.map((preset) => {
            const isActive = preset.id === activePreset.id;

            return (
              <Button
                key={preset.id}
                type="button"
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPresetId(preset.id)}
                className={cn(
                  'rounded-full px-4',
                  !isActive && 'text-muted-foreground'
                )}
              >
                {preset.heading}
              </Button>
            );
          })}
        </div>
        <div>
          {activePreset.prompts.map((prompt, index) => (
            <div key={prompt}>
              <button
                type="button"
                onClick={() => setQuery(prompt)}
                className="hover:bg-muted/60 focus-visible:ring-ring/50 flex w-full cursor-pointer items-start px-2 py-4 text-left transition-colors outline-none focus-visible:ring-3"
              >
                <span className="text-sm leading-6">{prompt}</span>
              </button>
              {index < activePreset.prompts.length - 1 ? <Separator /> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
