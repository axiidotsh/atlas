import type { ProjectFormValues } from '@/app/(protected)/studio/project-form';

export type ChatMessageRole = 'user' | 'assistant';
export type ConversationType = 'standard' | 'studio';

export type AdPlatform = 'meta' | 'google';
export type CampaignStatus =
  | 'ACTIVE'
  | 'PAUSED'
  | 'WITH_ISSUES'
  | 'ENDED';
export type PerformanceLevel = 'campaign' | 'adSet' | 'ad';
export type CreativeMediaType = 'image' | 'video';
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

export interface MockStudioImageSet {
  id: string;
  prompt: string;
  images: MockConversationImage[];
  createdAtLabel?: string;
}

interface MockBaseConversation {
  id: string;
  title: string;
  messages: MockChatMessage[];
  images: MockConversationImage[];
  coverImage?: string;
  createdAt?: string;
}

export interface MockStandardConversation extends MockBaseConversation {
  type: 'standard';
}

export type MockStudioImage = MockConversationImage;

export interface MockStudioConversation extends MockBaseConversation {
  type: 'studio';
  settings: ProjectFormValues;
  imageSets: MockStudioImageSet[];
}

export type MockConversation =
  | MockStandardConversation
  | MockStudioConversation;

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
  metrics: MockPerformanceMetrics;
}

export interface MockAdSet {
  id: string;
  campaignId: string;
  name: string;
  status: CampaignStatus;
  metrics: MockPerformanceMetrics;
}

export interface MockAd {
  id: string;
  adSetId: string;
  name: string;
  status: CampaignStatus;
  headline: string;
  primaryText: string;
  destination: string;
  metrics: MockPerformanceMetrics;
  media: MockCreativeMedia[];
  detailMetrics: MockAdDetailMetric[];
}

export interface MockMetric {
  id: CoreMetricId;
  title: string;
  description: string;
  value: string;
  percentageChange: number;
  trend: 'positive' | 'negative' | 'neutral';
}

export interface MockPerformanceMetrics {
  impressions: string;
  clicks: string;
  spend: string;
  reach: string;
  revenue: string;
  ctr: string;
  cpc: string;
  roas: string;
}

export type MockCampaignMetrics = MockPerformanceMetrics;

export interface MockCreativeMedia {
  id: string;
  title: string;
  type: CreativeMediaType;
  src: string;
  posterSrc?: string;
  aspectRatio: string;
}

export interface MockAdDetailMetric {
  id: string;
  label: string;
  value: string;
}
