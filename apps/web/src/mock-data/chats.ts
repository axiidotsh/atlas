import { MOCK_STUDIO_PROJECTS } from '@/mock-data/studio-projects';
import type {
  MockConversation,
  MockConversationImage,
} from '@/mock-data/types';

function getStudioImage(imageId: string): MockConversationImage {
  const image = MOCK_STUDIO_PROJECTS.flatMap((project) => project.images).find(
    (entry) => entry.id === imageId
  );

  if (!image) {
    throw new Error(`Missing studio image: ${imageId}`);
  }

  return image;
}

const LAUNCH_DASHBOARD_IMAGE = getStudioImage('creative_1');
const AUTH_LOOP_TRACE_IMAGE = getStudioImage('creative_2');
const SIDEBAR_STATE_IMAGE = getStudioImage('creative_3');
const ONBOARDING_FLOW_IMAGE = getStudioImage('creative_4');
const RELEASE_HIGHLIGHTS_IMAGE = getStudioImage('creative_5');
const CONTENT_CALENDAR_IMAGE = getStudioImage('creative_6');
const WOD_ARMOUR_ACCOUNT_MENTION =
  '[@Wod Armour](mention://meta/act_meta_129440001)';
const HYPERICE_ACCOUNT_MENTION =
  '[@Hyperice](mention://google/act_google_55821031)';
const WOD_ARMOUR_SPRING_PROSPECTING_MENTION =
  '[@Wod Armour | Spring Prospecting](mention://meta/cmp_meta_1001)';
const HYPERICE_RECOVERY_DEVICE_SHOPPING_MENTION =
  '[@Hyperice | Recovery Device Shopping](mention://google/cmp_google_3002)';

const CHAT_IMAGES: Record<string, MockConversationImage[]> = {
  '1': [LAUNCH_DASHBOARD_IMAGE],
  '2': [AUTH_LOOP_TRACE_IMAGE],
  '7': [SIDEBAR_STATE_IMAGE],
  '12': [ONBOARDING_FLOW_IMAGE],
  '16': [RELEASE_HIGHLIGHTS_IMAGE],
  '20': [CONTENT_CALENDAR_IMAGE],
};

const STANDARD_CHAT_CONVERSATIONS: Array<
  Pick<MockConversation, 'id' | 'title' | 'messages'>
> = [
  {
    id: '1',
    title: 'Q2 launch checklist',
    messages: [
      {
        id: '1-user-1',
        role: 'user',
        content:
          'Build me a launch checklist for the Q2 performance campaign rollout.',
      },
      {
        id: '1-assistant-1',
        role: 'assistant',
        content: `# Launch checklist

![Launch dashboard preview](${LAUNCH_DASHBOARD_IMAGE.src})

## Pre-launch
- Confirm analytics events and conversion tracking on the final landing page.
- Verify UTMs, naming, and audience splits before any spend goes live.
  - Meta: pixel and CAPI event mapping
  - Google: conversion actions and destination URLs
- Review creative exports, crop sizes, and final approvals.

### Rollout table
| Area | Owner | Status |
| --- | --- | --- |
| Tracking | Analytics | Ready |
| Creative | Design | Ready |
| Budget | Media | Pending |

#### Launch order
1. Freeze final changes.
2. Launch the first account.
3. Confirm logs, spend, and conversion signals.

I would treat this like a small release: **tracking first**, then creative QA, then budget guardrails. That way the team can tell if a performance drop is caused by setup or by the campaign itself.`,
      },
      {
        id: '1-user-2',
        role: 'user',
        content: `**Make this more useful for a team working across Meta and Google.**

- We need channel-specific checks for ${WOD_ARMOUR_ACCOUNT_MENTION} and ${HYPERICE_ACCOUNT_MENTION}.
- The handoff should be easy to paste into Slack.`,
      },
      {
        id: '1-assistant-2',
        role: 'assistant',
        content: `### Meta and Google version
- **Meta:** ${WOD_ARMOUR_ACCOUNT_MENTION} should have pixel or CAPI events, catalog health, and ad approvals locked.
- **Google:** ${HYPERICE_ACCOUNT_MENTION} should have conversion actions, bidding setup, and final destination URLs confirmed.
- **Shared:** naming consistency, owner assignment, launch time, and the first readout window.

If you want, I can turn this into a copy-paste launch doc with sections for owner, go or no-go, and rollback notes.`,
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
        content:
          'The auth callback is looping after Google sign-in. Help me narrow it down.',
      },
      {
        id: '2-assistant-1',
        role: 'assistant',
        content: `## Callback triage

![Auth loop trace](${AUTH_LOOP_TRACE_IMAGE.src})

- Callback URL mismatch between the provider and the deployed origin.
- Cookie scope or secure flag differences in staging.
- Middleware or route guards catching the return path too early.

### Fast checks
1. Compare local vs staging origins.
2. Verify secure-cookie behavior.
3. Look for redirect loops in logs.
   - Check repeated 302s.
   - Confirm the callback route is excluded.

| Signal | Local | Staging |
| --- | --- | --- |
| Callback path | Pass | Fail |
| Cookie scope | Stable | Suspicious |
| Redirects | One | Repeating |

If local works with the same provider settings, I would compare the deployment layer first: \`NEXTAUTH_URL\`, proxy headers, and any redirect rules around the callback route.`,
      },
      {
        id: '2-user-2',
        role: 'user',
        content:
          '**The loop only happens in staging.**\n\n- Local works fine.\n- The provider config is the same.\n- The failure shows up right after Google returns.',
      },
      {
        id: '2-assistant-2',
        role: 'assistant',
        content:
          '### What I would check next\n- Confirm the callback path is exempt from middleware.\n- Compare browser cookies between local and staging.\n- Check whether the staging host is rewriting the callback URL.\n- Look at the server logs for a repeated redirect chain.\n\n> When auth works locally but fails in staging, the host, proxy, or cookie layer is usually the real problem.',
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
        content:
          'Give me a few sharper hero copy options for the homepage refresh.',
      },
      {
        id: '3-assistant-1',
        role: 'assistant',
        content:
          '### Three sharper directions\n- **See what moves revenue**\n- **Creative that earns its budget**\n- **Clarity for every media decision**\n\n#### How I would test them\n1. Lead with the shortest option.\n2. Pair it with a more explanatory subhead.\n   - Version A: confidence\n   - Version B: clarity\n3. Use the winner in the hero and keep the others for ads.\n\n| Option | Tone | Fit |\n| --- | --- | --- |\n| See what moves revenue | Direct | Strong |\n| Creative that earns its budget | Premium | Strong |\n| Clarity for every media decision | Analytical | Medium |\n\nI would keep the hero short, premium, and specific. The strongest versions promise an outcome instead of describing the product.',
      },
      {
        id: '3-user-2',
        role: 'user',
        content:
          '**Keep them short and a little more premium.**\n\n- Less marketing fluff\n- More confidence\n- No long sentences',
      },
      {
        id: '3-assistant-2',
        role: 'assistant',
        content:
          '### Refined set\n- **Make spend clearer**\n- **See the signal sooner**\n- **Decisions with less guesswork**\n\nIf you want a slightly more elevated tone, I would also test a version that leans into trust, such as **The clearer way to spend**.',
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
        content:
          'Summarize the biggest changes from this week’s paid media performance.',
      },
      {
        id: '4-assistant-1',
        role: 'assistant',
        content: `#### Weekly readout
- Click-through improved on ${WOD_ARMOUR_SPRING_PROSPECTING_MENTION}.
- Remarketing ROAS softened.
- Spend moved toward ${HYPERICE_RECOVERY_DEVICE_SHOPPING_MENTION}.

##### What changed
1. Top-of-funnel got stronger.
2. Mid-funnel stayed flat.
3. Efficiency lagged behind volume.
   - Watch blended ROAS.
   - Watch frequency.

| Metric | Last week | This week |
| --- | --- | --- |
| CTR | 1.8% | 2.2% |
| ROAS | 2.4x | 2.1x |
| Spend share | 41% | 54% |

The main story is that top-of-funnel engagement looks healthier, but the efficiency gains are not yet flowing through the entire funnel.`,
      },
      {
        id: '4-user-2',
        role: 'user',
        content: `**Turn that into a short note I can drop into Slack.**

- Mention ${WOD_ARMOUR_SPRING_PROSPECTING_MENTION} and ${HYPERICE_RECOVERY_DEVICE_SHOPPING_MENTION}.
- Keep it tight
- No jargon
- Sound confident`,
      },
      {
        id: '4-assistant-2',
        role: 'assistant',
        content: `### Slack-ready note
This week we saw stronger top-of-funnel engagement in ${WOD_ARMOUR_SPRING_PROSPECTING_MENTION}, weaker remarketing efficiency, and a larger share of spend moving behind ${HYPERICE_RECOVERY_DEVICE_SHOPPING_MENTION}.

### What I would watch next
- Whether the prospecting lift holds after the learning window
- Whether remarketing recovers once pacing stabilizes
- Whether the creative winner keeps outpacing the rest`,
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
        content:
          'I need a rollback plan for the Prisma migration that failed in staging.',
      },
      {
        id: '5-assistant-1',
        role: 'assistant',
        content:
          '##### Rollback plan\n1. Freeze deploys.\n2. Snapshot the database before changing anything else.\n3. Revert app code that depends on the new schema.\n4. Confirm the exact migration state before applying a rollback path.\n   - If the change is additive, you may be able to restore with less risk.\n   - If the change is destructive, stop and inspect first.\n\n| Step | Goal | Risk |\n| --- | --- | --- |\n| Snapshot | Preserve data | Low |\n| Diff | Understand drift | Low |\n| Rollback | Restore state | Medium |\n\nIf the migration partially applied, I would not rush the rollback. The safe move is to compare the live schema to the expected one, document each difference, and protect data before touching anything irreversible.',
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
          '### Safer recovery path\n- Check the schema diff first.\n- Identify whether the change is additive or destructive.\n- Restore or rollback only after the data risk is clear.\n\nIf the change touched existing columns, I would handle it as a data safety incident rather than a normal deploy rollback.',
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
        content:
          'Write a customer update about the delayed feature release without sounding defensive.',
      },
      {
        id: '6-assistant-1',
        role: 'assistant',
        content:
          '###### Customer update draft\nWe are taking a little more time on the release so we can verify the quality of the final experience before shipping it broadly. The schedule moved because the team wanted one more validation pass, and the next window is now more reliable than the earlier target.\n\n#### What the note should do\n- Acknowledge the delay plainly\n- Show that quality mattered\n- Give a concrete next window\n- Avoid sounding defensive\n  - Do not over-explain internal process.\n  - Keep the tone factual.\n\n| Audience | Message |\n| --- | --- |\n| Customers | Clear, calm, factual |\n| Enterprise | Direct, operational |\n\nFor enterprise customers, I would keep the note concise, specific, and focused on reliability.',
      },
      {
        id: '6-user-2',
        role: 'user',
        content:
          '**Make it suitable for enterprise customers.**\n\n- More direct\n- Less casual\n- Focus on stability',
      },
      {
        id: '6-assistant-2',
        role: 'assistant',
        content:
          '### Enterprise-friendly version\nI would use direct operational language, emphasize validation and stability, and avoid casual phrasing.\n\nFor example: **We are extending the release window to complete final validation and protect production reliability.** That keeps the message calm, factual, and credible.',
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
        content: `### What still feels off

![Sidebar state comparison](${SIDEBAR_STATE_IMAGE.src})

- The active state could be stronger.
- The recent chats section needs clearer separation from primary navigation.
- The collapsed state is understandable, but the brand mark and toggle compete a bit.

#### Visual hierarchy
1. Make the active item unmistakable.
2. Separate recent chats from primary nav.
3. Reduce the weight of the collapse affordance.
   - tighter spacing
   - clearer hover state

| Region | Issue | Priority |
| --- | --- | --- |
| Primary nav | Weak active state | High |
| Recent chats | Grouping ambiguity | Medium |
| Collapse | Competing controls | Medium |

I would not redesign the whole sidebar yet. A tighter visual hierarchy and a cleaner hover treatment would probably solve most of the friction.`,
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
          '### Collapsed state\nMostly yes, but I would make the interaction more intentional.\n\nA better version would:\n- show a clearer hover reveal\n- sharpen the icon alignment\n- reduce the visual weight of the collapse affordance\n\nThat way the collapsed mode feels deliberate instead of merely compact.',
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
          '### What to prepare\n- One architecture story\n- One debugging story\n- One accessibility example\n- One maintainability win under pressure\n\n#### Answer structure\n1. State the user problem.\n2. Explain the technical tradeoff.\n3. Show the choice you made.\n4. Close with the impact.\n   - user benefit\n   - team benefit\n\n| Topic | What to show |\n| --- | --- |\n| Architecture | Boundary thinking |\n| Debugging | Process and signal |\n| Accessibility | User empathy |\n\nI would make sure each answer shows judgment, not just implementation detail. Sarah will probably care about how you trade off speed, product sense, and technical quality.',
      },
      {
        id: '8-user-2',
        role: 'user',
        content:
          'She cares a lot about product sense too.\n\n- how you think about users\n- why a solution matters\n- how you explain tradeoffs',
      },
      {
        id: '8-assistant-2',
        role: 'assistant',
        content:
          '### Strong product-sense answer shape\n1. State the user problem.\n2. Explain the technical tradeoff.\n3. Show what you chose and why.\n4. Close with the impact on the user or team.\n\nIf you want, I can also turn this into a mock interview script with short follow-up questions.',
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
          '### Draft reply\nI am sorry for the confusion here. I can see how frustrating a duplicate charge would be, and I would want the same answer quickly if it happened to me.\n\n#### What the reply should do\n- Acknowledge the issue immediately.\n- Explain the next step in plain language.\n- Avoid over-explaining internal process.\n\n| Customer need | Reply style |\n| --- | --- |\n| Wants reassurance | Empathetic |\n| Wants action | Clear |\n| Wants speed | Concise |\n\nWe are checking the payment records now and will confirm the refund path as soon as possible. If the second charge is still pending, it may drop off automatically, but I do not want to guess before we verify it.',
      },
      {
        id: '9-user-2',
        role: 'user',
        content:
          '**Keep it concise and empathetic.**\n\n- Acknowledge the issue\n- Explain the next step\n- Do not over-explain internal process',
      },
      {
        id: '9-assistant-2',
        role: 'assistant',
        content:
          '### Tight version\nThanks for flagging this. I am sorry for the duplicate charge and I am checking it now.\n\nIf the second payment is still pending, it may disappear automatically. If not, we will make sure the refund path is handled promptly.',
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
        content:
          'What is the best time to launch the spring campaign this week?',
      },
      {
        id: '10-assistant-1',
        role: 'assistant',
        content:
          '### Launch timing\nIf the assets are approved, I would launch early in the business day so pacing has time to stabilize before peak traffic. That gives the team a clearer first read and more room to adjust before the day ends.\n\n#### Why morning works\n- More time for the learning window\n- More time for manual budget shifts\n- More time to catch delivery issues\n  - faster fix if tracking breaks\n  - easier same-day readout\n\n| Window | Readout speed | Risk |\n| --- | --- | --- |\n| Morning | High | Low |\n| Midday | Medium | Medium |\n| Evening | Low | Higher |\n\nA morning launch is still the safest option when the team needs same-day signal.',
      },
      {
        id: '10-user-2',
        role: 'user',
        content:
          'Assume we need same-day readouts.\n\n- We need quick signal\n- We may shift budget fast\n- The team is on standby',
      },
      {
        id: '10-assistant-2',
        role: 'assistant',
        content:
          '### Best fit under those constraints\nAn early morning launch is still the safest choice. It gives you enough signal by afternoon to make changes without compressing the testing window.\n\nIf you want, I can also sketch a simple launch-day schedule with check-ins at 10, 2, and 5.',
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
          '### Refactor plan\n- Separate data shaping from presentation.\n- Centralize chart configuration.\n- Use typed section components so the page stays predictable.\n\nI would optimize for clear boundaries instead of trying to finish the whole refactor in one pass. That keeps the work easier to review and easier to extend later.',
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
          '### Maintainability first\nThat means:\n- fewer props passing through multiple layers\n- reusable primitives for repeated sections\n- stable data contracts between fetch logic and UI\n\nIf the team can understand the page structure in one read, the refactor is probably in a good place.',
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
        content: `### Main edge cases

![Onboarding flow snapshot](${ONBOARDING_FLOW_IMAGE.src})

- Verification timing creates uncertainty.
- Invite acceptance errors are not descriptive enough.
- The success state after workspace creation is too quiet.

### Severity
- **Blockers:** verification timing and invite failures
- **Medium:** missing or weak success cue
- **Lower:** copy polish and minor state transitions

The biggest risk is not that the flow breaks completely. It is that users lose confidence before they finish.`,
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
          '### Grouped version\n**High severity**\n- Verification timing\n- Invite acceptance failures\n\n**Medium severity**\n- Weak success cue after workspace creation\n\n**Low severity**\n- Copy polish\n- Microcopy and visual feedback\n\nThat grouping should make the fix plan much easier to discuss with product and engineering.',
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
        content:
          'Turn these raw Acme call notes into something the team can scan quickly.',
      },
      {
        id: '13-assistant-1',
        role: 'assistant',
        content:
          '### Scan-friendly summary\n- Goals: consolidate reporting and make dashboards easier to trust.\n- Blockers: approval from the analytics team and cleanup of older naming conventions.\n- Requests: more seat flexibility, multi-brand visibility, and executive-ready exports.\n- Follow-ups: send a revised timeline and confirm the next review date.\n\nI would keep the summary tight so the team can skim it in under a minute.',
      },
      {
        id: '13-user-2',
        role: 'user',
        content:
          'Also highlight anything that sounds expansion-related.\n\n- More seats\n- Multi-brand reporting\n- Executive dashboards',
      },
      {
        id: '13-assistant-2',
        role: 'assistant',
        content:
          '### Expansion signals\nI would call out:\n- multi-brand reporting\n- more seats\n- executive dashboards\n- broader reporting access across teams\n\nThose usually suggest the account is moving beyond a single-team use case and could justify a larger rollout motion.',
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
          '### Empty-state direction\nA good empty state should do three jobs at once:\n- explain where the user is\n- show the first useful action\n- give one example so the product feels tangible\n\nI would keep the tone product-led and restrained. The goal is to reduce uncertainty, not to entertain.',
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
          '### Copy direction\n- Focus on the next task\n- Use one clear CTA\n- Keep the example realistic\n\nA strong line might be: **Start by creating your first workspace, then invite your team and add your first campaign.**',
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
        content:
          'Help investigate why delivery webhooks are retrying so often.',
      },
      {
        id: '15-assistant-1',
        role: 'assistant',
        content:
          '### Investigation order\n1. Compare retry timestamps with provider error codes.\n2. Verify idempotency handling on the receiver.\n3. Check whether slow downstream writes are pushing requests over the timeout.\n4. Look for worker saturation during large imports.\n\n### Likely pattern\nIf retries spike after imports, I would suspect queue pressure or database contention before I suspect the provider itself.',
      },
      {
        id: '15-user-2',
        role: 'user',
        content:
          'Retries spike after large imports.\n\n- More traffic than usual\n- Worker queue backs up\n- Webhook latency climbs',
      },
      {
        id: '15-assistant-2',
        role: 'assistant',
        content:
          '### What I would inspect first\n- worker concurrency\n- database write latency\n- request timeout settings\n- whether duplicate deliveries are being acknowledged correctly\n\nA small log sample can help a lot here, especially if you can line up the retry bursts with the import jobs.',
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
        content: `### v1.8.0 release notes

![Release highlights](${RELEASE_HIGHLIGHTS_IMAGE.src})

**Improvements**
- Faster report loading on larger workspaces
- Cleaner navigation in the sidebar
- Better empty states for first-time users

**Fixes**
- Resolved a few edge cases in onboarding
- Improved webhook reliability under load

**Quality of life**
- Better copy in a few high-traffic screens

I would keep the language customer-facing and focus on outcomes instead of implementation details.`,
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
          '### Better tone\nThat means:\n- describe what improved for the user\n- avoid component names and internal architecture\n- keep the language concise and friendly\n\nFor example, instead of saying a module was refactored, I would say the experience is faster and more reliable.',
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
          '### Headline variants\n- **Spend with more confidence**\n- **See what drives return**\n- **Faster decisions for paid media teams**\n\nI would bias the test toward performance marketers, because they care more about clarity, speed, and spend efficiency than broad branding language.',
      },
      {
        id: '17-user-2',
        role: 'user',
        content:
          '**Prioritize performance marketers over general marketers.**\n\n- More direct language\n- More emphasis on efficiency\n- Less generic marketing tone',
      },
      {
        id: '17-assistant-2',
        role: 'assistant',
        content:
          '### Better fit for that audience\n- **Know what earns its budget**\n- **Move spend with better signal**\n- **Performance clarity for paid media**\n\nIf you want, I can also sketch the supporting subheads so each headline has a cleaner argument underneath it.',
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
          '### Sprint shape\nI would anchor the sprint around three lanes:\n- one reliability theme\n- one activation theme\n- one small polish lane\n\nWith six engineers and higher support load, I would leave real buffer for interruptions instead of planning everyone to full utilization. That makes the sprint easier to survive if production issues come up.',
      },
      {
        id: '18-user-2',
        role: 'user',
        content:
          'We only have six engineers available.\n\n- Support load is high\n- Interruptions are likely\n- Capacity is tighter than usual',
      },
      {
        id: '18-assistant-2',
        role: 'assistant',
        content:
          '### Practical adjustment\nI would trim the active themes further and assign explicit coverage for support, bug triage, and on-call follow-up.\n\nA healthier plan is to ship less with more confidence than to overload the sprint and lose momentum halfway through.',
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
          '### Action items\n- Assign owners.\n- Set deadlines.\n- Define a clear success signal for each follow-up.\n\nI would keep the retro output short enough that people can actually finish it, because a long follow-up list usually dies in the next busy week.',
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
          '### Good limit\nI would cap it at three changes:\n1. one reliability improvement\n2. one process improvement\n3. one communication improvement\n\nThat gives the team enough structure to make progress without turning the retro into a second project.',
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
        content:
          'Build a lightweight content calendar for April and the first week of May.',
      },
      {
        id: '20-assistant-1',
        role: 'assistant',
        content: `### Lightweight calendar

![Content calendar preview](${CONTENT_CALENDAR_IMAGE.src})

I would balance:
- product education
- proof points
- launch support

### Suggested rhythm
- Week 1: product explainer
- Week 2: customer proof
- Week 3: feature highlight
- Week 4: launch support
- Early May: follow-up piece and repurpose one strong post

That mix keeps the calendar useful without feeling repetitive.`,
      },
      {
        id: '20-user-2',
        role: 'user',
        content:
          'Include space for one customer story.\n\n- Use it as the proof piece\n- Place it where the calendar needs variety\n- Keep it close to a product angle',
      },
      {
        id: '20-assistant-2',
        role: 'assistant',
        content:
          '### Best placement\nI would put the customer story in the middle of the calendar. That breaks up the product-heavy pieces and gives the sequence a stronger credibility point.\n\nIf you want, I can turn the whole plan into a week-by-week draft with specific post ideas.',
      },
    ],
  },
];

export const MOCK_CHATS: MockConversation[] = STANDARD_CHAT_CONVERSATIONS.map(
  (conversation) => {
    const images = CHAT_IMAGES[conversation.id] ?? [];

    return {
      ...conversation,
      type: 'standard',
      images,
      coverImage: images[0]?.src,
    };
  }
);
