'use client';

import { cn } from '@/utils/utils';
import { SearchIcon } from 'lucide-react';
import { Input } from './ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  variant?: 'default' | 'ghost';
  size?: 'md' | 'sm';
  containerClassName?: string;
  inputClassName?: string;
  autoFocus?: boolean;
  shouldStopKeyDownPropagation?: boolean;
}

export const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search...',
  variant = 'default',
  size = 'md',
  containerClassName,
  inputClassName,
  autoFocus = false,
  shouldStopKeyDownPropagation = false,
}: SearchBarProps) => {
  return (
    <div
      className={cn(
        'flex w-full items-center pl-3',
        variant === 'ghost'
          ? 'border-b'
          : 'bg-muted focus-within:ring-ring rounded-lg border transition-shadow focus-within:ring-2',
        size === 'sm' && 'h-8 pl-2',
        containerClassName
      )}
    >
      <SearchIcon className="text-muted-foreground size-4" />
      <Input
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (shouldStopKeyDownPropagation && e.key !== 'Escape') {
            e.stopPropagation();
          }
        }}
        className={cn(
          'rounded-none border-0 bg-transparent! shadow-none ring-0!',
          size === 'sm' && 'pl-1.5',
          inputClassName
        )}
        placeholder={placeholder}
      />
    </div>
  );
};
