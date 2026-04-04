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
    status: 'ACTIVE',
    metrics: {
      impressions: '892.4K',
      clicks: '24.8K',
      spend: '$28.6K',
      reach: '401.2K',
      revenue: '$96.8K',
      ctr: '2.78%',
      cpc: '$1.15',
      roas: '3.39x',
    },
  },
  {
    id: 'cmp_meta_1002',
    adAccountId: 'act_meta_129440001',
    name: 'Wod Armour | Retargeting Push',
    status: 'PAUSED',
    metrics: {
      impressions: '416.9K',
      clicks: '16.2K',
      spend: '$19.4K',
      reach: '168.5K',
      revenue: '$74.1K',
      ctr: '3.89%',
      cpc: '$1.20',
      roas: '3.82x',
    },
  },
  {
    id: 'cmp_meta_2001',
    adAccountId: 'act_meta_129440002',
    name: 'Dar Global | UAE Lead Gen',
    status: 'ACTIVE',
    metrics: {
      impressions: '631.5K',
      clicks: '13.7K',
      spend: '$24.8K',
      reach: '312.6K',
      revenue: '$88.9K',
      ctr: '2.17%',
      cpc: '$1.81',
      roas: '3.58x',
    },
  },
  {
    id: 'cmp_meta_2002',
    adAccountId: 'act_meta_129440002',
    name: 'Dar Global | Investor Nurture',
    status: 'WITH_ISSUES',
    metrics: {
      impressions: '357.2K',
      clicks: '8.5K',
      spend: '$17.3K',
      reach: '149.1K',
      revenue: '$56.4K',
      ctr: '2.38%',
      cpc: '$2.03',
      roas: '3.26x',
    },
  },
  {
    id: 'cmp_google_3001',
    adAccountId: 'act_google_55821031',
    name: 'Hyperice | Brand Search',
    status: 'ENDED',
    metrics: {
      impressions: '704.3K',
      clicks: '18.1K',
      spend: '$21.6K',
      reach: '298.4K',
      revenue: '$61.9K',
      ctr: '2.57%',
      cpc: '$1.19',
      roas: '2.87x',
    },
  },
  {
    id: 'cmp_google_3002',
    adAccountId: 'act_google_55821031',
    name: 'Hyperice | Recovery Device Shopping',
    status: 'ACTIVE',
    metrics: {
      impressions: '518.6K',
      clicks: '12.9K',
      spend: '$16.7K',
      reach: '226.8K',
      revenue: '$49.7K',
      ctr: '2.49%',
      cpc: '$1.29',
      roas: '2.98x',
    },
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
