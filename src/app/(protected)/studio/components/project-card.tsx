'use client';

import { DeleteProjectDialog } from '@/app/(protected)/studio/components/delete-project-dialog';
import { ProjectActionsDropdown } from '@/app/(protected)/studio/components/project-actions-dropdown';
import { StudioProjectSettingsSheet } from '@/app/(protected)/studio/components/studio-project-settings-sheet';
import type { ProjectFormValues } from '@/app/(protected)/studio/project-form';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';
import { ImageOffIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

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

export const ProjectCard = ({
  id,
  title,
  coverImage,
  images,
  settings,
  onProjectUpdate,
}: ProjectCardProps) => {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSettingsSheetOpen, setIsSettingsSheetOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldKeepInputFocusedRef = useRef(false);
  const previewImage = coverImage ?? images[0]?.src;

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const frameId = requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });

    return () => cancelAnimationFrame(frameId);
  }, [isEditing]);

  const cardClassName =
    'bg-card border-border/50 hover:bg-muted flex cursor-pointer flex-col overflow-hidden rounded-xl border transition-colors duration-300';

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
              onBlur={() => setIsEditing(false)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === 'Escape') {
                  event.preventDefault();
                  setIsEditing(false);
                }
              }}
            />
            <Button
              variant="destructive"
              size="icon-xs"
              className="absolute top-1/2 right-3 -translate-y-1/2"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => setIsEditing(false)}
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
      <ProjectActionsDropdown
        triggerVariant={theme === 'dark' ? 'secondary' : 'outline'}
        triggerSize="icon-xs"
        triggerClassName="absolute top-2 right-2 opacity-0 group-hover:opacity-100 data-open:opacity-100 max-lg:opacity-100"
        onCloseAutoFocus={(event) => {
          if (!shouldKeepInputFocusedRef.current) {
            return;
          }

          event.preventDefault();
          shouldKeepInputFocusedRef.current = false;

          requestAnimationFrame(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
          });
        }}
        onRename={() => {
          shouldKeepInputFocusedRef.current = true;
          setIsEditing(true);
        }}
        onSettings={() => setIsSettingsSheetOpen(true)}
        onDelete={() => setIsDeleteDialogOpen(true)}
      />
      {isEditing ? (
        <div className={cardClassName}>{cardContent}</div>
      ) : (
        <Link href={`/studio/${id}`} className={cn(cardClassName)}>
          {cardContent}
        </Link>
      )}
    </div>
  );
};
