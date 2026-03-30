export interface PresetGroup {
  id: string;
  heading: string;
  prompts: string[];
}

export const PRESET_GROUPS: PresetGroup[] = [
  {
    id: 'performance',
    heading: 'Performance',
    prompts: [
      'Summarize the top 3 campaign performance shifts from the last 7 days.',
      'Which ad sets are spending efficiently but still have room to scale?',
      'Compare this week vs last week and explain the biggest KPI changes.',
      'Find the campaigns with the strongest ROAS trend and tell me why.',
    ],
  },
  {
    id: 'creative',
    heading: 'Creative',
    prompts: [
      'Which creatives are driving the highest CTR right now?',
      'Group our ads by hook angle and identify the best-performing themes.',
      'Spot creative fatigue signals and recommend what to refresh first.',
      'Write 4 new ad concepts inspired by our current top performers.',
    ],
  },
  {
    id: 'audience',
    heading: 'Audience',
    prompts: [
      'Which audiences are converting best across our active campaigns?',
      'Highlight audience overlaps that may be causing inefficiency.',
      'Break down top audiences by CPA, CTR, and conversion rate.',
      'Suggest 4 new audience tests based on our recent results.',
    ],
  },
  {
    id: 'growth',
    heading: 'Growth',
    prompts: [
      'Give me a scale plan for the campaigns that are performing best.',
      'What are the fastest opportunities to improve spend efficiency this week?',
      'Identify underfunded winners that deserve more budget.',
      'Create a 7-day optimization checklist to unlock more growth.',
    ],
  },
  {
    id: 'reporting',
    heading: 'Reporting',
    prompts: [
      'Draft an executive summary of account performance for leadership.',
      'Turn the latest campaign data into a concise weekly report.',
      'List the biggest wins, losses, and next actions from this month.',
      'Write a client-ready update with insights, risks, and recommendations.',
    ],
  },
];

export const DEFAULT_PRESET_ID = PRESET_GROUPS[0]?.id ?? '';
