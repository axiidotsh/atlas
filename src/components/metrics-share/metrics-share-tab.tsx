'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBrowserShare } from '@/hooks/use-browser-share';
import { cn } from '@/utils/utils';
import { useState } from 'react';

const METRICS_SHARE_PATH = '/metrics';

interface MetricsShareTabProps {
  align: 'center' | 'end';
}

export const MetricsShareTab = ({ align }: MetricsShareTabProps) => {
  const [isShareGenerated, setIsShareGenerated] = useState(false);
  const { copyText } = useBrowserShare();

  const shareUrl =
    typeof window === 'undefined'
      ? METRICS_SHARE_PATH
      : new URL(METRICS_SHARE_PATH, window.location.origin).toString();

  async function handleShareCopy() {
    if (!isShareGenerated) {
      setIsShareGenerated(true);
    }

    await copyText(shareUrl, {
      successMessage: 'Share link copied to clipboard',
      errorMessage: 'Failed to copy share link',
    });
  }

  return (
    <div className="min-w-0 space-y-3">
      <div className="space-y-3">
        <Input
          readOnly
          value={isShareGenerated ? shareUrl : ''}
          placeholder="Generate a share link to view it here"
        />
        <div
          className={cn(
            'flex',
            align === 'end' ? 'justify-end' : 'justify-center'
          )}
        >
          <Button type="button" onClick={handleShareCopy}>
            {isShareGenerated ? 'Copy share link' : 'Generate share link'}
          </Button>
        </div>
      </div>
    </div>
  );
};
