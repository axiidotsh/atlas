'use client';

import { ImageLightbox } from '@/components/image-lightbox';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import type {
  MockStudioConversation,
  MockStudioImage,
  MockStudioImageSet,
} from '@/mock-data/types';
import { cn } from '@/utils/utils';
import {
  ChevronRightIcon,
  DownloadIcon,
  Link2Icon,
  PencilIcon,
} from 'lucide-react';
import { useState } from 'react';

interface StudioProjectWorkspaceProps {
  project: MockStudioConversation;
}

interface StudioImageCardProps {
  image: MockStudioImage;
  onOpen: () => void;
}

function getImageExtension(imageSrc: string) {
  try {
    const imageUrl = new URL(imageSrc);
    const extensionMatch = imageUrl.pathname.match(/\.([a-z0-9]+)$/i);
    const extension = extensionMatch?.[1]?.toLowerCase();

    if (!extension) {
      return 'jpg';
    }

    return extension === 'jpeg' ? 'jpg' : extension;
  } catch {
    return 'jpg';
  }
}

function getDownloadFileName(image: MockStudioImage) {
  const sanitizedTitle = image.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `${sanitizedTitle || 'studio-image'}.${getImageExtension(image.src)}`;
}

async function downloadImage(image: MockStudioImage) {
  const response = await fetch(image.src);

  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`);
  }

  const imageBlob = await response.blob();
  const objectUrl = URL.createObjectURL(imageBlob);
  const downloadLink = document.createElement('a');

  downloadLink.href = objectUrl;
  downloadLink.download = getDownloadFileName(image);
  document.body.append(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  URL.revokeObjectURL(objectUrl);
}

const StudioImageCard = ({ image, onOpen }: StudioImageCardProps) => {
  return (
    <article className="group/image bg-card relative overflow-hidden rounded-2xl border shadow-sm">
      <div className="relative aspect-square overflow-hidden">
        <button
          type="button"
          className="absolute inset-0 z-10 cursor-pointer"
          onClick={onOpen}
          aria-label={`Open ${image.title}`}
        />
        <img
          src={image.src}
          alt={image.title}
          className="absolute inset-0 size-full object-cover transition duration-300 group-focus-within/image:scale-[1.02] group-hover/image:scale-[1.02]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent opacity-0 transition group-focus-within/image:opacity-100 group-hover/image:opacity-100" />
        <div className="absolute right-3 bottom-3 z-20 flex items-center gap-1 opacity-0 transition group-focus-within/image:opacity-100 group-hover/image:opacity-100">
          <Button
            type="button"
            size="icon-sm"
            variant="secondary"
            tooltip="Download image"
            className="bg-background/90 hover:bg-background"
            aria-label={`Download ${image.title}`}
            onClick={() => {
              void downloadImage(image).catch((error: unknown) => {
                console.error(error);
              });
            }}
          >
            <DownloadIcon />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="secondary"
            tooltip="Edit image"
            className="bg-background/90 hover:bg-background"
            aria-label={`Edit ${image.title}`}
          >
            <PencilIcon />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="secondary"
            tooltip="Attach as reference"
            className="bg-background/90 hover:bg-background"
            aria-label={`Attach ${image.title} as reference`}
          >
            <Link2Icon />
          </Button>
        </div>
      </div>
    </article>
  );
};

interface ImageSetSectionProps {
  imageSet: MockStudioImageSet;
  index: number;
  isLast: boolean;
}

const ImageSetSection = ({ imageSet, index, isLast }: ImageSetSectionProps) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  return (
    <section className="space-y-6">
      <Collapsible>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground text-sm font-medium">
              {imageSet.createdAtLabel ?? `Set ${index + 1}`}
            </p>
            <CollapsibleTrigger className="text-muted-foreground/60 hover:text-muted-foreground group/prompt flex cursor-pointer items-center gap-0.5 text-xs transition">
              <ChevronRightIcon className="size-3 transition group-data-[state=open]/prompt:rotate-90" />
              <span>Prompt</span>
            </CollapsibleTrigger>
          </div>
          <p className="text-muted-foreground text-xs">
            {imageSet.images.length} image
            {imageSet.images.length === 1 ? '' : 's'}
          </p>
        </div>
        <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
          <p className="text-muted-foreground/80 mt-2 max-w-2xl text-sm">
            {imageSet.prompt}
          </p>
        </CollapsibleContent>
      </Collapsible>
      <div className={cn('grid gap-3', 'sm:grid-cols-2', 'xl:grid-cols-4')}>
        {imageSet.images.map((image, imageIndex) => (
          <StudioImageCard
            key={image.id}
            image={image}
            onOpen={() => setActiveImageIndex(imageIndex)}
          />
        ))}
      </div>
      <ImageLightbox
        images={imageSet.images}
        index={activeImageIndex ?? 0}
        open={activeImageIndex !== null}
        onIndexChange={setActiveImageIndex}
        onOpenChange={(open) => {
          if (!open) {
            setActiveImageIndex(null);
          }
        }}
      />
      {!isLast ? (
        <div className="border-border/70 pt-6">
          <div className="border-t" />
        </div>
      ) : null}
    </section>
  );
};

export const StudioProjectWorkspace = ({
  project,
}: StudioProjectWorkspaceProps) => {
  return (
    <div className="flex-1 space-y-10 py-6 sm:py-8">
      {project.imageSets.map((imageSet, index) => (
        <ImageSetSection
          key={imageSet.id}
          imageSet={imageSet}
          index={index}
          isLast={index === project.imageSets.length - 1}
        />
      ))}
    </div>
  );
};
