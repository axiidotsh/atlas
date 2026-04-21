import {
  MOCK_AD_ACCOUNTS,
  MOCK_AD_SETS,
  MOCK_ADS,
  MOCK_CAMPAIGNS,
} from '@/mock-data/ad-data';

export type MentionType = 'ad-account' | 'campaign' | 'ad-set' | 'ad';

export interface MentionOption {
  id: string;
  name: string;
  type: MentionType;
}

export const MENTION_OPTIONS: MentionOption[] = [
  ...MOCK_AD_ACCOUNTS.map((item) => ({ ...item, type: 'ad-account' as const })),
  ...MOCK_CAMPAIGNS.map((item) => ({ ...item, type: 'campaign' as const })),
  ...MOCK_AD_SETS.map((item) => ({ ...item, type: 'ad-set' as const })),
  ...MOCK_ADS.map((item) => ({ ...item, type: 'ad' as const })),
];

export function formatMentionType(value: MentionType): string {
  return value
    .split('-')
    .map((item) => item[0].toUpperCase().concat(item.substring(1)))
    .join(' ');
}

export function getMentionLabel(item: MentionOption): string {
  return `${item.name} [${item.id}] (${item.type})`;
}
