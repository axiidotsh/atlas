import { atomWithStorage, createJSONStorage } from 'jotai/utils';

export const REPORTS_VIEWS = ['grid', 'table'] as const;

export type ReportsView = (typeof REPORTS_VIEWS)[number];

const reportsViewStorage = createJSONStorage<ReportsView>();

export const reportsViewAtom = atomWithStorage<ReportsView>(
  'reports-view',
  'grid',
  reportsViewStorage,
  {
    getOnInit: true,
  }
);
