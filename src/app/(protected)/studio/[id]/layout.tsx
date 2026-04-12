'use client';

import { StudioComposer } from '@/app/(protected)/studio/components/studio-composer';
import { getStudioProject } from '@/app/(protected)/studio/utils';
import { useParams } from 'next/navigation';

interface StudioProjectLayoutProps {
  children: React.ReactNode;
}

export default function StudioProjectLayout({
  children,
}: StudioProjectLayoutProps) {
  const params = useParams<{ id: string }>();
  const project = getStudioProject(params.id);

  if (!project) {
    return (
      <div className="flex flex-1 items-center justify-center py-12">
        <p className="text-muted-foreground text-sm">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-3xl flex-1 flex-col">
      <div className="flex-1">{children}</div>
      <div className="sticky bottom-0 flex justify-center">
        <StudioComposer placeholder="Describe what you want to generate" />
      </div>
    </div>
  );
}
