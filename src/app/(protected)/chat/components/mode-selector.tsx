'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/utils/utils';
import { useAtom } from 'jotai';
import {
  ClipboardListIcon,
  GlobeIcon,
  ImagePlusIcon,
  PlusIcon,
  TelescopeIcon,
  XIcon,
} from 'lucide-react';
import { Mode, modeAtom, MODES } from '../atoms';

export const ModeSelector = () => {
  const [mode, setMode] = useAtom(modeAtom);

  function handleModeChange(value: Mode) {
    setMode(value);
  }

  function renderModeIcon(value: Exclude<Mode, null>) {
    if (value === 'create-image') return <ImagePlusIcon className="size-3.5" />;
    if (value === 'create-report') {
      return <ClipboardListIcon className="size-3.5" />;
    }
    if (value === 'competitor-research') {
      return <TelescopeIcon className="size-3.5" />;
    }

    return <GlobeIcon className="size-3.5" />;
  }

  function formatMode(value: Mode) {
    if (!value) return '';

    return value
      .split('-')
      .map((item) => item[0].toUpperCase() + item.substring(1))
      .join(' ');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={mode ? 'sm' : 'icon-sm'}
          className={cn(
            'text-muted-foreground rounded-full',
            mode && 'bg-muted flex items-center gap-1 rounded-full p-1 pr-3'
          )}
        >
          {mode ? (
            <>
              <div className="relative flex size-5 items-center justify-center">
                <span className="transition-opacity group-hover/button:opacity-0">
                  {renderModeIcon(mode)}
                </span>
                <span
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleModeChange(null);
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="bg-border pointer-events-none absolute inset-0 flex items-center justify-center rounded-full opacity-0 transition-opacity group-hover/button:pointer-events-auto group-hover/button:opacity-100"
                >
                  <XIcon className="size-3.5" />
                </span>
              </div>
              <span className="text-xs">{formatMode(mode)}</span>
            </>
          ) : (
            <PlusIcon />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full">
        {MODES.map((mode) => (
          <DropdownMenuItem key={mode} onSelect={() => handleModeChange(mode)}>
            {renderModeIcon(mode)}
            {formatMode(mode)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
