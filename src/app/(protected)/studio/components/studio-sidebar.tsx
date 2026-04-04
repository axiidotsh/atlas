'use client';

import {
  getAspectRatio,
  getStudioProject,
} from '@/app/(protected)/studio/utils';
import { SearchBar } from '@/components/search-bar';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/utils/utils';
import { useParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import { AspectRatioBadge } from './aspect-ratio-badge';

export const StudioSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const { open } = useSidebar();
  const [query, setQuery] = useState('');
  const pathname = usePathname();
  const params = useParams<{ id?: string }>();

  const projectId = typeof params.id === 'string' ? params.id : undefined;
  const isStudioProjectPage = /^\/studio\/[^/]+$/.test(pathname);
  const project = projectId ? getStudioProject(projectId) : undefined;
  const filteredImages = project?.images.filter((image) =>
    image.title.toLowerCase().includes(query.trim().toLowerCase())
  );

  const transitionClassname = `transition-opacity duration-200 ease-out ${
    open ? 'opacity-100' : 'pointer-events-none opacity-0'
  }`;

  if (!isStudioProjectPage || !project) {
    return null;
  }

  return (
    <Sidebar
      side="right"
      mobileContentProps={{
        onOpenAutoFocus: (event) => event.preventDefault(),
      }}
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="px-1">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Search project images..."
              variant="ghost"
              size="sm"
              containerClassName={cn(!open && 'hidden')}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent
        className={cn('flex flex-col gap-4 px-3 pb-4', transitionClassname)}
      >
        {filteredImages?.map((image) => {
          const aspectRatio = getAspectRatio(image.aspectRatio);

          return (
            <button
              key={image.id}
              type="button"
              className="hover:bg-foreground/10 cursor-pointer space-y-2 rounded-2xl p-1 transition-colors duration-300"
            >
              <div
                style={{ aspectRatio: image.aspectRatio }}
                className="bg-muted relative h-auto w-full overflow-hidden rounded-xl border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  alt={image.title}
                  className="size-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between gap-2 px-1 pb-1">
                <p className="line-clamp-1 text-left text-sm">{image.title}</p>
                <AspectRatioBadge
                  icon={aspectRatio.icon}
                  label={aspectRatio.label}
                />
              </div>
            </button>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
};
