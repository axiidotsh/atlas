'use client';

import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/utils/utils';

export const PasswordInput = ({
  className,
  ...props
}: Omit<React.ComponentProps<'input'>, 'type'>) => {
  const [isVisible, setIsVisible] = useState(false);
  const Icon = isVisible ? EyeOffIcon : EyeIcon;

  return (
    <div className="relative">
      <Input
        type={isVisible ? 'text' : 'password'}
        className={cn('pr-9', className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setIsVisible((v) => !v)}
        aria-label={isVisible ? 'Hide password' : 'Show password'}
        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 flex cursor-pointer items-center rounded-md px-2.5 transition-colors outline-none focus-visible:ring-3"
      >
        <Icon className="size-4" />
      </button>
    </div>
  );
};
