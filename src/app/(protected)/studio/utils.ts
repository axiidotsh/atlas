import { MOCK_STUDIO_PROJECTS } from '@/mock-data/studio-projects';

export function getStudioProject(projectId: string) {
  return MOCK_STUDIO_PROJECTS.find((project) => project.id === projectId);
}
