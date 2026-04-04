'use client';

import { Button } from '@/components/ui/button';
import { ArrowDownIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useStickToBottomContext } from 'use-stick-to-bottom';

export const ScrollToBottom = () => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();
  const { theme } = useTheme();

  return (
    !isAtBottom && (
      <div className="absolute inset-x-auto bottom-40 flex w-full justify-center">
        <Button
          variant="secondary"
          size="icon-sm"
          className="rounded-full"
          onClick={() =>
            scrollToBottom({
              animation: 'instant',
            })
          }
        >
          <ArrowDownIcon />
        </Button>
      </div>
    )
  );
};
