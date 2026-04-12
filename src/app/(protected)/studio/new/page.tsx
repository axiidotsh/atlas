'use client';

import { ProjectSettingsForm } from '@/app/(protected)/studio/components/project-settings-form';
import {
  createProjectFormValues,
  projectFormSchema,
  type ProjectFormValues,
} from '@/app/(protected)/studio/project-form';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { SparklesIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';

export default function NewProjectPage() {
  const router = useRouter();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema as never) as never,
    defaultValues: createProjectFormValues(),
  });

  function handleSubmit() {
    router.push('/studio');
  }

  return (
    <div className="mx-auto w-full max-w-5xl py-6 sm:py-14 2xl:py-20">
      <div className="mb-8 flex items-center gap-3">
        <div>
          <h1 className="text-xl font-semibold">Create New Creative Project</h1>
          <p className="text-muted-foreground text-sm">
            Set up a creative project for multiple ads and variations, or
            configure each detail manually.
          </p>
        </div>
      </div>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <ProjectSettingsForm />
          <div className="bg-background sticky bottom-0 -mx-1 flex items-center justify-end gap-3 border-t px-1 py-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/studio">Cancel</Link>
            </Button>
            <Button type="submit">
              <SparklesIcon className="size-4" />
              Create Creative Project
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
