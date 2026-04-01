import type { MockChat } from '@/mock-data/types';

export const MOCK_CHATS: MockChat[] = [
  {
    id: '1',
    title: 'Q2 launch checklist',
    messages: [
      {
        id: '1-user-1',
        role: 'user',
        content: 'Build me a launch checklist for the Q2 performance campaign rollout.',
      },
      {
        id: '1-assistant-1',
        role: 'assistant',
        content:
          'I would break it into tracking, creative QA, budget pacing, audience validation, and post-launch monitoring so the team can move in order.',
      },
      {
        id: '1-user-2',
        role: 'user',
        content: 'Make that more useful for a team working across Meta and Google.',
      },
      {
        id: '1-assistant-2',
        role: 'assistant',
        content:
          'I would add channel-specific checks for conversion actions, UTMs, naming consistency, and approval status so both platforms are covered before launch.',
      },
    ],
  },
  {
    id: '2',
    title: 'Fixing the auth callback bug',
    messages: [
      {
        id: '2-user-1',
        role: 'user',
        content: 'The auth callback is looping after Google sign-in. Help me narrow it down.',
      },
      {
        id: '2-assistant-1',
        role: 'assistant',
        content:
          'The first things I would inspect are callback URL mismatches, cookie scope, and whether middleware is catching the provider return route.',
      },
      {
        id: '2-user-2',
        role: 'user',
        content: 'The loop only happens in staging.',
      },
      {
        id: '2-user-3',
        role: 'user',
        content: 'Local works fine with the same provider config.',
      },
      {
        id: '2-assistant-2',
        role: 'assistant',
        content:
          'That makes environment-specific host settings the most likely cause, especially callback origins, secure-cookie behavior, and proxy headers in staging.',
      },
    ],
  },
  {
    id: '3',
    title: 'Homepage hero copy ideas for the new marketing push',
    messages: [
      {
        id: '3-user-1',
        role: 'user',
        content: 'Give me a few sharper hero copy options for the homepage refresh.',
      },
      {
        id: '3-assistant-1',
        role: 'assistant',
        content:
          'I would test one direction around attribution clarity, one around creative speed, and one around better spend decisions for growth teams.',
      },
      {
        id: '3-user-2',
        role: 'user',
        content: 'Keep them short and a little more premium.',
      },
      {
        id: '3-assistant-2',
        role: 'assistant',
        content:
          'A tighter premium set could be "See what moves revenue", "Creative that earns its budget", and "Clarity for every media decision."',
      },
    ],
  },
  {
    id: '4',
    title: 'Weekly metrics review',
    messages: [
      {
        id: '4-user-1',
        role: 'user',
        content: 'Summarize the biggest changes from this week’s paid media performance.',
      },
      {
        id: '4-assistant-1',
        role: 'assistant',
        content:
          'The strongest movement is higher click-through on prospecting, softer blended ROAS on remarketing, and a clear spend shift toward the best creative cluster.',
      },
      {
        id: '4-user-2',
        role: 'user',
        content: 'Turn that into a short note I can drop into Slack.',
      },
      {
        id: '4-assistant-2',
        role: 'assistant',
        content:
          'This week we saw stronger top-of-funnel engagement, weaker remarketing efficiency, and more spend concentrating behind the leading creative set.',
      },
    ],
  },
  {
    id: '5',
    title: 'Prisma migration rollback plan after the staging failure',
    messages: [
      {
        id: '5-user-1',
        role: 'user',
        content: 'I need a rollback plan for the Prisma migration that failed in staging.',
      },
      {
        id: '5-assistant-1',
        role: 'assistant',
        content:
          'Freeze deploys, snapshot the database, revert app code that depends on the new schema, and only then apply the rollback or restore path.',
      },
      {
        id: '5-user-2',
        role: 'user',
        content: 'Assume the migration partially applied.',
      },
      {
        id: '5-assistant-2',
        role: 'assistant',
        content:
          'In that case I would compare the live schema to the expected state first, document each partial change, and avoid a blind rollback until data safety is confirmed.',
      },
    ],
  },
  {
    id: '6',
    title: 'Drafting the customer update',
    messages: [
      {
        id: '6-user-1',
        role: 'user',
        content: 'Write a customer update about the delayed feature release without sounding defensive.',
      },
      {
        id: '6-assistant-1',
        role: 'assistant',
        content:
          'I would keep the tone transparent, explain that quality concerns changed the schedule, and give a concrete next window plus what is still shipping.',
      },
      {
        id: '6-user-2',
        role: 'user',
        content: 'Make it suitable for enterprise customers.',
      },
      {
        id: '6-assistant-2',
        role: 'assistant',
        content:
          'I would use more direct operational language, emphasize stability and validation, and avoid casual phrasing so it feels credible for enterprise stakeholders.',
      },
    ],
  },
  {
    id: '7',
    title: 'Design feedback for the sidebar',
    messages: [
      {
        id: '7-user-1',
        role: 'user',
        content: 'Review the sidebar and tell me what still feels off.',
      },
      {
        id: '7-assistant-1',
        role: 'assistant',
        content:
          'The primary structure works, but the recent chats section could use stronger active-state contrast and slightly clearer grouping from the main nav.',
      },
      {
        id: '7-user-2',
        role: 'user',
        content: 'Does the collapsed state still feel understandable?',
      },
      {
        id: '7-assistant-2',
        role: 'assistant',
        content:
          'Mostly yes, but the brand and collapse affordance compete a bit, so a clearer hover reveal or icon transition would make it feel more intentional.',
      },
    ],
  },
  {
    id: '8',
    title: 'Interview prep for the frontend role with Sarah',
    messages: [
      {
        id: '8-user-1',
        role: 'user',
        content: 'Help me prep for Sarah’s frontend interview tomorrow.',
      },
      {
        id: '8-assistant-1',
        role: 'assistant',
        content:
          'I would focus on architecture tradeoffs, debugging stories, accessibility judgment, and one example where you improved maintainability under pressure.',
      },
      {
        id: '8-user-2',
        role: 'user',
        content: 'She cares a lot about product sense too.',
      },
      {
        id: '8-assistant-2',
        role: 'assistant',
        content:
          'Then I would prep a story that shows how you balanced engineering quality with user impact rather than treating the implementation as purely technical.',
      },
    ],
  },
  {
    id: '9',
    title: 'Support reply for billing issue',
    messages: [
      {
        id: '9-user-1',
        role: 'user',
        content: 'Draft a support reply for a customer who was charged twice.',
      },
      {
        id: '9-assistant-1',
        role: 'assistant',
        content:
          'I would acknowledge the issue clearly, explain the refund path in plain language, and give them one concrete next step if the duplicate charge remains pending.',
      },
      {
        id: '9-user-2',
        role: 'user',
        content: 'Keep it concise and empathetic.',
      },
      {
        id: '9-assistant-2',
        role: 'assistant',
        content:
          'Absolutely. I would keep it short, own the inconvenience, and avoid over-explaining internal process unless they ask for it.',
      },
    ],
  },
  {
    id: '10',
    title: 'Campaign launch timing',
    messages: [
      {
        id: '10-user-1',
        role: 'user',
        content: 'What is the best time to launch the spring campaign this week?',
      },
      {
        id: '10-assistant-1',
        role: 'assistant',
        content:
          'If the assets are approved, I would launch early in the business day so pacing stabilizes before peak traffic and the team has time to watch delivery.',
      },
      {
        id: '10-user-2',
        role: 'user',
        content: 'Assume we need same-day readouts.',
      },
      {
        id: '10-user-3',
        role: 'user',
        content: 'We also need time for quick budget shifts.',
      },
      {
        id: '10-assistant-2',
        role: 'assistant',
        content:
          'Then an early morning launch is the safest option because it gives you enough signal by afternoon to adjust spend without compressing the learning window.',
      },
    ],
  },
  {
    id: '11',
    title: 'Refactor the reports page',
    messages: [
      {
        id: '11-user-1',
        role: 'user',
        content: 'Outline a clean refactor plan for the reports page.',
      },
      {
        id: '11-assistant-1',
        role: 'assistant',
        content:
          'I would separate data shaping from presentation, centralize chart config, and use typed section components so the page can scale without prop drift.',
      },
      {
        id: '11-user-2',
        role: 'user',
        content: 'Optimize for maintainability, not speed.',
      },
      {
        id: '11-assistant-2',
        role: 'assistant',
        content:
          'Then the priority should be clear boundaries, reusable primitives, and predictable data contracts even if that means a slightly larger initial refactor.',
      },
    ],
  },
  {
    id: '12',
    title: 'Onboarding flow edge cases from the latest user testing',
    messages: [
      {
        id: '12-user-1',
        role: 'user',
        content: 'Summarize the onboarding edge cases we saw in user testing.',
      },
      {
        id: '12-assistant-1',
        role: 'assistant',
        content:
          'The main friction points were account verification timing, unclear invite acceptance errors, and a weak success cue after workspace creation.',
      },
      {
        id: '12-user-2',
        role: 'user',
        content: 'Group them by severity.',
      },
      {
        id: '12-assistant-2',
        role: 'assistant',
        content:
          'The blockers are verification timing and invite failures, while the missing success cue is lower severity because it creates hesitation rather than hard drop-off.',
      },
    ],
  },
  {
    id: '13',
    title: 'Call notes from Acme',
    messages: [
      {
        id: '13-user-1',
        role: 'user',
        content: 'Turn these raw Acme call notes into something the team can scan quickly.',
      },
      {
        id: '13-assistant-1',
        role: 'assistant',
        content:
          'I would organize them into goals, blockers, requests, and follow-ups so each function can see what matters without digging through the transcript.',
      },
      {
        id: '13-user-2',
        role: 'user',
        content: 'Also highlight anything that sounds expansion-related.',
      },
      {
        id: '13-assistant-2',
        role: 'assistant',
        content:
          'I would call out mentions of multi-brand reporting, more seats, and executive dashboards because those usually indicate broader adoption potential.',
      },
    ],
  },
  {
    id: '14',
    title: 'Ideas for the empty state',
    messages: [
      {
        id: '14-user-1',
        role: 'user',
        content: 'Give me empty-state ideas for a brand new workspace.',
      },
      {
        id: '14-assistant-1',
        role: 'assistant',
        content:
          'A strong empty state should orient the user, show the first meaningful action, and include one example so the product feels useful immediately.',
      },
      {
        id: '14-user-2',
        role: 'user',
        content: 'Keep it product-led, not playful.',
      },
      {
        id: '14-assistant-2',
        role: 'assistant',
        content:
          'Then the copy should focus on what they can accomplish next, with restrained tone and a clear CTA tied to the primary workflow.',
      },
    ],
  },
  {
    id: '15',
    title: 'Webhook retry investigation for the failed deliveries',
    messages: [
      {
        id: '15-user-1',
        role: 'user',
        content: 'Help investigate why delivery webhooks are retrying so often.',
      },
      {
        id: '15-assistant-1',
        role: 'assistant',
        content:
          'I would compare retry timestamps to provider error codes, verify idempotency handling, and check whether slow downstream writes are causing timeouts.',
      },
      {
        id: '15-user-2',
        role: 'user',
        content: 'Retries spike after large imports.',
      },
      {
        id: '15-assistant-2',
        role: 'assistant',
        content:
          'That points to queue pressure or database contention, so I would inspect worker saturation and write latency during import windows first.',
      },
    ],
  },
  {
    id: '16',
    title: 'Release notes for v1.8.0',
    messages: [
      {
        id: '16-user-1',
        role: 'user',
        content: 'Draft concise release notes for v1.8.0.',
      },
      {
        id: '16-assistant-1',
        role: 'assistant',
        content:
          'I would group them into improvements, fixes, and smaller quality-of-life changes so customers get the value quickly without a long changelog.',
      },
      {
        id: '16-user-2',
        role: 'user',
        content: 'Aim for a customer-facing tone, not internal release notes.',
      },
      {
        id: '16-assistant-2',
        role: 'assistant',
        content:
          'Then I would focus on outcomes and usability rather than implementation details or internal component names.',
      },
    ],
  },
  {
    id: '17',
    title: 'Pricing page experiments and headline variants',
    messages: [
      {
        id: '17-user-1',
        role: 'user',
        content: 'Suggest pricing page headline variants for our next test.',
      },
      {
        id: '17-assistant-1',
        role: 'assistant',
        content:
          'I would test options centered on faster payback, clearer reporting, and more confident media decisions depending on the audience segment.',
      },
      {
        id: '17-user-2',
        role: 'user',
        content: 'Prioritize performance marketers over general marketers.',
      },
      {
        id: '17-assistant-2',
        role: 'assistant',
        content:
          'Then the strongest variants should speak directly to spend efficiency, attribution confidence, and faster optimization loops.',
      },
    ],
  },
  {
    id: '18',
    title: 'Planning next sprint',
    messages: [
      {
        id: '18-user-1',
        role: 'user',
        content: 'Help me shape next sprint around the biggest product risks.',
      },
      {
        id: '18-assistant-1',
        role: 'assistant',
        content:
          'I would anchor the sprint around one reliability theme, one activation theme, and a smaller polish lane so impact stays focused.',
      },
      {
        id: '18-user-2',
        role: 'user',
        content: 'We only have six engineers available.',
      },
      {
        id: '18-user-3',
        role: 'user',
        content: 'Support load is also higher than normal.',
      },
      {
        id: '18-assistant-2',
        role: 'assistant',
        content:
          'With that constraint, I would reduce active themes further and leave explicit capacity for interruptions instead of planning every engineer to full utilization.',
      },
    ],
  },
  {
    id: '19',
    title: 'Team retro follow-up',
    messages: [
      {
        id: '19-user-1',
        role: 'user',
        content: 'Turn our retro notes into actionable follow-ups.',
      },
      {
        id: '19-assistant-1',
        role: 'assistant',
        content:
          'I would convert them into owners, deadlines, and success signals so the retro creates visible change instead of just a recap.',
      },
      {
        id: '19-user-2',
        role: 'user',
        content: 'Keep the list short enough to actually finish.',
      },
      {
        id: '19-assistant-2',
        role: 'assistant',
        content:
          'Then I would cap it at three changes and choose the ones with the clearest operational impact rather than trying to address every frustration at once.',
      },
    ],
  },
  {
    id: '20',
    title: 'Content calendar for April and the early May drafts',
    messages: [
      {
        id: '20-user-1',
        role: 'user',
        content: 'Build a lightweight content calendar for April and the first week of May.',
      },
      {
        id: '20-assistant-1',
        role: 'assistant',
        content:
          'I would balance product education, proof points, and launch support so the publishing rhythm stays useful without feeling repetitive.',
      },
      {
        id: '20-user-2',
        role: 'user',
        content: 'Include space for one customer story.',
      },
      {
        id: '20-assistant-2',
        role: 'assistant',
        content:
          'That works well in the middle of the calendar because it breaks up the product-heavy pieces and gives the plan a stronger proof element.',
      },
    ],
  },
];
