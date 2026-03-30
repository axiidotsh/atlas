import { atomWithStorage, createJSONStorage } from 'jotai/utils';

export const MODES = [
  'create-image',
  'create-report',
  'competitor-research',
  'web-search',
] as const;

export type Mode = (typeof MODES)[number] | null;

const STORAGE_OPTIONS = {
  getOnInit: true,
} as const;

const modeStorage = createJSONStorage<Mode>(() => localStorage);
const queryStorage = createJSONStorage<string>(() => localStorage);

export const modeAtom = atomWithStorage<Mode>(
  'chat-mode',
  null,
  modeStorage,
  STORAGE_OPTIONS
);

export const queryAtom = atomWithStorage<string>(
  'chat-query',
  '',
  queryStorage,
  STORAGE_OPTIONS
);
