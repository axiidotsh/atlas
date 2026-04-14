'use client';

import { STUDIO_ASPECT_RATIO_OPTIONS } from '@/app/(protected)/studio/utils';
import { SearchBar } from '@/components/search-bar';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getStudioConversations } from '@/mock-data/conversations';
import { ArrowUpDownIcon, FunnelIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { ProjectCard } from './components/project-card';

type StudioProjectSortOption = 'recent' | 'name-asc' | 'name-desc';

const STUDIO_PROJECT_SORT_OPTIONS: Array<{
  value: StudioProjectSortOption;
  label: string;
}> = [
  {
    value: 'recent',
    label: 'Recently created',
  },
  {
    value: 'name-asc',
    label: 'Name A-Z',
  },
  {
    value: 'name-desc',
    label: 'Name Z-A',
  },
];

const RESET_MENU_ITEM_CLASS_NAME =
  'text-muted-foreground justify-center text-xs';

export default function StudioPage() {
  const [projectQuery, setProjectQuery] = useState('');
  const [studioProjects] = useState(() => getStudioConversations());
  const [sortOption, setSortOption] =
    useState<StudioProjectSortOption>('recent');
  const [selectedAspectRatios, setSelectedAspectRatios] = useState<string[]>(
    []
  );
  const [shouldFilterHasImages, setShouldFilterHasImages] = useState(false);

  const normalizedProjectQuery = projectQuery.trim().toLowerCase();
  const visibleStudioProjects = studioProjects
    .filter((project) =>
      project.title.toLowerCase().includes(normalizedProjectQuery)
    )
    .filter((project) => {
      if (shouldFilterHasImages && project.images.length === 0) {
        return false;
      }

      if (selectedAspectRatios.length === 0) {
        return true;
      }

      return project.images.some((image) =>
        selectedAspectRatios.includes(image.aspectRatio.replace(' / ', ':'))
      );
    })
    .sort((leftProject, rightProject) => {
      if (sortOption === 'name-asc') {
        return leftProject.title.localeCompare(rightProject.title);
      }

      if (sortOption === 'name-desc') {
        return rightProject.title.localeCompare(leftProject.title);
      }

      return 0;
    });

  function toggleAspectRatioFilter(aspectRatio: string) {
    setSelectedAspectRatios((currentAspectRatios) =>
      currentAspectRatios.includes(aspectRatio)
        ? currentAspectRatios.filter(
            (currentAspectRatio) => currentAspectRatio !== aspectRatio
          )
        : [...currentAspectRatios, aspectRatio]
    );
  }

  function resetSortOption() {
    setSortOption('recent');
  }

  function resetFilters() {
    setSelectedAspectRatios([]);
    setShouldFilterHasImages(false);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 py-6 sm:py-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Your Projects</h1>
        <Button size="lg" asChild>
          <Link href="/studio/new">
            <PlusIcon />
            New Project
          </Link>
        </Button>
      </div>
      <div className="flex gap-2">
        <SearchBar
          value={projectQuery}
          onChange={setProjectQuery}
          placeholder="Search your projects..."
          containerClassName="flex-1"
        />
        <ButtonGroup>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon-lg"
                aria-label="Sort projects"
              >
                <ArrowUpDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>Sort projects</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={sortOption}
                onValueChange={(value) =>
                  setSortOption(value as StudioProjectSortOption)
                }
              >
                {STUDIO_PROJECT_SORT_OPTIONS.map((option) => (
                  <DropdownMenuRadioItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={RESET_MENU_ITEM_CLASS_NAME}
                onSelect={resetSortOption}
              >
                Reset
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon-lg"
                aria-label="Filter projects"
              >
                <FunnelIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter projects</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={shouldFilterHasImages}
                onCheckedChange={(checked) =>
                  setShouldFilterHasImages(checked === true)
                }
              >
                Has images
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Aspect ratios</DropdownMenuLabel>
              {STUDIO_ASPECT_RATIO_OPTIONS.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={selectedAspectRatios.includes(option.value)}
                  onCheckedChange={() => toggleAspectRatioFilter(option.value)}
                >
                  <option.icon className="size-3.5" />
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={RESET_MENU_ITEM_CLASS_NAME}
                onSelect={resetFilters}
              >
                Clear
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {visibleStudioProjects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </div>
  );
}
