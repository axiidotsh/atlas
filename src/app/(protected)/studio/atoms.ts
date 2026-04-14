import { atomWithStorage, createJSONStorage } from 'jotai/utils';

const studioQueryStorage = createJSONStorage<string>();
const studioAspectRatioStorage = createJSONStorage<StudioAspectRatio[]>();

export const STUDIO_ASPECT_RATIOS = [
  'auto',
  '1:1',
  '4:5',
  '3:4',
  '2:3',
  '9:16',
] as const;

export type StudioAspectRatio = (typeof STUDIO_ASPECT_RATIOS)[number];

export const studioQueryAtom = atomWithStorage<string>(
  'studio-query',
  '',
  studioQueryStorage,
  {
    getOnInit: true,
  }
);

export const studioAspectRatioAtom = atomWithStorage<StudioAspectRatio[]>(
  'studio-aspect-ratios',
  ['auto'],
  studioAspectRatioStorage,
  {
    getOnInit: true,
  }
);
