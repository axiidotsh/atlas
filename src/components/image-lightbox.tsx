'use client';

import { type KeyboardEvent, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/utils/utils';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
  RotateCcwIcon,
  XIcon,
} from 'lucide-react';

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;

export interface LightboxImage {
  id: string;
  src: string;
  title: string;
  aspectRatio?: string;
}

interface ImageLightboxProps {
  images: LightboxImage[];
  index: number;
  open: boolean;
  onIndexChange: (index: number) => void;
  onOpenChange: (open: boolean) => void;
}

function getLightboxImageDimensions(aspectRatio?: string) {
  const [rawWidth, rawHeight] = aspectRatio?.split(':') ?? [];
  const width = Number(rawWidth);
  const height = Number(rawHeight);

  if (!width || !height) {
    return {
      width: 1600,
      height: 1600,
    };
  }

  return {
    width: width * 400,
    height: height * 400,
  };
}

export const ImageLightbox = ({
  images,
  index,
  open,
  onIndexChange,
  onOpenChange,
}: ImageLightboxProps) => {
  const [zoom, setZoom] = useState(MIN_ZOOM);

  const safeIndex =
    images.length === 0 ? 0 : Math.min(Math.max(index, 0), images.length - 1);
  const activeImage = images[safeIndex];

  if (!activeImage) {
    return null;
  }

  const dimensions = getLightboxImageDimensions(activeImage.aspectRatio);

  const isBelowMaxZoom = zoom < MAX_ZOOM;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setZoom(MIN_ZOOM);
    }

    onOpenChange(nextOpen);
  };

  const handleZoomIn = () => {
    setZoom((currentZoom) => Math.min(currentZoom + ZOOM_STEP, MAX_ZOOM));
  };

  const handleZoomOut = () => {
    setZoom((currentZoom) => Math.max(currentZoom - ZOOM_STEP, MIN_ZOOM));
  };

  const handleResetZoom = () => {
    setZoom(MIN_ZOOM);
  };

  const handlePrevious = () => {
    if (images.length <= 1) {
      return;
    }

    onIndexChange((safeIndex - 1 + images.length) % images.length);
    setZoom(MIN_ZOOM);
  };

  const handleNext = () => {
    if (images.length <= 1) {
      return;
    }

    onIndexChange((safeIndex + 1) % images.length);
    setZoom(MIN_ZOOM);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      handlePrevious();
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      handleNext();
      return;
    }

    if (event.key === '+' || event.key === '=') {
      event.preventDefault();
      handleZoomIn();
      return;
    }

    if (event.key === '-') {
      event.preventDefault();
      handleZoomOut();
      return;
    }

    if (event.key === '0') {
      event.preventDefault();
      handleResetZoom();
    }
  };

  const handleImageClick = () => {
    if (isBelowMaxZoom) {
      handleZoomIn();
    } else {
      handleResetZoom();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="dark:bg-muted grid h-[min(100vh-2rem,56rem)] max-w-[calc(100vw-2rem)] grid-rows-[auto_1fr] gap-0 overflow-hidden p-0 sm:max-w-[min(90rem,calc(100vw-2rem))]"
        onKeyDownCapture={handleKeyDown}
      >
        <DialogTitle className="sr-only">{activeImage.title}</DialogTitle>
        <DialogDescription className="sr-only">
          Image lightbox with keyboard navigation and zoom controls.
        </DialogDescription>
        <div className="border-border/70 flex items-center justify-between gap-4 border-b px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{activeImage.title}</p>
            <p className="text-muted-foreground text-xs">
              {safeIndex + 1} of {images.length}
              {activeImage.aspectRatio ? ` • ${activeImage.aspectRatio}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-muted/70 border-border/70 flex items-center gap-1 rounded-full border p-1 sm:gap-2">
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                className="hover:bg-muted rounded-full"
                onClick={handleZoomOut}
                disabled={zoom <= MIN_ZOOM}
                aria-label="Zoom out"
              >
                <MinusIcon />
              </Button>
              <Button
                type="button"
                size="xs"
                variant="ghost"
                className="hover:bg-muted min-w-14 sm:min-w-16"
                onClick={handleResetZoom}
              >
                {Math.round(zoom * 100)}%
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                className="hover:bg-muted rounded-full"
                onClick={handleZoomIn}
                disabled={zoom >= MAX_ZOOM}
                aria-label="Zoom in"
              >
                <PlusIcon />
              </Button>
            </div>
            <Button
              size="icon-sm"
              variant="ghost"
              className="hover:bg-muted"
              onClick={handleResetZoom}
              aria-label="Reset zoom"
            >
              <RotateCcwIcon />
            </Button>
            <DialogClose asChild>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                className="hover:bg-muted"
                aria-label="Close lightbox"
              >
                <XIcon />
              </Button>
            </DialogClose>
          </div>
        </div>
        <div className="relative min-h-0 overflow-hidden px-4 py-4">
          <div className="size-full overflow-auto overscroll-contain">
            <div className="flex min-h-full min-w-full items-center justify-center p-2 sm:p-4">
              <img
                key={activeImage.id}
                src={activeImage.src}
                alt={activeImage.title}
                width={dimensions.width}
                height={dimensions.height}
                loading="eager"
                decoding="async"
                className={cn(
                  'shrink-0 object-contain transition-[width] duration-200 ease-out',
                  isBelowMaxZoom ? 'cursor-zoom-in' : 'cursor-zoom-out'
                )}
                style={{
                  width: `${dimensions.width * zoom}px`,
                  height: 'auto',
                  maxWidth: zoom === MIN_ZOOM ? '100%' : 'none',
                  maxHeight: zoom === MIN_ZOOM ? '100%' : 'none',
                }}
                onClick={handleImageClick}
              />
            </div>
          </div>
          {images.length > 1 ? (
            <>
              <button
                className="bg-card absolute top-1/2 left-6 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border shadow"
                onClick={handlePrevious}
                aria-label="Previous image"
              >
                <ChevronLeftIcon className="size-4.5" />
              </button>
              <button
                className="bg-card absolute top-1/2 right-6 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border shadow"
                onClick={handleNext}
                aria-label="Next image"
              >
                <ChevronRightIcon className="size-4.5" />
              </button>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};
