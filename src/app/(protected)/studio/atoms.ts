import { atomWithStorage, createJSONStorage } from 'jotai/utils';

const studioQueryStorage = createJSONStorage<string>();

export const studioQueryAtom = atomWithStorage<string>(
  'studio-query',
  '',
  studioQueryStorage
);
