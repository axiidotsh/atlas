import { atom } from 'jotai';

export const MODES = [
  'create-image',
  'create-report',
  'competitor-research',
  'web-search',
] as const;

export type Mode = (typeof MODES)[number] | null;

export const modeAtom = atom<Mode>(null);
export const queryAtom = atom<string>('');
