'use client';

import { Button } from '@/components/ui/button';
import { ArrowDownIcon } from 'lucide-react';
import { useStickToBottomContext } from 'use-stick-to-bottom';

export const ScrollToBottom = () => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

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
