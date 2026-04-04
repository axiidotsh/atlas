import { Conversation } from '@/app/(protected)/chat/[id]/components/conversation';
import { notFound } from 'next/navigation';
import { getStudioProject } from '../utils';

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = getStudioProject(id);

  if (!project) {
    notFound();
  }

  return <Conversation messages={project.messages} />;
}
