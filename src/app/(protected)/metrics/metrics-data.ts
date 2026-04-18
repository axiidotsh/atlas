'use client';

import {
  MOCK_AD_ACCOUNTS,
  MOCK_AD_SETS,
  MOCK_ADS,
  MOCK_CAMPAIGNS,
} from '@/mock-data/ad-data';
import { MOCK_METRICS } from '@/mock-data/metrics';
import type {
  CoreMetricId,
  MockAd,
  MockAdAccount,
  MockAdSet,
  MockCampaign,
  MockCreativeMedia,
  MockPerformanceMetrics,
  PerformanceLevel,
} from '@/mock-data/types';

export interface MetricsPerformanceRow {
  id: string;
  level: PerformanceLevel;
  name: string;
  status: MockCampaign['status'];
  metrics: MockPerformanceMetrics;
  adAccount: MockAdAccount;
  campaignName?: string;
  adSetName?: string;
  previewMedia?: MockCreativeMedia;
}

export interface CreativeInsightRow extends MockAd {
  adSet: MockAdSet;
  campaign: MockCampaign;
  adAccount: MockAdAccount;
  previewMedia: MockCreativeMedia;
}

const adAccountsById = new Map(
  MOCK_AD_ACCOUNTS.map((adAccount) => [adAccount.id, adAccount])
);

const campaignsById = new Map(
  MOCK_CAMPAIGNS.map((campaign) => [campaign.id, campaign])
);

const adSetsById = new Map(MOCK_AD_SETS.map((adSet) => [adSet.id, adSet]));

export const CAMPAIGN_PERFORMANCE_ROWS: MetricsPerformanceRow[] =
  MOCK_CAMPAIGNS.flatMap((campaign) => {
    const adAccount = adAccountsById.get(campaign.adAccountId);

    if (!adAccount) {
      return [];
    }

    return [
      {
        id: campaign.id,
        level: 'campaign',
        name: campaign.name,
        status: campaign.status,
        metrics: campaign.metrics,
        adAccount,
      },
    ];
  });

export const AD_SET_PERFORMANCE_ROWS: MetricsPerformanceRow[] = MOCK_AD_SETS.flatMap(
  (adSet) => {
    const campaign = campaignsById.get(adSet.campaignId);

    if (!campaign) {
      return [];
    }

    const adAccount = adAccountsById.get(campaign.adAccountId);

    if (!adAccount) {
      return [];
    }

    return [
      {
        id: adSet.id,
        level: 'adSet',
        name: adSet.name,
        status: adSet.status,
        metrics: adSet.metrics,
        adAccount,
        campaignName: campaign.name,
      },
    ];
  }
);

export const CREATIVE_INSIGHT_ROWS: CreativeInsightRow[] = MOCK_ADS.flatMap((ad) => {
  const adSet = adSetsById.get(ad.adSetId);

  if (!adSet) {
    return [];
  }

  const campaign = campaignsById.get(adSet.campaignId);

  if (!campaign) {
    return [];
  }

  const adAccount = adAccountsById.get(campaign.adAccountId);

  if (!adAccount) {
    return [];
  }

  return [
    {
      ...ad,
      adSet,
      campaign,
      adAccount,
      previewMedia: ad.media[0] ?? {
        id: `${ad.id}_fallback`,
        title: ad.name,
        type: 'image',
        src: '',
        aspectRatio: '4 / 5',
      },
    },
  ];
});

export const AD_PERFORMANCE_ROWS: MetricsPerformanceRow[] = CREATIVE_INSIGHT_ROWS.map(
  (ad) => ({
    id: ad.id,
    level: 'ad',
    name: ad.name,
    status: ad.status,
    metrics: ad.metrics,
    adAccount: ad.adAccount,
    campaignName: ad.campaign.name,
    adSetName: ad.adSet.name,
    previewMedia: ad.previewMedia,
  })
);

export function getPerformanceRows(level: PerformanceLevel) {
  if (level === 'campaign') {
    return CAMPAIGN_PERFORMANCE_ROWS;
  }

  if (level === 'adSet') {
    return AD_SET_PERFORMANCE_ROWS;
  }

  return AD_PERFORMANCE_ROWS;
}

export function getMetricLabel(metricId: CoreMetricId) {
  return (
    MOCK_METRICS.find((metric) => metric.id === metricId)?.title ?? 'ROAS'
  );
}
