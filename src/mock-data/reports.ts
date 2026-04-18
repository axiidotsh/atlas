export type ReportStatus = 'private' | 'public';

export interface ReportTextBlock {
  id: string;
  type: 'text';
  content: string;
}

export interface ReportGraphDataPoint {
  label: string;
  value: number;
}

export interface ReportGraphBlock {
  id: string;
  type: 'graph';
  title: string;
  value?: string;
  caption?: string;
  data: ReportGraphDataPoint[];
}

export interface ReportCardBlock {
  id: string;
  type: 'card';
  title: string;
  value: string;
  footer?: string;
}

export interface ReportTableBlock {
  id: string;
  type: 'table';
  header: string[];
  rows: string[][];
}

export type ReportBlock =
  | ReportTextBlock
  | ReportGraphBlock
  | ReportCardBlock
  | ReportTableBlock;

export interface MockReport {
  id: string;
  title: string;
  status: ReportStatus;
  createdAt: string;
  sharePath?: string;
  blocks: ReportBlock[];
}

export const MOCK_REPORTS: MockReport[] = [
  {
    id: 'report-q1-performance',
    title: 'Q1 Performance Summary',
    status: 'public',
    createdAt: '2026-04-02T10:00:00.000Z',
    sharePath: '/share/reports/report-q1-performance',
    blocks: [
      {
        id: 'q1-intro',
        type: 'text',
        content:
          '# Q1 Performance Summary\n\nThe first quarter of 2026 delivered **strong momentum** across paid channels. Revenue grew steadily while CPC trended down, pointing to healthier auction dynamics and improved creative fatigue management.\n\n- Revenue climbed from $312K to $412K\n- CTR crossed the 2.4% threshold for the first time\n- Spend discipline held within budget',
      },
      {
        id: 'q1-roas-card',
        type: 'card',
        title: 'Blended ROAS',
        value: '3.21x',
        footer: 'Up 16% vs. last quarter',
      },
      {
        id: 'q1-revenue-graph',
        type: 'graph',
        title: 'Revenue Trajectory',
        value: '$412.7K',
        caption: 'Attributed revenue by month',
        data: [
          { label: 'Oct', value: 312400 },
          { label: 'Nov', value: 329800 },
          { label: 'Dec', value: 344600 },
          { label: 'Jan', value: 368200 },
          { label: 'Feb', value: 389900 },
          { label: 'Mar', value: 412700 },
        ],
      },
      {
        id: 'q1-channel-table',
        type: 'table',
        header: ['Channel', 'Spend', 'Revenue', 'ROAS'],
        rows: [
          ['Meta - Prospecting', '$54.2K', '$168.3K', '3.10x'],
          ['Meta - Retargeting', '$22.1K', '$89.4K', '4.04x'],
          ['Google - Search', '$31.8K', '$112.1K', '3.52x'],
          ['Google - Performance Max', '$20.3K', '$42.9K', '2.11x'],
        ],
      },
    ],
  },
  {
    id: 'report-creative-fatigue',
    title: 'Creative Fatigue Audit',
    status: 'private',
    createdAt: '2026-03-28T14:15:00.000Z',
    blocks: [
      {
        id: 'cf-graph',
        type: 'graph',
        title: 'CTR by Ad Age',
        value: '-38%',
        caption: 'Click-through decay across 8 weeks in-flight',
        data: [
          { label: 'W1', value: 2.8 },
          { label: 'W2', value: 2.6 },
          { label: 'W3', value: 2.3 },
          { label: 'W4', value: 2.0 },
          { label: 'W5', value: 1.8 },
          { label: 'W6', value: 1.7 },
          { label: 'W7', value: 1.74 },
          { label: 'W8', value: 1.73 },
        ],
      },
      {
        id: 'cf-intro',
        type: 'text',
        content:
          '## Fatigue is kicking in by week 5\n\nCTR drops ~38% between week 1 and week 8 across the top retargeting audiences. Frequency caps aren\'t keeping the library fresh. Recommend rotating hero creative every 3 weeks and introducing two new concepts into the prospecting set this sprint.',
      },
      {
        id: 'cf-action-table',
        type: 'table',
        header: ['Ad', 'Status', 'CTR', 'Suggested Action'],
        rows: [
          ['Recovery Hero 01', 'Fatigued', '1.21%', 'Retire'],
          ['Recovery Hero 02', 'Healthy', '2.48%', 'Keep live'],
          ['Summer Launch A', 'Fatigued', '1.09%', 'Retire'],
          ['Summer Launch B', 'Healthy', '2.62%', 'Scale budget'],
        ],
      },
    ],
  },
  {
    id: 'report-audience-insights',
    title: 'Audience Insights',
    status: 'public',
    createdAt: '2026-03-20T09:30:00.000Z',
    sharePath: '/share/reports/report-audience-insights',
    blocks: [
      {
        id: 'audience-reach-card',
        type: 'card',
        title: 'Unique Reach',
        value: '1.6M',
        footer: 'Across Meta + Google this month',
      },
      {
        id: 'audience-text',
        type: 'text',
        content:
          '### Who are we actually reaching?\n\nThe **25-34** cohort continues to carry delivery, but **35-44** shows the strongest ROAS lift. Worth a dedicated split in next month\'s ad sets.',
      },
      {
        id: 'audience-graph',
        type: 'graph',
        title: 'Impressions by Age Cohort',
        caption: 'Monthly impressions across age buckets',
        data: [
          { label: '18-24', value: 480000 },
          { label: '25-34', value: 1240000 },
          { label: '35-44', value: 980000 },
          { label: '45-54', value: 610000 },
          { label: '55+', value: 290000 },
        ],
      },
    ],
  },
  {
    id: 'report-weekly-digest',
    title: 'Weekly Digest - Apr 12',
    status: 'private',
    createdAt: '2026-04-12T08:00:00.000Z',
    blocks: [
      {
        id: 'digest-intro',
        type: 'text',
        content:
          '# Weekly Digest\n\n_Week of April 6 - April 12, 2026_\n\nThis week\'s headline: **retargeting ROAS crossed 4x** for the first time since launch. Prospecting held steady, and we moved $8K from Performance Max into Search.\n\n**Top wins**\n1. Retargeting ROAS at 4.04x\n2. New Summer Launch B scaled past daily cap\n3. CPC down 4% week over week\n\n**Watch list**\n- Performance Max efficiency (2.11x, dragging blended)\n- Fatigue on Recovery Hero 01',
      },
      {
        id: 'digest-spend-card',
        type: 'card',
        title: 'Spend This Week',
        value: '$31.6K',
        footer: 'Within plan (-1.8%)',
      },
      {
        id: 'digest-revenue-card',
        type: 'card',
        title: 'Revenue This Week',
        value: '$104.2K',
        footer: '+6.3% vs. last week',
      },
    ],
  },
  {
    id: 'report-platform-comparison',
    title: 'Meta vs. Google Deep Dive',
    status: 'public',
    createdAt: '2026-02-14T16:45:00.000Z',
    sharePath: '/share/reports/report-platform-comparison',
    blocks: [
      {
        id: 'platform-table',
        type: 'table',
        header: ['Platform', 'Spend', 'Revenue', 'ROAS', 'CPC'],
        rows: [
          ['Meta', '$76.3K', '$257.7K', '3.38x', '$1.12'],
          ['Google', '$52.1K', '$155.0K', '2.98x', '$1.68'],
        ],
      },
      {
        id: 'platform-text',
        type: 'text',
        content:
          '## Meta keeps the edge on efficiency\n\nMeta is outperforming Google on both **ROAS** and **CPC** this quarter. Google wins on incremental reach and qualified search intent, so we aren\'t pulling budget — but Meta is where incremental dollars compound fastest right now.',
      },
      {
        id: 'platform-graph',
        type: 'graph',
        title: 'ROAS by Month',
        value: '3.21x',
        caption: 'Blended monthly ROAS',
        data: [
          { label: 'Oct', value: 2.76 },
          { label: 'Nov', value: 2.84 },
          { label: 'Dec', value: 2.91 },
          { label: 'Jan', value: 3.02 },
          { label: 'Feb', value: 3.11 },
          { label: 'Mar', value: 3.21 },
        ],
      },
    ],
  },
  {
    id: 'report-budget-pacing',
    title: 'Budget Pacing Check-In',
    status: 'private',
    createdAt: '2026-04-08T11:20:00.000Z',
    blocks: [
      {
        id: 'pace-card',
        type: 'card',
        title: 'Month-to-Date Pacing',
        value: '94%',
        footer: 'On track through April 8',
      },
      {
        id: 'pace-table',
        type: 'table',
        header: ['Campaign', 'Budget', 'Spent', 'Pacing'],
        rows: [
          ['Always-On Brand', '$18.0K', '$16.9K', '94%'],
          ['Recovery Launch', '$12.0K', '$12.6K', '105%'],
          ['Summer Tease', '$8.0K', '$6.1K', '76%'],
          ['Search - Core', '$9.0K', '$8.4K', '93%'],
        ],
      },
    ],
  },
  {
    id: 'report-exec-overview',
    title: 'Executive Overview',
    status: 'public',
    createdAt: '2026-01-09T12:00:00.000Z',
    sharePath: '/share/reports/report-exec-overview',
    blocks: [
      {
        id: 'exec-text',
        type: 'text',
        content:
          '# Executive Overview\n\nA high-level snapshot for the leadership team, covering revenue, spend, and efficiency across all paid channels.\n\nKey themes this period:\n- **Revenue growth** of 32% year over year\n- **Efficient scale** — CPA down 11% despite higher volume\n- **Brand health** — awareness lift studies trending positive',
      },
      {
        id: 'exec-revenue-card',
        type: 'card',
        title: 'Total Revenue',
        value: '$412.7K',
        footer: '+15.9% vs. prior period',
      },
      {
        id: 'exec-graph',
        type: 'graph',
        title: 'Spend vs. Revenue',
        caption: 'Monthly trajectory of paid investment vs. attributed revenue',
        data: [
          { label: 'Oct', value: 312400 },
          { label: 'Nov', value: 329800 },
          { label: 'Dec', value: 344600 },
          { label: 'Jan', value: 368200 },
          { label: 'Feb', value: 389900 },
          { label: 'Mar', value: 412700 },
        ],
      },
    ],
  },
];

export function getReports() {
  return MOCK_REPORTS;
}
