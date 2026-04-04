export interface MockMetricTrendPoint {
  month: string;
  ctr: number;
  impressions: number;
  reach: number;
  revenue: number;
  roas: number;
  spend: number;
}

export const MOCK_METRIC_TRENDS: MockMetricTrendPoint[] = [
  {
    month: 'Oct',
    ctr: 2.02,
    impressions: 2700000,
    reach: 1180000,
    revenue: 312400,
    roas: 2.76,
    spend: 113200,
  },
  {
    month: 'Nov',
    ctr: 2.1,
    impressions: 2890000,
    reach: 1260000,
    revenue: 329800,
    roas: 2.84,
    spend: 116000,
  },
  {
    month: 'Dec',
    ctr: 2.18,
    impressions: 3010000,
    reach: 1310000,
    revenue: 344600,
    roas: 2.91,
    spend: 118500,
  },
  {
    month: 'Jan',
    ctr: 2.27,
    impressions: 3260000,
    reach: 1390000,
    revenue: 368200,
    roas: 3.02,
    spend: 121900,
  },
  {
    month: 'Feb',
    ctr: 2.34,
    impressions: 3510000,
    reach: 1490000,
    revenue: 389900,
    roas: 3.11,
    spend: 125300,
  },
  {
    month: 'Mar',
    ctr: 2.46,
    impressions: 3800000,
    reach: 1600000,
    revenue: 412700,
    roas: 3.21,
    spend: 128400,
  },
];
