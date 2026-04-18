'use client';

import { DeleteProjectDialog } from '@/app/(protected)/studio/components/delete-project-dialog';
import { ProjectActionsDropdown } from '@/app/(protected)/studio/components/project-actions-dropdown';
import { StudioProjectSettingsSheet } from '@/app/(protected)/studio/components/studio-project-settings-sheet';
import type { ProjectFormValues } from '@/app/(protected)/studio/project-form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { MockConversationImage } from '@/mock-data/types';
import { cn } from '@/utils/utils';
import { ImageOffIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface ProjectTableProject {
  id: string;
  title: string;
  coverImage?: string;
  images: MockConversationImage[];
  createdAt?: string;
  settings: ProjectFormValues;
  onProjectUpdate?: (values: ProjectFormValues) => void;
}

interface ProjectTableProps {
  projects: ProjectTableProject[];
}

function formatDate(dateString?: string) {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const StackedImages = ({ images }: { images: MockConversationImage[] }) => {
  const displayImages = images.slice(-3);
  const remainingCount = Math.max(0, images.length - 3);

  if (images.length === 0) {
    return <span className="text-muted-foreground text-sm">No images</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {displayImages.map((image, index) => (
          <img
            key={image.id}
            src={image.src}
            alt={image.title}
            className={cn(
              'relative h-8 w-8 min-w-8 cursor-pointer rounded-md border-2 border-background object-cover hover:z-10',
              index > 0 && '-ml-3'
            )}
          />
        ))}
      </div>
      {remainingCount > 0 && (
        <span className="text-muted-foreground text-xs font-medium">
          +{remainingCount}
        </span>
      )}
    </div>
  );
};

const ProjectTableRow = ({
  id,
  title,
  coverImage,
  images,
  createdAt,
  settings,
  onProjectUpdate,
}: ProjectTableProject) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSettingsSheetOpen, setIsSettingsSheetOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldKeepInputFocusedRef = useRef(false);
  const previewImage = coverImage ?? images[0]?.src;

  useEffect(() => {
    if (!isEditing) return;

    const frameId = requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });

    return () => cancelAnimationFrame(frameId);
  }, [isEditing]);

  const thumbnail = previewImage ? (
    <img
      src={previewImage}
      alt=""
      className="h-10 w-10 min-w-10 shrink-0 rounded-md object-cover"
    />
  ) : (
    <div className="bg-muted flex h-10 w-10 min-w-10 shrink-0 items-center justify-center rounded-md">
      <ImageOffIcon className="text-muted-foreground size-4" />
    </div>
  );

  return (
    <TableRow>
      <DeleteProjectDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        projectTitle={title}
        onConfirm={() => {}}
      />
      <StudioProjectSettingsSheet
        open={isSettingsSheetOpen}
        onOpenChange={setIsSettingsSheetOpen}
        initialValues={settings}
        onProjectUpdate={onProjectUpdate}
      />
      <TableCell>
        {isEditing ? (
          <div className="flex items-center gap-3">
            {thumbnail}
            <input
              ref={inputRef}
              defaultValue={title}
              className="w-full min-w-0 bg-transparent text-sm font-medium outline-none"
              onBlur={() => setIsEditing(false)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === 'Escape') {
                  event.preventDefault();
                  setIsEditing(false);
                }
              }}
            />
          </div>
        ) : (
          <Link
            href={`/studio/${id}`}
            className="flex items-center gap-3 font-medium hover:underline"
          >
            {thumbnail}
            <span className="truncate">{title}</span>
          </Link>
        )}
      </TableCell>
      <TableCell>
        <StackedImages images={images} />
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDate(createdAt)}
      </TableCell>
      <TableCell>
        <ProjectActionsDropdown
          onCloseAutoFocus={(event) => {
            if (!shouldKeepInputFocusedRef.current) return;

            event.preventDefault();
            shouldKeepInputFocusedRef.current = false;

            requestAnimationFrame(() => {
              inputRef.current?.focus();
              inputRef.current?.select();
            });
          }}
          onSettings={() => setIsSettingsSheetOpen(true)}
          onRename={() => {
            shouldKeepInputFocusedRef.current = true;
            setIsEditing(true);
          }}
          onDelete={() => setIsDeleteDialogOpen(true)}
        />
      </TableCell>
    </TableRow>
  );
};

export const ProjectTable = ({ projects }: ProjectTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Images</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="w-12">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <ProjectTableRow key={project.id} {...project} />
        ))}
      </TableBody>
    </Table>
  );
};
