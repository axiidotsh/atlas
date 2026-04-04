export type ChatMessageRole = 'user' | 'assistant';
export type ConversationType = 'standard' | 'studio';

export type AdPlatform = 'meta' | 'google';
export type CampaignStatus =
  | 'ACTIVE'
  | 'PAUSED'
  | 'WITH_ISSUES'
  | 'ENDED';
export type CoreMetricId =
  | 'impressions'
  | 'clicks'
  | 'spend'
  | 'reach'
  | 'revenue'
  | 'ctr'
  | 'cpc'
  | 'roas';

export interface MockChatMessage {
  id: string;
  role: ChatMessageRole;
  content: string;
}

export interface MockConversationImage {
  id: string;
  title: string;
  src: string;
  aspectRatio: string;
}

export interface MockConversation {
  id: string;
  type: ConversationType;
  title: string;
  messages: MockChatMessage[];
  images: MockConversationImage[];
  coverImage?: string;
}
export type MockStudioImage = MockConversationImage;

export interface MockAdAccount {
  id: string;
  name: string;
  platform: AdPlatform;
}

export interface MockCampaign {
  id: string;
  adAccountId: string;
  name: string;
  status: CampaignStatus;
  metrics: MockCampaignMetrics;
}

export interface MockAdSet {
  id: string;
  campaignId: string;
  name: string;
}

export interface MockAd {
  id: string;
  adSetId: string;
  name: string;
}

export interface MockMetric {
  id: CoreMetricId;
  title: string;
  description: string;
  value: string;
  percentageChange: number;
  trend: 'positive' | 'negative' | 'neutral';
}

export interface MockCampaignMetrics {
  impressions: string;
  clicks: string;
  spend: string;
  reach: string;
  revenue: string;
  ctr: string;
  cpc: string;
  roas: string;
}
