import { buttonVariants } from '@/components/ui/button';
import { MOCK_STUDIO_IMAGES } from '@/mock-data/studio-images';
import { cn } from '@/utils/utils';
import Link from 'next/link';

export default function StudioPage() {
  return (
    <div className="flex flex-col gap-6 py-20">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Your Creations</h1>
        <Link
          href="/studio/all"
          className={cn(
            buttonVariants({
              variant: 'link',
              size: 'xs',
            })
          )}
        >
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {MOCK_STUDIO_IMAGES.map((image) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={image.id}
            src={image.src}
            alt={image.name}
            className="size-full rounded-lg border object-cover shadow"
          />
        ))}
      </div>
    </div>
  );
}
