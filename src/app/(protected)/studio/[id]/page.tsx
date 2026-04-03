import { notFound } from 'next/navigation';
import { Project } from '../components/project';
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

  return <Project {...project} />;
}
