'use client';

import { ProjectSettingsForm } from '@/app/(protected)/studio/components/project-settings-form';
import {
  createProjectFormValues,
  projectFormSchema,
  type ProjectFormValues,
} from '@/app/(protected)/studio/project-form';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { CogIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface StudioProjectSettingsSheetProps {
  initialValues: ProjectFormValues;
  onProjectUpdate?: (values: ProjectFormValues) => void;
}

export const StudioProjectSettingsSheet = ({
  initialValues,
  onProjectUpdate,
}: StudioProjectSettingsSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema as never) as never,
    defaultValues: createProjectFormValues(initialValues),
  });

  useEffect(() => {
    form.reset(createProjectFormValues(initialValues));
  }, [form, initialValues]);

  function handleOpenChange(nextOpen: boolean) {
    setIsOpen(nextOpen);

    if (nextOpen) {
      form.reset(createProjectFormValues(initialValues));
    }
  }

  function handleSubmit(values: ProjectFormValues) {
    const nextSettings = createProjectFormValues(values);

    onProjectUpdate?.(nextSettings);
    setIsOpen(false);
    toast.success('Project settings updated');
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          tooltip="Project Settings"
        >
          <CogIcon />
          <span className="sr-only">Open project settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full! gap-0 p-0 sm:max-w-5xl!">
        <SheetHeader className="border-b pr-14">
          <SheetTitle>Project settings</SheetTitle>
          <SheetDescription>
            Update the creative brief, visual direction, and audience for this
            project.
          </SheetDescription>
        </SheetHeader>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex-1 space-y-6 overflow-y-auto p-4">
              <ProjectSettingsForm
                shouldShowQuickStart={false}
                shouldShowProjectIdentity
              />
            </div>
            <SheetFooter className="bg-background border-t sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save settings</Button>
            </SheetFooter>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
};
