import { atomWithStorage, createJSONStorage } from 'jotai/utils';

export const MODES = [
  'create-image',
  'create-report',
  'competitor-research',
  'web-search',
] as const;

export type Mode = (typeof MODES)[number] | null;

const modeStorage = createJSONStorage<Mode>();
const queryStorage = createJSONStorage<string>();

export const modeAtom = atomWithStorage<Mode>(
  'chat-mode',
  null,
  modeStorage
);

export const queryAtom = atomWithStorage<string>(
  'chat-query',
  '',
  queryStorage
);
