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
          '# Q1 2026 Performance Summary\n\nThe first quarter of 2026 delivered **strong momentum** across paid channels. Revenue grew steadily while CPC trended down, pointing to healthier auction dynamics and improved creative fatigue management.\n\n## Executive highlights\n\n- Revenue climbed from **$312K** in October to **$412K** in March — a 32% six-month lift.\n- CTR crossed the **2.4% threshold** for the first time in company history, sustaining that level for eight consecutive weeks.\n- Spend discipline held within budget, with pacing never exceeding 103% of plan on any campaign.\n- Blended ROAS reached **3.21x**, a 16% improvement over Q4 2025.\n\nThis report walks through the headline metrics, channel-by-channel breakdown, creative performance, and the three structural bets we made mid-quarter that compounded into the March result.',
      },
      {
        id: 'q1-roas-card',
        type: 'card',
        title: 'Blended ROAS',
        value: '3.21x',
        footer: 'Up 16% vs. last quarter',
      },
      {
        id: 'q1-revenue-card',
        type: 'card',
        title: 'Attributed Revenue',
        value: '$1.13M',
        footer: 'Three-month total',
      },
      {
        id: 'q1-spend-card',
        type: 'card',
        title: 'Total Spend',
        value: '$352.4K',
        footer: '98.7% of planned budget',
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
        id: 'q1-channel-context',
        type: 'text',
        content:
          '## Channel mix\n\nRetargeting continues to be the efficiency lever — Meta Retargeting returned **4.04x** on $22K of spend, making it the highest-ROAS channel in the portfolio. Performance Max remains the drag at **2.11x**, which is why we cut its budget allocation from 14% to 9% mid-February.',
      },
      {
        id: 'q1-channel-table',
        type: 'table',
        header: ['Channel', 'Spend', 'Revenue', 'ROAS', 'CPA'],
        rows: [
          ['Meta - Prospecting', '$54.2K', '$168.3K', '3.10x', '$42.18'],
          ['Meta - Retargeting', '$22.1K', '$89.4K', '4.04x', '$18.92'],
          ['Google - Search', '$31.8K', '$112.1K', '3.52x', '$27.44'],
          ['Google - Performance Max', '$20.3K', '$42.9K', '2.11x', '$61.07'],
          ['Google - Shopping', '$14.7K', '$52.6K', '3.58x', '$29.11'],
          ['TikTok - Prospecting', '$9.4K', '$24.1K', '2.56x', '$48.77'],
        ],
      },
      {
        id: 'q1-cpc-graph',
        type: 'graph',
        title: 'Blended CPC by Month',
        value: '$1.34',
        caption: 'Cost per click continued its downward trajectory',
        data: [
          { label: 'Oct', value: 1.62 },
          { label: 'Nov', value: 1.58 },
          { label: 'Dec', value: 1.51 },
          { label: 'Jan', value: 1.44 },
          { label: 'Feb', value: 1.38 },
          { label: 'Mar', value: 1.34 },
        ],
      },
      {
        id: 'q1-creative-context',
        type: 'text',
        content:
          '## Creative performance\n\nThe **Recovery Hero** line carried the quarter on the prospecting side, accounting for 41% of Meta spend and 38% of attributed revenue. Two out of four variants fatigued by week five — consistent with what the creative fatigue audit flagged — and the refresh cycle on March 4 recovered a full 28% of the CTR lost.\n\nThe **Summer Tease** creative set launched in week 10 and over-indexed immediately: CTR of 2.81% against a prospecting baseline of 2.12%.',
      },
      {
        id: 'q1-creative-table',
        type: 'table',
        header: ['Creative Set', 'Spend', 'CTR', 'CVR', 'ROAS'],
        rows: [
          ['Recovery Hero', '$31.8K', '2.34%', '3.12%', '3.28x'],
          ['Always-On Brand', '$24.1K', '1.98%', '2.76%', '2.91x'],
          ['Summer Tease', '$12.6K', '2.81%', '3.44%', '3.71x'],
          ['Evergreen Retargeting', '$18.9K', '3.12%', '4.88%', '4.11x'],
          ['Holiday Carryover', '$8.2K', '1.42%', '1.98%', '1.89x'],
        ],
      },
      {
        id: 'q1-closing',
        type: 'text',
        content:
          '## Outlook into Q2\n\nThe momentum is real, but two risks are worth naming:\n\n1. **Auction inflation** — Meta CPMs have crept up 6% month-over-month for the last three months. If that continues, our efficiency gains erode.\n2. **Creative pipeline depth** — we are running thin on high-performing concepts. Recommend kicking off a new shoot by the second week of April.\n\nAll told, Q1 ended 16% ahead of plan on revenue and 11% ahead on ROAS. We recommend holding budget flat in April while the new creative pipeline fills.',
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
        id: 'cf-intro',
        type: 'text',
        content:
          '# Creative Fatigue Audit\n\n_Covering the eight-week flight window from January 27 to March 23, 2026._\n\nThis audit was commissioned after the creative team flagged softening engagement metrics in mid-March. The goal: quantify how quickly our current ad library is decaying, which audience segments feel the decay fastest, and what rotation cadence will sustain healthy CTR going forward.\n\n**Top-line finding:** creative fatigue is concentrated in retargeting audiences and kicks in sharply between weeks 4 and 5. Prospecting audiences decay more gradually but never fully recover without a refresh.',
      },
      {
        id: 'cf-ctr-card',
        type: 'card',
        title: 'CTR Decay, Week 1 → Week 8',
        value: '-38%',
        footer: 'Weighted across top five retargeting audiences',
      },
      {
        id: 'cf-freq-card',
        type: 'card',
        title: 'Average Frequency at Week 8',
        value: '11.4',
        footer: 'Up from 4.2 at week 1',
      },
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
        id: 'cf-analysis',
        type: 'text',
        content:
          '## Fatigue is kicking in by week 5\n\nCTR drops ~38% between week 1 and week 8 across the top retargeting audiences. Frequency caps aren\'t keeping the library fresh. The audience is seeing the same three hero assets an average of **11.4 times** by week eight — well past the point where incremental exposure produces any lift.\n\nNotably, the decay is not linear. Weeks 1-3 lose roughly 9% of their CTR. Weeks 3-5 lose another 22%. After week 5, CTR plateaus — not because the creative is working, but because only the most engaged sliver of the audience is still clicking.',
      },
      {
        id: 'cf-freq-graph',
        type: 'graph',
        title: 'Frequency by Week',
        caption: 'Impressions per unique user, cumulative',
        data: [
          { label: 'W1', value: 4.2 },
          { label: 'W2', value: 5.8 },
          { label: 'W3', value: 7.1 },
          { label: 'W4', value: 8.4 },
          { label: 'W5', value: 9.3 },
          { label: 'W6', value: 10.1 },
          { label: 'W7', value: 10.8 },
          { label: 'W8', value: 11.4 },
        ],
      },
      {
        id: 'cf-action-table',
        type: 'table',
        header: ['Ad', 'Status', 'CTR', 'Frequency', 'Suggested Action'],
        rows: [
          ['Recovery Hero 01', 'Fatigued', '1.21%', '12.8', 'Retire'],
          ['Recovery Hero 02', 'Healthy', '2.48%', '6.1', 'Keep live'],
          ['Summer Launch A', 'Fatigued', '1.09%', '11.4', 'Retire'],
          ['Summer Launch B', 'Healthy', '2.62%', '5.7', 'Scale budget'],
          ['Evergreen Carousel 03', 'Watch', '1.78%', '8.9', 'Pause for 14 days'],
          ['UGC Reel 07', 'Healthy', '2.94%', '4.8', 'Expand placements'],
          ['Testimonial 02', 'Fatigued', '1.32%', '10.2', 'Retire'],
        ],
      },
      {
        id: 'cf-audience-text',
        type: 'text',
        content:
          '## By audience segment\n\nRetargeting fatigues fastest — the audience pool is smaller, frequency climbs quickly, and novelty is already exhausted. Prospecting audiences can sustain a longer flight window but still benefit from a rotation every four weeks.\n\nLookalike audiences sit in the middle: they share behavioral traits with converters, which makes them respond well to proven creative, but that same overlap means they fatigue on a similar curve to retargeting once frequency climbs past 7.',
      },
      {
        id: 'cf-audience-table',
        type: 'table',
        header: ['Audience Type', 'Fatigue Onset', 'Recommended Rotation'],
        rows: [
          ['Retargeting - 7D', 'Week 3', 'Every 2 weeks'],
          ['Retargeting - 30D', 'Week 4', 'Every 3 weeks'],
          ['Lookalike 1%', 'Week 5', 'Every 3 weeks'],
          ['Lookalike 3%', 'Week 6', 'Every 4 weeks'],
          ['Interest - Broad', 'Week 7', 'Every 4 weeks'],
          ['Broad (no targeting)', 'Week 8+', 'Every 5 weeks'],
        ],
      },
      {
        id: 'cf-recommendations',
        type: 'text',
        content:
          '## Recommendations\n\n1. **Retire four fatigued assets immediately** — they are costing us $1.40 CPC against a portfolio average of $1.12.\n2. **Introduce two new concepts into the prospecting rotation** by April 6 at the latest. The current pipeline has five concepts in production; prioritize the two with testimonial angles.\n3. **Lower retargeting frequency cap** from "auto" to an explicit 4 impressions / 7 days for the 7D retargeting audience.\n4. **Establish a rotation calendar** — creative team to commit to a new hero asset every three weeks per active prospecting set, four weeks per retargeting set.\n\nImplementing these four changes should recover the ~38% CTR gap and buy us another 6-8 weeks of efficient delivery before the next refresh cycle is required.',
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
        id: 'audience-intro',
        type: 'text',
        content:
          '# Audience Insights\n\n_A month-over-month look at who is actually seeing, clicking, and converting on our paid placements._\n\nThis report cross-references impression data from Meta and Google with first-party purchase data to answer three questions:\n\n1. Who are we reaching?\n2. Who is converting?\n3. Where are the biggest gaps between those two groups?',
      },
      {
        id: 'audience-reach-card',
        type: 'card',
        title: 'Unique Reach',
        value: '1.6M',
        footer: 'Across Meta + Google this month',
      },
      {
        id: 'audience-impressions-card',
        type: 'card',
        title: 'Total Impressions',
        value: '3.6M',
        footer: 'Avg. 2.25 impressions per reached user',
      },
      {
        id: 'audience-text',
        type: 'text',
        content:
          '## Who are we actually reaching?\n\nThe **25-34** cohort continues to carry delivery — 34% of all impressions — but **35-44** shows the strongest ROAS lift at **3.84x**. That is 22% above the portfolio blended ROAS. Worth a dedicated split in next month\'s ad sets.\n\nThe **55+** cohort, while only 8% of impressions, converts at the highest CVR (4.1%) of any age group. This is the surprise finding of the report.',
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
      {
        id: 'audience-roas-graph',
        type: 'graph',
        title: 'ROAS by Age Cohort',
        value: '3.84x',
        caption: '35-44 is punching well above its impression share',
        data: [
          { label: '18-24', value: 2.12 },
          { label: '25-34', value: 3.04 },
          { label: '35-44', value: 3.84 },
          { label: '45-54', value: 3.41 },
          { label: '55+', value: 2.98 },
        ],
      },
      {
        id: 'audience-gender-text',
        type: 'text',
        content:
          '## Gender split\n\nDelivery skews **58% female / 41% male / 1% unspecified**, but revenue skews even further female at 64%. Male ROAS has been trending down for three consecutive months and is now at 2.44x, below the 2.8x portfolio floor we use to flag underperformance.',
      },
      {
        id: 'audience-gender-table',
        type: 'table',
        header: ['Gender', 'Impressions', 'Revenue', 'ROAS'],
        rows: [
          ['Female', '2.1M', '$264K', '3.51x'],
          ['Male', '1.5M', '$148K', '2.44x'],
          ['Unspecified', '36K', '$4.1K', '3.02x'],
        ],
      },
      {
        id: 'audience-geo-text',
        type: 'text',
        content:
          '## Geographic concentration\n\nCalifornia, Texas, New York, and Florida account for **48% of revenue** despite only 32% of impressions. Efficiency is highest in Illinois and Washington — both over-deliver on ROAS relative to impression share.',
      },
      {
        id: 'audience-geo-table',
        type: 'table',
        header: ['State', 'Impressions', 'Revenue', 'ROAS'],
        rows: [
          ['California', '540K', '$78.2K', '3.71x'],
          ['Texas', '410K', '$52.4K', '3.12x'],
          ['New York', '320K', '$41.1K', '3.28x'],
          ['Florida', '290K', '$35.6K', '2.94x'],
          ['Illinois', '180K', '$28.9K', '3.88x'],
          ['Washington', '140K', '$22.3K', '3.91x'],
        ],
      },
      {
        id: 'audience-conclusion',
        type: 'text',
        content:
          '## Implications for April\n\n- **Split out the 35-44 cohort** into its own ad set with 20% more budget.\n- **Reduce bid modifiers** for the 18-24 cohort — they are the largest share of impressions with the lowest ROAS.\n- **Test a 55+ creative angle** — higher CVR suggests this group is under-served by current creative.\n- **Geo-modifier increase** for Illinois and Washington campaigns.',
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
          '# Weekly Digest\n\n_Week of April 6 - April 12, 2026_\n\nThis week\'s headline: **retargeting ROAS crossed 4x** for the first time since launch. Prospecting held steady, and we moved $8K from Performance Max into Search.\n\n**Top wins**\n1. Retargeting ROAS at 4.04x\n2. New Summer Launch B scaled past daily cap three days in a row\n3. CPC down 4% week over week\n\n**Watch list**\n- Performance Max efficiency (2.11x, dragging blended)\n- Fatigue on Recovery Hero 01 (flagged in audit, now actioned)',
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
      {
        id: 'digest-roas-card',
        type: 'card',
        title: 'Blended ROAS',
        value: '3.30x',
        footer: '+0.09 vs. last week',
      },
      {
        id: 'digest-daily-graph',
        type: 'graph',
        title: 'Daily Spend',
        caption: 'Apr 6 – Apr 12',
        data: [
          { label: 'Mon', value: 4.2 },
          { label: 'Tue', value: 4.6 },
          { label: 'Wed', value: 4.4 },
          { label: 'Thu', value: 4.8 },
          { label: 'Fri', value: 4.9 },
          { label: 'Sat', value: 4.3 },
          { label: 'Sun', value: 4.4 },
        ],
      },
      {
        id: 'digest-table',
        type: 'table',
        header: ['Campaign', 'Spend', 'Revenue', 'ROAS'],
        rows: [
          ['Meta - Retargeting', '$6.1K', '$24.6K', '4.04x'],
          ['Meta - Prospecting', '$11.8K', '$34.8K', '2.95x'],
          ['Google - Search', '$8.2K', '$29.1K', '3.55x'],
          ['Google - Performance Max', '$3.4K', '$7.2K', '2.12x'],
          ['Google - Shopping', '$2.1K', '$8.5K', '4.05x'],
        ],
      },
      {
        id: 'digest-next-text',
        type: 'text',
        content:
          '## Looking ahead to next week\n\n- Launch two new Summer Tease variants (shipping Monday, Apr 13).\n- Continue the Performance Max → Search budget rotation; another $5K moving Tuesday.\n- Review the 55+ audience test from the insights report — first read by Friday.',
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
        id: 'platform-intro',
        type: 'text',
        content:
          '# Meta vs. Google Deep Dive\n\nA side-by-side look at our two primary paid channels across Q4 2025 and the first six weeks of Q1 2026. The intent: decide whether our 59/41 Meta/Google split still makes sense going into Q2 or whether the mix should shift.\n\n**Spoiler:** the split should stay roughly where it is, but the reasoning is more nuanced than a simple ROAS comparison would suggest.',
      },
      {
        id: 'platform-meta-card',
        type: 'card',
        title: 'Meta ROAS',
        value: '3.38x',
        footer: 'Blended across prospecting + retargeting',
      },
      {
        id: 'platform-google-card',
        type: 'card',
        title: 'Google ROAS',
        value: '2.98x',
        footer: 'Blended across Search + PMax + Shopping',
      },
      {
        id: 'platform-table',
        type: 'table',
        header: ['Platform', 'Spend', 'Revenue', 'ROAS', 'CPC', 'CVR'],
        rows: [
          ['Meta', '$76.3K', '$257.7K', '3.38x', '$1.12', '2.94%'],
          ['Google', '$52.1K', '$155.0K', '2.98x', '$1.68', '3.78%'],
        ],
      },
      {
        id: 'platform-text',
        type: 'text',
        content:
          '## Meta keeps the edge on efficiency\n\nMeta is outperforming Google on both **ROAS** and **CPC** this quarter. Google wins on **CVR** (3.78% vs. 2.94%) — which tracks, since Google traffic is high-intent search traffic rather than interrupt-based discovery.\n\nThe question isn\'t "which platform is better" — they serve different roles. Meta is our top-of-funnel demand generator. Google captures existing intent. Pulling from Google would shrink our capture rate; pulling from Meta would shrink the funnel itself.',
      },
      {
        id: 'platform-graph',
        type: 'graph',
        title: 'Blended ROAS by Month',
        value: '3.21x',
        caption: 'Blended monthly ROAS across both platforms',
        data: [
          { label: 'Oct', value: 2.76 },
          { label: 'Nov', value: 2.84 },
          { label: 'Dec', value: 2.91 },
          { label: 'Jan', value: 3.02 },
          { label: 'Feb', value: 3.11 },
          { label: 'Mar', value: 3.21 },
        ],
      },
      {
        id: 'platform-meta-graph',
        type: 'graph',
        title: 'Meta ROAS by Month',
        value: '3.38x',
        caption: 'Meta trending ahead of blended average',
        data: [
          { label: 'Oct', value: 2.92 },
          { label: 'Nov', value: 3.01 },
          { label: 'Dec', value: 3.09 },
          { label: 'Jan', value: 3.18 },
          { label: 'Feb', value: 3.29 },
          { label: 'Mar', value: 3.38 },
        ],
      },
      {
        id: 'platform-google-graph',
        type: 'graph',
        title: 'Google ROAS by Month',
        value: '2.98x',
        caption: 'Google lagging but stable — PMax is the drag',
        data: [
          { label: 'Oct', value: 2.54 },
          { label: 'Nov', value: 2.61 },
          { label: 'Dec', value: 2.68 },
          { label: 'Jan', value: 2.79 },
          { label: 'Feb', value: 2.88 },
          { label: 'Mar', value: 2.98 },
        ],
      },
      {
        id: 'platform-placement-text',
        type: 'text',
        content:
          '## Placement breakdown\n\nOn Meta, **Reels** surged this quarter — now 31% of Meta spend and growing. Stories delivery has declined as Meta\'s own algorithm shifts inventory toward Reels. On Google, **Search** remains the workhorse at 61% of spend, with Shopping over-indexing on ROAS (3.58x).',
      },
      {
        id: 'platform-placement-table',
        type: 'table',
        header: ['Placement', 'Spend Share', 'Revenue Share', 'ROAS'],
        rows: [
          ['Meta - Feed', '38%', '36%', '3.21x'],
          ['Meta - Reels', '31%', '34%', '3.71x'],
          ['Meta - Stories', '18%', '17%', '3.19x'],
          ['Meta - Audience Network', '13%', '13%', '3.38x'],
          ['Google - Search', '61%', '65%', '3.52x'],
          ['Google - Shopping', '21%', '25%', '3.58x'],
          ['Google - PMax', '18%', '10%', '2.11x'],
        ],
      },
      {
        id: 'platform-recommendations',
        type: 'text',
        content:
          '## Recommendations going into Q2\n\n1. **Hold the Meta/Google split at ~60/40.** The channels are complementary, not substitutes.\n2. **Tilt Meta toward Reels** — already happening organically, but lean in with a creative brief built for vertical video.\n3. **Cap Performance Max at 15% of Google spend.** It has never outperformed Search in the six months we\'ve measured, and the opacity of the placement data is becoming a planning liability.\n4. **Test YouTube Shorts** as a Meta Reels analog — budget $5K/week for four weeks starting mid-Q2.',
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
        id: 'pace-intro',
        type: 'text',
        content:
          '# Budget Pacing Check-In\n\n_As of end-of-day April 7, 2026 (day 8 of a 30-day April cycle)._\n\nThis check-in covers campaign-level pacing against the April budget allocations approved on March 28. All campaigns are within the ±10% variance tolerance with one exception — **Recovery Launch**, which is pacing at 105%.',
      },
      {
        id: 'pace-card',
        type: 'card',
        title: 'Month-to-Date Pacing',
        value: '94%',
        footer: 'On track through April 8',
      },
      {
        id: 'pace-spent-card',
        type: 'card',
        title: 'Spend to Date',
        value: '$44.0K',
        footer: 'Of $47.0K planned for first 8 days',
      },
      {
        id: 'pace-projected-card',
        type: 'card',
        title: 'Projected EOM Spend',
        value: '$166K',
        footer: 'Plan: $176K (tracking 5.7% under)',
      },
      {
        id: 'pace-daily-graph',
        type: 'graph',
        title: 'Daily Spend vs. Pace Line',
        caption: 'Daily spend so far in April',
        data: [
          { label: 'Apr 1', value: 5.6 },
          { label: 'Apr 2', value: 5.4 },
          { label: 'Apr 3', value: 5.2 },
          { label: 'Apr 4', value: 5.8 },
          { label: 'Apr 5', value: 5.1 },
          { label: 'Apr 6', value: 5.9 },
          { label: 'Apr 7', value: 5.4 },
          { label: 'Apr 8', value: 5.6 },
        ],
      },
      {
        id: 'pace-table',
        type: 'table',
        header: ['Campaign', 'Budget', 'Spent', 'Pacing', 'Status'],
        rows: [
          ['Always-On Brand', '$18.0K', '$16.9K', '94%', 'On track'],
          ['Recovery Launch', '$12.0K', '$12.6K', '105%', 'Watch'],
          ['Summer Tease', '$8.0K', '$6.1K', '76%', 'Under'],
          ['Search - Core', '$9.0K', '$8.4K', '93%', 'On track'],
          ['Retargeting - 7D', '$6.5K', '$6.2K', '95%', 'On track'],
          ['Shopping Feed', '$4.5K', '$4.1K', '91%', 'On track'],
        ],
      },
      {
        id: 'pace-analysis',
        type: 'text',
        content:
          '## Campaign-level notes\n\n**Recovery Launch** is 5% over because the algorithm found cheap inventory in the first weekend and Meta auto-spent into the extra opportunity. We\'re within the 110% auto-adjust threshold so no action needed yet — revisit Apr 15.\n\n**Summer Tease** is under-pacing at 76% because we held back mid-week to wait for the two new creative variants. Budget will catch up once those ship April 13.\n\nAll other campaigns are within 6 points of their pace line. No corrective action recommended this week.',
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
          '# Executive Overview\n\n_A high-level snapshot for the leadership team, covering revenue, spend, efficiency, and brand health across all paid channels._\n\nThis overview is intended as a single-page reference for the board meeting. Detailed channel-level analysis lives in the companion Q1 Performance Summary report.\n\n## Key themes this period\n\n- **Revenue growth** of 32% year over year — the strongest six-month stretch since the Series A.\n- **Efficient scale** — CPA down 11% despite higher volume, with ROAS up 16% quarter over quarter.\n- **Brand health** — awareness lift studies trending positive, with aided awareness up 4 points in the target demo.\n- **Channel diversification** — TikTok now contributes 4% of paid revenue, up from 0% six months ago.',
      },
      {
        id: 'exec-revenue-card',
        type: 'card',
        title: 'Total Revenue',
        value: '$412.7K',
        footer: '+15.9% vs. prior period',
      },
      {
        id: 'exec-cpa-card',
        type: 'card',
        title: 'Blended CPA',
        value: '$38.42',
        footer: 'Down 11% vs. Q4 2025',
      },
      {
        id: 'exec-aware-card',
        type: 'card',
        title: 'Aided Awareness',
        value: '+4 pts',
        footer: 'In target 25-44 cohort',
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
      {
        id: 'exec-summary-table',
        type: 'table',
        header: ['Metric', 'Q4 2025', 'Q1 2026', 'Change'],
        rows: [
          ['Revenue', '$987K', '$1.13M', '+14.8%'],
          ['Spend', '$338K', '$352K', '+4.1%'],
          ['ROAS', '2.92x', '3.21x', '+9.9%'],
          ['CPA', '$43.16', '$38.42', '-11.0%'],
          ['Unique Reach', '4.1M', '4.8M', '+17.1%'],
        ],
      },
      {
        id: 'exec-closing',
        type: 'text',
        content:
          '## Board-level ask\n\nWe are recommending a **15% budget lift for Q2** targeted at Meta Reels and Google Search. Modeling suggests this produces an incremental $142K in Q2 revenue at a marginal ROAS of 2.7x — above our 2.5x threshold for incremental spend. Full proposal in the companion memo.',
      },
    ],
  },
];

export function getReports() {
  return MOCK_REPORTS;
}

export function getReport(reportId: string) {
  return MOCK_REPORTS.find((report) => report.id === reportId);
}
