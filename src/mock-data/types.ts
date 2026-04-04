export type ChatMessageRole = 'user' | 'assistant';

export type AdPlatform = 'meta' | 'google';

export interface MockChatMessage {
  id: string;
  role: ChatMessageRole;
  content: string;
}

export interface MockChat {
  id: string;
  title: string;
  messages: MockChatMessage[];
}

export interface MockStudioImage {
  id: string;
  title: string;
  src: string;
  aspectRatio: string;
}

export interface MockStudioProject {
  id: string;
  title: string;
  coverImage: string;
  messages: MockChatMessage[];
  images: MockStudioImage[];
}

export interface MockAdAccount {
  id: string;
  name: string;
  platform: AdPlatform;
}

export interface MockCampaign {
  id: string;
  adAccountId: string;
  name: string;
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
