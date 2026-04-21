'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBrowserShare } from '@/hooks/use-browser-share';
import { cn } from '@/utils/utils';
import { useState } from 'react';

interface ShareLinkTabProps {
  align: 'center' | 'end';
  copyButtonLabel?: string;
  errorMessage: string;
  generateButtonLabel?: string;
  placeholder?: string;
  sharePath: string;
  successMessage: string;
}

export const ShareLinkTab = ({
  align,
  copyButtonLabel = 'Copy share link',
  errorMessage,
  generateButtonLabel = 'Generate share link',
  placeholder = 'Generate a share link to view it here',
  sharePath,
  successMessage,
}: ShareLinkTabProps) => {
  const [isShareGenerated, setIsShareGenerated] = useState(false);
  const { copyText } = useBrowserShare();

  const shareUrl =
    typeof window === 'undefined'
      ? sharePath
      : new URL(sharePath, window.location.origin).toString();

  async function handleShareCopy() {
    if (!isShareGenerated) {
      setIsShareGenerated(true);
    }

    await copyText(shareUrl, {
      successMessage,
      errorMessage,
    });
  }

  return (
    <div className="min-w-0 space-y-3">
      <Input
        readOnly
        value={isShareGenerated ? shareUrl : ''}
        placeholder={placeholder}
      />
      <div
        className={cn(
          'flex',
          align === 'end' ? 'justify-end' : 'justify-center'
        )}
      >
        <Button type="button" onClick={handleShareCopy}>
          {isShareGenerated ? copyButtonLabel : generateButtonLabel}
        </Button>
      </div>
    </div>
  );
};
