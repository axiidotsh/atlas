import type {
  MockAd,
  MockAdAccount,
  MockAdSet,
  MockCampaign,
} from '@/mock-data/types';

export const MOCK_AD_ACCOUNTS: MockAdAccount[] = [
  {
    id: 'act_meta_129440001',
    name: 'Wod Armour',
    platform: 'meta',
  },
  {
    id: 'act_meta_129440002',
    name: 'Dar Global',
    platform: 'meta',
  },
  {
    id: 'act_google_55821031',
    name: 'Hyperice',
    platform: 'google',
  },
];

export const MOCK_CAMPAIGNS: MockCampaign[] = [
  {
    id: 'cmp_meta_1001',
    adAccountId: 'act_meta_129440001',
    name: 'Wod Armour | Spring Prospecting',
  },
  {
    id: 'cmp_meta_1002',
    adAccountId: 'act_meta_129440001',
    name: 'Wod Armour | Retargeting Push',
  },
  {
    id: 'cmp_meta_2001',
    adAccountId: 'act_meta_129440002',
    name: 'Dar Global | UAE Lead Gen',
  },
  {
    id: 'cmp_meta_2002',
    adAccountId: 'act_meta_129440002',
    name: 'Dar Global | Investor Nurture',
  },
  {
    id: 'cmp_google_3001',
    adAccountId: 'act_google_55821031',
    name: 'Hyperice | Brand Search',
  },
  {
    id: 'cmp_google_3002',
    adAccountId: 'act_google_55821031',
    name: 'Hyperice | Recovery Device Shopping',
  },
];

export const MOCK_AD_SETS: MockAdSet[] = [
  {
    id: 'adset_meta_1001_a',
    campaignId: 'cmp_meta_1001',
    name: 'Broad Athletes 18-34',
  },
  {
    id: 'adset_meta_1001_b',
    campaignId: 'cmp_meta_1001',
    name: 'CrossFit Interest Stack',
  },
  {
    id: 'adset_meta_1002_a',
    campaignId: 'cmp_meta_1002',
    name: 'Viewed Product 30D',
  },
  {
    id: 'adset_meta_2001_a',
    campaignId: 'cmp_meta_2001',
    name: 'Dubai High Intent Leads',
  },
  {
    id: 'adset_meta_2002_a',
    campaignId: 'cmp_meta_2002',
    name: 'Warm Investor Retargeting',
  },
  {
    id: 'adset_google_3001_a',
    campaignId: 'cmp_google_3001',
    name: 'US Brand Core Terms',
  },
  {
    id: 'adset_google_3002_a',
    campaignId: 'cmp_google_3002',
    name: 'Recovery Device Best Sellers',
  },
];

export const MOCK_ADS: MockAd[] = [
  {
    id: 'ad_meta_1001_a_01',
    adSetId: 'adset_meta_1001_a',
    name: 'Wod Armour | Rope Climb Static',
  },
  {
    id: 'ad_meta_1001_b_01',
    adSetId: 'adset_meta_1001_b',
    name: 'Wod Armour | Gym Chalk Carousel',
  },
  {
    id: 'ad_meta_1002_a_01',
    adSetId: 'adset_meta_1002_a',
    name: 'Wod Armour | Checkout Reminder',
  },
  {
    id: 'ad_meta_2001_a_01',
    adSetId: 'adset_meta_2001_a',
    name: 'Dar Global | Tower Launch Video',
  },
  {
    id: 'ad_meta_2002_a_01',
    adSetId: 'adset_meta_2002_a',
    name: 'Dar Global | Investor Proof Points',
  },
  {
    id: 'ad_google_3001_a_01',
    adSetId: 'adset_google_3001_a',
    name: 'Hyperice | Brand Search RSA',
  },
  {
    id: 'ad_google_3002_a_01',
    adSetId: 'adset_google_3002_a',
    name: 'Hyperice | Venom 2 Listing',
  },
];
