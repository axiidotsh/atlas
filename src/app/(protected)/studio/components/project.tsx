import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/utils';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { getAspectRatio } from '../utils';
import { AspectRatioBadge } from './aspect-ratio-badge';
import { StudioComposer } from './studio-composer';

interface ProjectProps {
  id: string;
  title: string;
  coverImage: string;
  images: {
    id: string;
    title: string;
    src: string;
  }[];
}

export const Project = ({ title, coverImage }: ProjectProps) => {
  const aspectRatio = getAspectRatio('1:1');

  return (
    <div className="flex flex-1 flex-col gap-8 pt-6 sm:pt-10 2xl:pt-20">
      <div className="flex-1 space-y-10">
        <div className="flex items-center gap-2">
          <Link
            href="/studio"
            className={cn(
              buttonVariants({
                size: 'icon',
                variant: 'secondary',
                className: 'rounded-full',
              })
            )}
          >
            <ArrowLeftIcon />
          </Link>
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        <div className="flex flex-col gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImage}
            alt={title}
            width={1600}
            height={1000}
            className="h-auto w-full rounded-xl"
          />
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm">{title}</span>
            <AspectRatioBadge
              icon={aspectRatio.icon}
              label={aspectRatio.label}
            />
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 flex justify-center">
        <StudioComposer placeholder="Describe what you want to create" />
      </div>
    </div>
  );
};
