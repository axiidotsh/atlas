'use client';

import { SearchBar } from '@/components/search-bar';
import { getStudioConversations } from '@/mock-data/conversations';
import { useState } from 'react';
import { ProjectCard } from './components/project-card';

export default function StudioPage() {
  const [projectQuery, setProjectQuery] = useState('');
  const studioProjects = getStudioConversations();

  return (
    <div className="flex flex-col gap-8 py-6 sm:py-14 2xl:py-20">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center sm:gap-2">
        <h1 className="text-xl font-semibold">Your Projects</h1>
        <SearchBar
          value={projectQuery}
          onChange={setProjectQuery}
          placeholder="Search your projects..."
          containerClassName="sm:max-w-72"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {studioProjects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </div>
  );
}
