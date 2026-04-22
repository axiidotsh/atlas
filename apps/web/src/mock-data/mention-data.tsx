import { MentionOption } from '@/components/chat/chat-input';
import { PlatformIcon } from '@/components/platform-icon';
import {
  MOCK_AD_ACCOUNTS,
  MOCK_AD_SETS,
  MOCK_ADS,
  MOCK_CAMPAIGNS,
} from '@/mock-data/ad-data';
import type { AdPlatform } from '@/mock-data/types';

type MentionEntityType = 'ad-account' | 'campaign' | 'ad-set' | 'ad';

const MENTION_TYPE_LABELS: Record<MentionEntityType, string> = {
  'ad-account': 'Ad Account',
  campaign: 'Campaign',
  'ad-set': 'Ad Set',
  ad: 'Ad',
};

const AD_ACCOUNT_PLATFORM_BY_ID = new Map<string, AdPlatform>(
  MOCK_AD_ACCOUNTS.map((adAccount) => [adAccount.id, adAccount.platform])
);
const CAMPAIGN_PLATFORM_BY_ID = new Map<string, AdPlatform>(
  MOCK_CAMPAIGNS.map((campaign) => [
    campaign.id,
    AD_ACCOUNT_PLATFORM_BY_ID.get(campaign.adAccountId) ?? 'meta',
  ])
);
const AD_SET_PLATFORM_BY_ID = new Map<string, AdPlatform>(
  MOCK_AD_SETS.map((adSet) => [
    adSet.id,
    CAMPAIGN_PLATFORM_BY_ID.get(adSet.campaignId) ?? 'meta',
  ])
);

function createAdMention({
  id,
  name,
  type,
  platform,
}: {
  id: string;
  name: string;
  type: MentionEntityType;
  platform: AdPlatform;
}): MentionOption {
  return {
    id,
    label: `${name} [${id}] (${type})`,
    searchValue: name + id,
    content: (
      <>
        <PlatformIcon platform={platform} />
        <span className="truncate text-sm">{name}</span>
        <span className="text-muted-foreground ml-auto shrink-0 rounded-sm bg-transparent px-1.5 py-0.5 text-[11px] leading-none">
          {MENTION_TYPE_LABELS[type]}
        </span>
      </>
    ),
  };
}

export const MENTION_OPTIONS: MentionOption[] = [
  ...MOCK_AD_ACCOUNTS.map((item) =>
    createAdMention({
      id: item.id,
      name: item.name,
      type: 'ad-account',
      platform: item.platform,
    })
  ),
  ...MOCK_CAMPAIGNS.map((item) =>
    createAdMention({
      id: item.id,
      name: item.name,
      type: 'campaign',
      platform: AD_ACCOUNT_PLATFORM_BY_ID.get(item.adAccountId) ?? 'meta',
    })
  ),
  ...MOCK_AD_SETS.map((item) =>
    createAdMention({
      id: item.id,
      name: item.name,
      type: 'ad-set',
      platform: CAMPAIGN_PLATFORM_BY_ID.get(item.campaignId) ?? 'meta',
    })
  ),
  ...MOCK_ADS.map((item) =>
    createAdMention({
      id: item.id,
      name: item.name,
      type: 'ad',
      platform: AD_SET_PLATFORM_BY_ID.get(item.adSetId) ?? 'meta',
    })
  ),
];
