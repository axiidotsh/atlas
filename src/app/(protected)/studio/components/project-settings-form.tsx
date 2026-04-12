'use client';

import { AudienceSettingsSection } from '@/app/(protected)/studio/new/components/audience-settings-section';
import { BrandIdentitySection } from '@/app/(protected)/studio/new/components/brand-identity-section';
import { ColorPaletteSection } from '@/app/(protected)/studio/new/components/color-palette-section';
import { CreativeDirectionSection } from '@/app/(protected)/studio/new/components/creative-direction-section';
import {
  ProjectIdentityFields,
  QuickStartSection,
} from '@/app/(protected)/studio/new/components/quick-start-section';

interface ProjectSettingsFormProps {
  shouldShowQuickStart?: boolean;
  shouldShowProjectIdentity?: boolean;
}

export const ProjectSettingsForm = ({
  shouldShowQuickStart = true,
  shouldShowProjectIdentity = false,
}: ProjectSettingsFormProps) => {
  return (
    <>
      {shouldShowQuickStart ? <QuickStartSection /> : null}
      {shouldShowProjectIdentity ? (
        <div className="bg-card dark:bg-muted border-border/50 space-y-5 rounded-xl border p-5 shadow-sm">
          <ProjectIdentityFields />
        </div>
      ) : null}
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
        <AudienceSettingsSection />
      </div>
    </>
  );
};
