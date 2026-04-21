'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/utils/utils';
import { ChevronRightIcon, type LucideIcon } from 'lucide-react';
import { useState } from 'react';

interface CollapsibleSectionProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const CollapsibleSection = ({
  title,
  description,
  icon: Icon,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-card dark:bg-muted border-border/50 overflow-hidden rounded-xl border">
        <CollapsibleTrigger className="dark:hover:bg-accent/20 hover:bg-accent/50 flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left transition-colors">
          {Icon && (
            <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
              <Icon className="size-4" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-sm font-medium">{title}</h3>
            {description && (
              <p className="text-muted-foreground text-xs">{description}</p>
            )}
          </div>
          <ChevronRightIcon
            className={cn(
              'text-muted-foreground size-4 shrink-0 transition-transform duration-200',
              isOpen && 'rotate-90'
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
          <div className="space-y-7 border-t px-4 py-5">{children}</div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
