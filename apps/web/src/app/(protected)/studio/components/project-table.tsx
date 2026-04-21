'use client';

import { StudioProjectSettingsSheet } from '@/app/(protected)/studio/components/project-settings/studio-project-settings-sheet';
import type { ProjectFormValues } from '@/app/(protected)/studio/project-form';
import { DeleteEntityDialog } from '@/components/entity/delete-entity-dialog';
import {
  EntityActionsDropdown,
  type EntityAction,
} from '@/components/entity/entity-actions-dropdown';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useInlineTitleEdit } from '@/hooks/use-inline-title-edit';
import type { MockConversationImage } from '@/mock-data/types';
import { formatDateShort } from '@/utils/date';
import { cn } from '@/utils/utils';
import { CogIcon, ImageOffIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

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
              'border-background relative size-8 min-w-8 cursor-pointer rounded-md border-2 object-cover hover:z-10',
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSettingsSheetOpen, setIsSettingsSheetOpen] = useState(false);
  const {
    isEditing,
    inputRef,
    startEditing,
    stopEditing,
    handleDropdownCloseAutoFocus,
  } = useInlineTitleEdit();
  const previewImage = coverImage ?? images[0]?.src;

  const actions: EntityAction[] = [
    { id: 'rename', label: 'Rename', icon: PencilIcon, onSelect: startEditing },
    {
      id: 'settings',
      label: 'Settings',
      icon: CogIcon,
      onSelect: () => setIsSettingsSheetOpen(true),
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2Icon,
      variant: 'destructive',
      onSelect: () => setIsDeleteDialogOpen(true),
    },
  ];

  const thumbnail = previewImage ? (
    <img
      src={previewImage}
      alt=""
      className="size-10 min-w-10 shrink-0 rounded-md object-cover"
    />
  ) : (
    <div className="bg-muted flex size-10 min-w-10 shrink-0 items-center justify-center rounded-md">
      <ImageOffIcon className="text-muted-foreground size-4" />
    </div>
  );

  return (
    <TableRow>
      <DeleteEntityDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        entityLabel="project"
        entityTitle={title}
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
              onBlur={stopEditing}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === 'Escape') {
                  event.preventDefault();
                  stopEditing();
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
        {formatDateShort(createdAt)}
      </TableCell>
      <TableCell>
        <EntityActionsDropdown
          actions={actions}
          triggerLabel="Open project actions"
          onCloseAutoFocus={handleDropdownCloseAutoFocus}
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
