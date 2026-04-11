'use client';

import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { SparklesIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { BrandIdentitySection } from './components/brand-identity-section';
import { CampaignSettingsSection } from './components/campaign-settings-section';
import { ColorPaletteSection } from './components/color-palette-section';
import { CreativeDirectionSection } from './components/creative-direction-section';
import { QuickStartSection } from './components/quick-start-section';
import {
  DEFAULT_COLOR_PALETTE,
  projectFormSchema,
  type ProjectFormValues,
} from './schema';

export default function NewProjectPage() {
  const router = useRouter();

  const form = useForm<ProjectFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(projectFormSchema as any),
    defaultValues: {
      name: '',
      prompt: '',
      referenceImages: [],
      primaryGoal: '',
      voiceTones: [],
      customVoiceTone: '',
      colorPalette: [...DEFAULT_COLOR_PALETTE],
      logo: null,
      typography: '',
      adStyles: [],
      customAdStyle: '',
      visualGuidelines: [],
      customVisualGuideline: '',
      ageRange: [18, 65],
      gender: 'All',
      interests: [],
      geography: [],
    },
  });

  function handleSubmit() {
    router.push('/studio');
  }

  return (
    <div className="py-6 sm:py-14 2xl:py-20">
      <div className="mb-8 flex items-center gap-3">
        <div>
          <h1 className="text-xl font-semibold">Create New Project</h1>
          <p className="text-muted-foreground text-sm">
            Describe your brand and we&apos;ll set up the rest, or configure
            each detail manually.
          </p>
        </div>
      </div>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <QuickStartSection />

          <div className="relative flex items-center py-2">
            <div className="flex-1 border-t" />
            <span className="text-muted-foreground px-3 text-xs font-medium">
              Fine-tune your project
            </span>
            <div className="flex-1 border-t" />
          </div>

          <div className="space-y-3">
            <BrandIdentitySection />
            <ColorPaletteSection />
            <CreativeDirectionSection />
            <CampaignSettingsSection />
          </div>
          <div className="bg-background sticky bottom-0 -mx-1 flex items-center justify-end gap-3 border-t px-1 py-4">
            <Button type="button" variant="outline" size="lg" asChild>
              <Link href="/studio">Cancel</Link>
            </Button>
            <Button type="submit" size="lg">
              <SparklesIcon className="size-4" />
              Create Project
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
