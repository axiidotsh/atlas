'use client';

import { toast } from 'sonner';

interface CopyTextOptions {
  errorMessage?: string;
  successMessage?: string;
}

interface ShareOptions {
  errorMessage?: string;
  fallbackSuccessMessage?: string;
  text?: string;
  title?: string;
  url: string;
}

function canUseNativeShare(shareData: ShareData) {
  if (typeof navigator.share !== 'function') {
    return false;
  }

  if (typeof navigator.canShare !== 'function') {
    return true;
  }

  return navigator.canShare(shareData);
}

async function writeToClipboard(value: string) {
  if (window.isSecureContext && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement('textarea');

  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';

  document.body.append(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, value.length);

  const isCopied = document.execCommand('copy');

  textarea.remove();

  if (!isCopied) {
    throw new Error('Copy command failed');
  }
}

export function useBrowserShare() {
  async function copyText(value: string, options: CopyTextOptions = {}) {
    try {
      await writeToClipboard(value);

      if (options.successMessage) {
        toast.success(options.successMessage);
      }

      return true;
    } catch (error) {
      console.error(error);
      toast.error(options.errorMessage ?? 'Failed to copy to clipboard');
      return false;
    }
  }

  async function share(options: ShareOptions) {
    const shareData: ShareData = {
      title: options.title,
      text: options.text,
      url: options.url,
    };

    try {
      if (canUseNativeShare(shareData)) {
        await navigator.share(shareData);
        return true;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return false;
      }
    }

    return copyText(options.url, {
      successMessage:
        options.fallbackSuccessMessage ?? 'Link copied to clipboard',
      errorMessage: options.errorMessage ?? 'Failed to share',
    });
  }

  return {
    copyText,
    share,
  };
}
