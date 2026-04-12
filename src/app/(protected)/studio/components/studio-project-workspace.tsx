'use client';

import { Button } from '@/components/ui/button';
import type {
  MockStudioConversation,
  MockStudioImage,
} from '@/mock-data/types';
import { cn } from '@/utils/utils';
import { DownloadIcon, Link2Icon, PencilIcon } from 'lucide-react';
import Image from 'next/image';

interface StudioProjectWorkspaceProps {
  project: MockStudioConversation;
}

interface StudioImageCardProps {
  image: MockStudioImage;
}

const StudioImageCard = ({ image }: StudioImageCardProps) => {
  return (
    <article className="group/image bg-card relative overflow-hidden rounded-2xl border shadow-sm">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={image.src}
          alt={image.title}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition duration-300 group-focus-within/image:scale-[1.02] group-hover/image:scale-[1.02]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent opacity-0 transition group-focus-within/image:opacity-100 group-hover/image:opacity-100" />
        <div className="absolute right-3 bottom-3 flex items-center gap-1 opacity-0 transition group-focus-within/image:opacity-100 group-hover/image:opacity-100">
          <Button
            asChild
            size="icon-sm"
            variant="secondary"
            tooltip="Download image"
            className="bg-background/90 hover:bg-background"
          >
            <a
              href={image.src}
              download
              target="_blank"
              rel="noreferrer"
              aria-label={`Download ${image.title}`}
            >
              <DownloadIcon />
            </a>
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

export const StudioProjectWorkspace = ({
  project,
}: StudioProjectWorkspaceProps) => {
  return (
    <div className="flex-1 space-y-10 py-6 sm:py-8">
      {project.imageSets.map((imageSet, index) => (
        <section key={imageSet.id} className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase">
              {imageSet.createdAtLabel ?? `Set ${index + 1}`}
            </p>
            <p className="text-muted-foreground text-xs">
              {imageSet.images.length} image
              {imageSet.images.length === 1 ? '' : 's'}
            </p>
          </div>
          <div className={cn('grid gap-3', 'sm:grid-cols-2', 'xl:grid-cols-4')}>
            {imageSet.images.map((image) => (
              <StudioImageCard key={image.id} image={image} />
            ))}
          </div>
          {index < project.imageSets.length - 1 ? (
            <div className="border-border/70 pt-6">
              <div className="border-t" />
            </div>
          ) : null}
        </section>
      ))}
    </div>
  );
};
