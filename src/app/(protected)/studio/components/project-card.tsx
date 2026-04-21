'use client';

import { StudioProjectSettingsSheet } from '@/app/(protected)/studio/components/project-settings/studio-project-settings-sheet';
import type { ProjectFormValues } from '@/app/(protected)/studio/project-form';
import { DeleteEntityDialog } from '@/components/entity/delete-entity-dialog';
import {
  EntityActionsDropdown,
  type EntityAction,
} from '@/components/entity/entity-actions-dropdown';
import { Button } from '@/components/ui/button';
import { useInlineTitleEdit } from '@/hooks/use-inline-title-edit';
import { cn } from '@/utils/utils';
import {
  CogIcon,
  ImageOffIcon,
  PencilIcon,
  Trash2Icon,
  XIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useState } from 'react';

interface ProjectImageProps {
  id: string;
  title: string;
  src: string;
  aspectRatio: string;
}

interface ProjectCardProps {
  id: string;
  title: string;
  coverImage?: string;
  images: ProjectImageProps[];
  settings: ProjectFormValues;
  onProjectUpdate?: (values: ProjectFormValues) => void;
}

const TITLE_CLASS_NAME =
  'block w-full truncate bg-transparent p-0 text-sm font-medium leading-5 outline-none';

const CARD_CLASS_NAME =
  'bg-card border-border/50 hover:bg-muted flex cursor-pointer flex-col overflow-hidden rounded-xl border transition-colors duration-300';

export const ProjectCard = ({
  id,
  title,
  coverImage,
  images,
  settings,
  onProjectUpdate,
}: ProjectCardProps) => {
  const { theme } = useTheme();
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

  const cardContent = (
    <>
      <div className="h-40 overflow-hidden">
        {previewImage ? (
          <img
            src={previewImage}
            alt=""
            className="border-border/50 size-full border-b object-cover transition-transform duration-300"
          />
        ) : (
          <div className="bg-muted border-border/50 flex size-full items-center justify-center border-b">
            <ImageOffIcon className="text-muted-foreground size-5" />
          </div>
        )}
      </div>
      <div className="relative px-4 py-3 pr-12">
        {isEditing ? (
          <>
            <input
              ref={inputRef}
              defaultValue={title}
              className={TITLE_CLASS_NAME}
              onBlur={stopEditing}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === 'Escape') {
                  event.preventDefault();
                  stopEditing();
                }
              }}
            />
            <Button
              variant="destructive"
              size="icon-xs"
              className="absolute top-1/2 right-3 -translate-y-1/2"
              onMouseDown={(event) => event.preventDefault()}
              onClick={stopEditing}
            >
              <XIcon />
            </Button>
          </>
        ) : (
          <span className={TITLE_CLASS_NAME}>{title}</span>
        )}
      </div>
    </>
  );

  return (
    <div className="group relative">
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
      <EntityActionsDropdown
        actions={actions}
        triggerLabel="Open project actions"
        triggerVariant={theme === 'dark' ? 'secondary' : 'outline'}
        triggerSize="icon-xs"
        triggerClassName="absolute top-2 right-2 opacity-0 group-hover:opacity-100 data-open:opacity-100 max-lg:opacity-100"
        onCloseAutoFocus={handleDropdownCloseAutoFocus}
      />
      {isEditing ? (
        <div className={CARD_CLASS_NAME}>{cardContent}</div>
      ) : (
        <Link href={`/studio/${id}`} className={cn(CARD_CLASS_NAME)}>
          {cardContent}
        </Link>
      )}
    </div>
  );
};
