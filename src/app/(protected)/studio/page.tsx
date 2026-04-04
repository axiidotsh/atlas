'use client';

import { SearchBar } from '@/components/search-bar';
import { getStudioConversations } from '@/mock-data/conversations';
import type { MockConversation } from '@/mock-data/types';
import { useState } from 'react';
import { CreateProjectDialog } from './components/create-project-dialog';
import { ProjectCard } from './components/project-card';

export default function StudioPage() {
  const [projectQuery, setProjectQuery] = useState('');
  const [studioProjects, setStudioProjects] = useState(() =>
    getStudioConversations()
  );

  const normalizedProjectQuery = projectQuery.trim().toLowerCase();
  const filteredStudioProjects = studioProjects.filter((project) =>
    project.title.toLowerCase().includes(normalizedProjectQuery)
  );

  function createProject(projectName: string): MockConversation {
    return {
      id: crypto.randomUUID(),
      type: 'studio',
      title: projectName,
      messages: [],
      images: [],
    };
  }

  function handleCreateProject(projectName: string) {
    setStudioProjects((currentProjects) => [
      createProject(projectName),
      ...currentProjects,
    ]);
    setProjectQuery('');
  }

  return (
    <div className="flex flex-col gap-4 py-6 sm:py-14 2xl:py-20">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Your Projects</h1>
        <CreateProjectDialog onCreateProject={handleCreateProject} />
      </div>
      <SearchBar
        value={projectQuery}
        onChange={setProjectQuery}
        placeholder="Search your projects..."
      />
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStudioProjects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </div>
  );
}
