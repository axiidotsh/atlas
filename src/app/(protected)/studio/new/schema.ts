import { z } from 'zod';

export const VOICE_TONE_PRESETS = [
  'luxury',
  'playful',
  'minimal',
  'bold',
  'corporate',
  'friendly',
  'confident',
  'witty',
  'sophisticated',
] as const;

export const PRIMARY_GOAL_PRESETS = [
  'Brand awareness',
  'Lead generation',
  'Sales conversion',
  'App installs',
  'Engagement',
] as const;

export const AD_STYLE_PRESETS = [
  'lifestyle',
  'studio',
  'UGC',
  'cinematic',
  'minimal',
  'editorial',
  'product-focused',
  'documentary',
  'luxury',
  'retro',
  'high-fashion',
  'playful',
  'bold-graphic',
  'storytelling',
  'tech-forward',
] as const;

export const VISUAL_GUIDELINE_PRESETS = [
  'Dark backgrounds',
  'High contrast',
  'Clean UI',
  'Textured',
  'Gradient',
  'Muted tones',
  'Bold typography',
  'Negative space',
  'Soft shadows',
  'Layered depth',
  'Film grain',
  'Glossy highlights',
  'Minimal props',
  'Natural lighting',
] as const;

export const GENDER_OPTIONS = ['All', 'Male', 'Female'] as const;

export const FONT_PRESETS = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Lato',
  'Poppins',
  'Raleway',
  'Playfair Display',
  'Merriweather',
  'Oswald',
  'Nunito',
  'DM Sans',
  'Space Grotesk',
  'Sora',
  'Outfit',
] as const;

export const COLOR_PALETTE_PRESETS: Record<string, string[]> = {
  'Sunset Warmth': ['#FF6B6B', '#FFA07A', '#FFD700', '#FF8C42', '#E85D75'],
  'Ocean Breeze': ['#0077B6', '#00B4D8', '#90E0EF', '#CAF0F8', '#023E8A'],
  'Forest Calm': ['#2D6A4F', '#40916C', '#52B788', '#74C69D', '#B7E4C7'],
  Monochrome: ['#212529', '#495057', '#6C757D', '#ADB5BD', '#DEE2E6'],
  'Neon Pop': ['#FF006E', '#8338EC', '#3A86FF', '#FFBE0B', '#FB5607'],
  'Pastel Dream': ['#FFB5E8', '#B5DEFF', '#D5AAFF', '#BFFCC6', '#FFF5BA'],
};

export const DEFAULT_COLOR_PALETTE = [
  ...(Object.values(COLOR_PALETTE_PRESETS)[0] ?? [
    '#000000',
    '#FFFFFF',
    '#6366F1',
    '#F59E0B',
    '#10B981',
  ]),
];

interface ReferenceImage {
  id: string;
  name: string;
  preview: string;
}

export const projectFormSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100),
  prompt: z.string().optional().default(''),

  referenceImages: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        preview: z.string(),
      })
    )
    .default([]),

  primaryGoal: z.string().optional().default(''),
  voiceTones: z.array(z.string()).default([]),
  customVoiceTone: z.string().optional().default(''),

  colorPalette: z
    .array(z.string())
    .default(DEFAULT_COLOR_PALETTE),
  logo: z
    .object({
      id: z.string(),
      name: z.string(),
      preview: z.string(),
    })
    .nullable()
    .default(null),
  typography: z.string().optional().default(''),

  adStyles: z.array(z.string()).default([]),
  customAdStyle: z.string().optional().default(''),
  visualGuidelines: z.array(z.string()).default([]),
  customVisualGuideline: z.string().optional().default(''),

  ageRange: z.tuple([z.number(), z.number()]).default([18, 65]),
  gender: z.string().default('All'),
  interests: z.array(z.string()).default([]),
  geography: z.array(z.string()).default([]),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
export type ReferenceImageValue = ReferenceImage;
