'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { PlusIcon } from 'lucide-react';
import { type FormEvent, useState } from 'react';

interface CreateProjectDialogProps {
  onCreateProject: (projectName: string) => void;
}

export const CreateProjectDialog = ({
  onCreateProject,
}: CreateProjectDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState('');

  const canCreateProject = projectName.trim().length > 0;

  function resetDialog() {
    setIsOpen(false);
    setProjectName('');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedProjectName = projectName.trim();

    if (!normalizedProjectName) {
      return;
    }

    onCreateProject(normalizedProjectName);
    resetDialog();
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(nextIsOpen) => {
        if (!nextIsOpen) {
          resetDialog();
          return;
        }

        setIsOpen(true);
      }}
    >
      <DialogTrigger asChild>
        <Button type="button">
          <PlusIcon />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              Give your new project a name to get started.
            </DialogDescription>
          </DialogHeader>
          <Input
            autoFocus
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            placeholder="Project name"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!canCreateProject}>
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
