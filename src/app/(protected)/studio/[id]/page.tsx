import { StudioProjectWorkspace } from '@/app/(protected)/studio/components/studio-project-workspace';
import { getStudioConversation } from '@/mock-data/conversations';
import { notFound } from 'next/navigation';

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = getStudioConversation(id);

  if (!project) {
    notFound();
  }

  return <StudioProjectWorkspace project={project} />;
}
