import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/utils';
import Link from 'next/link';

const IMAGES = [
  'https://plus.unsplash.com/premium_photo-1677159451012-6722af343f1c?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1770026430828-c389a6ccfad7?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1771212952256-31a72d974757?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1773318427480-1058e1059f99?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1773979407769-363772f1e5fa?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1773929483999-52ac8e6af2cc?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1774331510646-a1781c4a9713?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1774429078795-0c3fe5ddba8f?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

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
        {IMAGES.map((image) => (
          <img
            key={image}
            src={image}
            alt=""
            className="size-full rounded-lg border object-cover shadow"
          />
        ))}
      </div>
    </div>
  );
}
