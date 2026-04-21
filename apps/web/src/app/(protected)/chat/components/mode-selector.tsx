'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAtom } from 'jotai';
import {
  ClipboardListIcon,
  GlobeIcon,
  ImagePlusIcon,
  PaperclipIcon,
  PlusIcon,
  TelescopeIcon,
  XIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Mode, modeAtom, MODES } from '../atoms';

export const ModeSelector = () => {
  const [mode, setMode] = useAtom(modeAtom);
  const [isOpen, setIsOpen] = useState(false);

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
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center gap-1">
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground rounded-full"
          >
            <PlusIcon />
          </Button>
        </DropdownMenuTrigger>
        {mode && (
          <>
            {/* Mobile View */}
            <div className="dark:bg-accent/50 bg-accent/60 flex items-center rounded-full p-1 sm:hidden">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setIsOpen(true)}
                className="rounded-full"
                aria-label={`Open ${formatMode(mode)} mode`}
              >
                {renderModeIcon(mode)}
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => handleModeChange(null)}
                className="rounded-full"
                aria-label={`Clear ${formatMode(mode)} mode`}
              >
                <XIcon className="size-3.5" />
              </Button>
            </div>
            {/* Desktop View */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsOpen(true)}
              className="dark:bg-accent/50! bg-accent/60! hidden rounded-full p-1 pr-3 sm:flex"
            >
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
                  className="bg-accent pointer-events-none absolute inset-0 flex items-center justify-center rounded-full opacity-0 transition-opacity group-hover/button:pointer-events-auto group-hover/button:opacity-100"
                >
                  <XIcon className="size-3.5" />
                </span>
              </div>
              <span className="text-xs">{formatMode(mode)}</span>
            </Button>
          </>
        )}
      </div>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>
          <PaperclipIcon className="size-3.5" />
          Attach files & images
        </DropdownMenuItem>
        <DropdownMenuSeparator />
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
