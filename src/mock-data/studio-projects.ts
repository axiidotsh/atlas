import {
  createProjectFormValues,
  type ProjectFormValues,
  type ReferenceImageValue,
} from '@/app/(protected)/studio/project-form';
import type {
  MockChatMessage,
  MockConversation,
  MockStudioConversation,
  MockStudioImage,
  MockStudioImageSet,
} from '@/mock-data/types';

function createReferenceImage(image: MockStudioImage): ReferenceImageValue {
  return {
    id: `reference-${image.id}`,
    name: image.title,
    preview: image.src,
  };
}

function createImageSet(
  id: string,
  prompt: string,
  images: MockStudioImage[],
  createdAtLabel: string
): MockStudioImageSet {
  return {
    id,
    prompt,
    images,
    createdAtLabel,
  };
}

function createStudioSettings(
  overrides: Partial<ProjectFormValues>
): ProjectFormValues {
  return createProjectFormValues(overrides);
}

const recoveryLaunchImages: MockStudioImage[] = [
  {
    id: 'creative_1',
    title: 'Athlete Recovery Portrait',
    src: 'https://plus.unsplash.com/premium_photo-1677159451012-6722af343f1c?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    aspectRatio: '1:1',
  },
  {
    id: 'creative_7',
    title: 'Outdoor Launch Creative',
    src: 'https://images.unsplash.com/photo-1774331510646-a1781c4a9713?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    aspectRatio: '1:1',
  },
  {
    id: 'creative_8',
    title: 'Performance Ad Concept',
    src: 'https://images.unsplash.com/photo-1774429078795-0c3fe5ddba8f?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    aspectRatio: '1:1',
  },
];

const recoveryLaunchMessages: MockChatMessage[] = [
  {
    id: 'project_recovery_launch-user-1',
    role: 'user',
    content:
      'Create a recovery campaign portrait with premium athletic energy. Keep it strong enough for paid social, but still feel editorial.',
  },
  {
    id: 'project_recovery_launch-assistant-1',
    role: 'assistant',
    content: `### First direction

![Athlete Recovery Portrait](${recoveryLaunchImages[0].src})

- Premium portrait framing with a calm post-workout mood
- Clean neutral palette so product overlays still read
- Best fit for prospecting placements and landing-page hero support

If you want, I can push this toward either **harder performance marketing** or **more fashion-editorial polish**.`,
  },
  {
    id: 'project_recovery_launch-user-2',
    role: 'user',
    content:
      'Give me two follow-ups: one square social crop and one taller motion-first concept for Stories or Reels.',
  },
  {
    id: 'project_recovery_launch-assistant-2',
    role: 'assistant',
    content: `### Follow-up set

![Outdoor Launch Creative](${recoveryLaunchImages[1].src})

Square version with a brighter outdoor read and more ad-ready pacing.

![Performance Ad Concept](${recoveryLaunchImages[2].src})

Vertical version designed to feel faster, more directional, and better suited for motion-led placements.`,
  },
];

const recoveryLaunchImageSets: MockStudioImageSet[] = [
  createImageSet(
    'recovery-launch-set-1',
    recoveryLaunchMessages[0].content,
    [recoveryLaunchImages[0]],
    'Initial direction'
  ),
  createImageSet(
    'recovery-launch-set-2',
    recoveryLaunchMessages[2].content,
    [recoveryLaunchImages[1], recoveryLaunchImages[2]],
    'Follow-up variations'
  ),
];

const recoveryLaunchSettings = createStudioSettings({
  name: 'Recovery Launch Portrait Study',
  prompt:
    'Premium recovery campaign system for paid social, balancing editorial polish with high-performing launch creatives.',
  referenceImages: [createReferenceImage(recoveryLaunchImages[0])],
  primaryGoal: 'Sales conversion',
  voiceTones: ['confident', 'sophisticated'],
  colorPalette: ['#121827', '#3C4A63', '#9CAFC6', '#E2E8F0', '#F59E0B'],
  typography: 'Space Grotesk',
  adStyles: ['editorial', 'lifestyle', 'luxury'],
  visualGuidelines: ['High contrast', 'Negative space', 'Natural lighting'],
  ageRange: [24, 42],
  gender: 'All',
  interests: ['recovery', 'training', 'wellness', 'performance'],
  geography: ['United States', 'Canada', 'United Kingdom'],
});

const editorialSeriesImages: MockStudioImage[] = [
  {
    id: 'creative_2',
    title: 'Summer Streetwear Editorial',
    src: 'https://images.unsplash.com/photo-1770026430828-c389a6ccfad7?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    aspectRatio: '1:1',
  },
  {
    id: 'creative_4',
    title: 'Campaign Lifestyle Frame',
    src: 'https://images.unsplash.com/photo-1773318427480-1058e1059f99?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    aspectRatio: '1:1',
  },
  {
    id: 'creative_6',
    title: 'Lifestyle Campaign Variation',
    src: 'https://images.unsplash.com/photo-1773929483999-52ac8e6af2cc?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    aspectRatio: '1:1',
  },
];

const editorialSeriesMessages: MockChatMessage[] = [
  {
    id: 'project_editorial_series-user-1',
    role: 'user',
    content:
      'Build a streetwear editorial concept that feels expensive, youthful, and slightly cinematic. I want the first pass to feel like campaign photography, not ecommerce.',
  },
  {
    id: 'project_editorial_series-assistant-1',
    role: 'assistant',
    content: `### Editorial base

![Summer Streetwear Editorial](${editorialSeriesImages[0].src})

- Longer silhouette and more magazine-style framing
- Better for lookbook storytelling than direct response
- Strong starting point for layered typography or cover-line treatments`,
  },
  {
    id: 'project_editorial_series-user-2',
    role: 'user',
    content:
      'Now make it feel more campaign-ready. I still want style, but the next versions should work harder in social placements.',
  },
  {
    id: 'project_editorial_series-assistant-2',
    role: 'assistant',
    content: `### Campaign-ready options

![Campaign Lifestyle Frame](${editorialSeriesImages[1].src})

This cut keeps the editorial posture but gives you a cleaner focal point for copy.

![Lifestyle Campaign Variation](${editorialSeriesImages[2].src})

This one is the most flexible for social rotation because it reads faster at smaller sizes.`,
  },
];

const editorialSeriesImageSets: MockStudioImageSet[] = [
  createImageSet(
    'editorial-series-set-1',
    editorialSeriesMessages[0].content,
    [editorialSeriesImages[0]],
    'Editorial base'
  ),
  createImageSet(
    'editorial-series-set-2',
    editorialSeriesMessages[2].content,
    [editorialSeriesImages[1], editorialSeriesImages[2]],
    'Campaign-ready pass'
  ),
];

const editorialSeriesSettings = createStudioSettings({
  name: 'Streetwear Editorial Iterations',
  prompt:
    'Streetwear campaign development for social and lookbook placements with a premium, cinematic editorial point of view.',
  referenceImages: [createReferenceImage(editorialSeriesImages[0])],
  primaryGoal: 'Brand awareness',
  voiceTones: ['bold', 'witty'],
  colorPalette: ['#0F172A', '#293548', '#7C3AED', '#D4D4D8', '#F8FAFC'],
  typography: 'Outfit',
  adStyles: ['editorial', 'high-fashion', 'storytelling'],
  visualGuidelines: ['Bold typography', 'Layered depth', 'Film grain'],
  ageRange: [18, 30],
  gender: 'All',
  interests: ['streetwear', 'fashion', 'culture', 'sneakers'],
  geography: ['New York', 'Los Angeles', 'London', 'Tokyo'],
});

const productMotionImages: MockStudioImage[] = [
  {
    id: 'creative_3',
    title: 'Product Close-up Motion Blur',
    src: 'https://images.unsplash.com/photo-1771212952256-31a72d974757?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    aspectRatio: '1:1',
  },
  {
    id: 'creative_5',
    title: 'Studio Product Sweep',
    src: 'https://images.unsplash.com/photo-1773979407769-363772f1e5fa?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    aspectRatio: '1:1',
  },
];

const productMotionMessages: MockChatMessage[] = [
  {
    id: 'project_product_motion-user-1',
    role: 'user',
    content:
      'Generate a studio product concept with motion in the frame. I want it to feel precise and premium, not overly glossy.',
  },
  {
    id: 'project_product_motion-assistant-1',
    role: 'assistant',
    content: `### Motion-led concept

![Product Close-up Motion Blur](${productMotionImages[0].src})

- Controlled blur gives the frame energy without losing product clarity
- Strong fit for launch teasers or feature callouts
- The lighting stays clean enough for brand overlays`,
  },
  {
    id: 'project_product_motion-user-2',
    role: 'user',
    content:
      'Show me a cleaner companion image that can sit next to that motion shot in a launch carousel.',
  },
  {
    id: 'project_product_motion-assistant-2',
    role: 'assistant',
    content: `### Cleaner companion frame

![Studio Product Sweep](${productMotionImages[1].src})

This version keeps the same premium mood, but removes most of the motion so the carousel has a calmer detail slide to balance the opener.`,
  },
];

const productMotionImageSets: MockStudioImageSet[] = [
  createImageSet(
    'product-motion-set-1',
    productMotionMessages[0].content,
    [productMotionImages[0]],
    'Motion-led concept'
  ),
  createImageSet(
    'product-motion-set-2',
    productMotionMessages[2].content,
    [productMotionImages[1]],
    'Companion frame'
  ),
];

const productMotionSettings = createStudioSettings({
  name: 'Product Motion and Studio Set',
  prompt:
    'Launch-ready product creative system that pairs precise studio stills with motion-led hero assets for carousel storytelling.',
  referenceImages: [createReferenceImage(productMotionImages[0])],
  primaryGoal: 'Sales conversion',
  voiceTones: ['minimal', 'confident'],
  colorPalette: ['#111827', '#334155', '#64748B', '#CBD5E1', '#F8FAFC'],
  typography: 'Sora',
  adStyles: ['studio', 'product-focused', 'minimal'],
  visualGuidelines: ['Clean UI', 'Soft shadows', 'Glossy highlights'],
  ageRange: [22, 45],
  gender: 'All',
  interests: ['consumer tech', 'product design', 'premium goods'],
  geography: ['United States', 'Germany', 'Singapore'],
});

const hospitalityRefreshImages: MockStudioImage[] = [
  {
    id: 'creative_9',
    title: 'Restaurant Interior Hero',
    src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop',
    aspectRatio: '1:1',
  },
  {
    id: 'creative_10',
    title: 'Cafe Counter Detail',
    src: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1600&auto=format&fit=crop',
    aspectRatio: '1:1',
  },
  {
    id: 'creative_11',
    title: 'Dining Experience Story Frame',
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1600&auto=format&fit=crop',
    aspectRatio: '1:1',
  },
];

const hospitalityRefreshMessages: MockChatMessage[] = [
  {
    id: 'project_hospitality_refresh-user-1',
    role: 'user',
    content:
      'Create a hospitality refresh set for a modern restaurant brand. I want it warm, premium, and social-friendly without feeling staged.',
  },
  {
    id: 'project_hospitality_refresh-assistant-1',
    role: 'assistant',
    content: `### Interior-led hero

![Restaurant Interior Hero](${hospitalityRefreshImages[0].src})

- Strong brand-level atmosphere shot
- Enough negative space for headlines or offers
- Best suited for launch posts and profile refreshes`,
  },
  {
    id: 'project_hospitality_refresh-user-2',
    role: 'user',
    content:
      'Give me one detail crop and one vertical story frame so the set feels more complete.',
  },
  {
    id: 'project_hospitality_refresh-assistant-2',
    role: 'assistant',
    content: `### Supporting cuts

![Cafe Counter Detail](${hospitalityRefreshImages[1].src})

Counter detail for menu drops, daily specials, or paid social variations.

![Dining Experience Story Frame](${hospitalityRefreshImages[2].src})

Vertical story frame that leans more into ambience and guest experience.`,
  },
];

const hospitalityRefreshImageSets: MockStudioImageSet[] = [
  createImageSet(
    'hospitality-refresh-set-1',
    hospitalityRefreshMessages[0].content,
    [hospitalityRefreshImages[0]],
    'Hero direction'
  ),
  createImageSet(
    'hospitality-refresh-set-2',
    hospitalityRefreshMessages[2].content,
    [hospitalityRefreshImages[1], hospitalityRefreshImages[2]],
    'Supporting cuts'
  ),
];

const hospitalityRefreshSettings = createStudioSettings({
  name: 'Hospitality Brand Refresh',
  prompt:
    'Warm premium restaurant campaign system designed for launch posts, story placements, and evergreen social refreshes.',
  referenceImages: [createReferenceImage(hospitalityRefreshImages[0])],
  primaryGoal: 'Engagement',
  voiceTones: ['friendly', 'sophisticated'],
  colorPalette: ['#3F2D23', '#8C5E3C', '#D4A373', '#F5E9DA', '#A63C06'],
  typography: 'Playfair Display',
  adStyles: ['lifestyle', 'editorial'],
  visualGuidelines: ['Natural lighting', 'Muted tones', 'Minimal props'],
  ageRange: [25, 54],
  gender: 'All',
  interests: ['dining', 'hospitality', 'date nights', 'food culture'],
  geography: ['Chicago', 'New York', 'Austin'],
});

const wellnessCampaignImages: MockStudioImage[] = [
  {
    id: 'creative_12',
    title: 'Morning Stretch Portrait',
    src: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1600&auto=format&fit=crop',
    aspectRatio: '1:1',
  },
  {
    id: 'creative_13',
    title: 'Meditation Brand Still',
    src: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1600&auto=format&fit=crop',
    aspectRatio: '1:1',
  },
  {
    id: 'creative_14',
    title: 'Active Lifestyle Variation',
    src: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1600&auto=format&fit=crop',
    aspectRatio: '1:1',
  },
];

const wellnessCampaignMessages: MockChatMessage[] = [
  {
    id: 'project_wellness_campaign-user-1',
    role: 'user',
    content:
      'Build a wellness social campaign system that feels calm but still active. I need the set to work across both awareness and retargeting.',
  },
  {
    id: 'project_wellness_campaign-assistant-1',
    role: 'assistant',
    content: `### Calm awareness direction

![Morning Stretch Portrait](${wellnessCampaignImages[0].src})

- Soft morning light gives the campaign a calmer opening note
- Strong option for top-of-funnel and landing-page continuity
- Leaves room for wellness messaging without crowding the subject`,
  },
  {
    id: 'project_wellness_campaign-user-2',
    role: 'user',
    content:
      'Now give me one quieter brand still and one more active square variation for social rotation.',
  },
  {
    id: 'project_wellness_campaign-assistant-2',
    role: 'assistant',
    content: `### Rotation set

![Meditation Brand Still](${wellnessCampaignImages[1].src})

Meditation still for calmer brand moments or quote-led posts.

![Active Lifestyle Variation](${wellnessCampaignImages[2].src})

Square lifestyle frame with more visible movement for paid social rotation.`,
  },
];

const wellnessCampaignImageSets: MockStudioImageSet[] = [
  createImageSet(
    'wellness-campaign-set-1',
    wellnessCampaignMessages[0].content,
    [wellnessCampaignImages[0]],
    'Awareness opener'
  ),
  createImageSet(
    'wellness-campaign-set-2',
    wellnessCampaignMessages[2].content,
    [wellnessCampaignImages[1], wellnessCampaignImages[2]],
    'Rotation set'
  ),
];

const wellnessCampaignSettings = createStudioSettings({
  name: 'Wellness Social Campaign System',
  prompt:
    'Cross-funnel wellness campaign with calm awareness imagery and active retargeting variations for social placements.',
  referenceImages: [createReferenceImage(wellnessCampaignImages[0])],
  primaryGoal: 'Lead generation',
  voiceTones: ['minimal', 'friendly'],
  colorPalette: ['#1F3B4D', '#4C7A7D', '#8FB9A8', '#E7F1EA', '#D97706'],
  typography: 'DM Sans',
  adStyles: ['lifestyle', 'minimal', 'storytelling'],
  visualGuidelines: ['Negative space', 'Soft shadows', 'Natural lighting'],
  ageRange: [23, 50],
  gender: 'All',
  interests: ['wellness', 'mindfulness', 'fitness', 'healthy living'],
  geography: ['United States', 'Australia', 'Canada'],
});

const foodLaunchImages: MockStudioImage[] = [
  {
    id: 'creative_15',
    title: 'Signature Dish Hero',
    src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop',
    aspectRatio: '1:1',
  },
  {
    id: 'creative_16',
    title: 'Table Spread Editorial',
    src: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1600&auto=format&fit=crop',
    aspectRatio: '1:1',
  },
  {
    id: 'creative_17',
    title: 'Kitchen Motion Plate-up',
    src: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?q=80&w=1600&auto=format&fit=crop',
    aspectRatio: '1:1',
  },
];

const foodLaunchMessages: MockChatMessage[] = [
  {
    id: 'project_food_launch-user-1',
    role: 'user',
    content:
      'Generate a food launch creative set for a premium menu drop. I want one hero that feels craveable and polished, then supporting variations for social.',
  },
  {
    id: 'project_food_launch-assistant-1',
    role: 'assistant',
    content: `### Launch hero

![Signature Dish Hero](${foodLaunchImages[0].src})

- Tight hero framing keeps the dish unmistakably central
- Good balance between appetite appeal and premium styling
- Strong fit for announcement posts or paid launch creative`,
  },
  {
    id: 'project_food_launch-user-2',
    role: 'user',
    content:
      'Expand the set with a wider square composition and a vertical kitchen moment that feels more alive.',
  },
  {
    id: 'project_food_launch-assistant-2',
    role: 'assistant',
    content: `### Expanded set

![Table Spread Editorial](${foodLaunchImages[1].src})

Square spread for carousel variety and offer-led overlays.

![Kitchen Motion Plate-up](${foodLaunchImages[2].src})

Vertical plate-up moment to give the campaign a more dynamic, behind-the-pass feel.`,
  },
];

const foodLaunchImageSets: MockStudioImageSet[] = [
  createImageSet(
    'food-launch-set-1',
    foodLaunchMessages[0].content,
    [foodLaunchImages[0]],
    'Launch hero'
  ),
  createImageSet(
    'food-launch-set-2',
    foodLaunchMessages[2].content,
    [foodLaunchImages[1], foodLaunchImages[2]],
    'Expanded set'
  ),
];

const foodLaunchSettings = createStudioSettings({
  name: 'Food Launch Creative Sprint',
  prompt:
    'Premium menu-drop creative system with craveable hero imagery and fast social variations for launch week.',
  referenceImages: [createReferenceImage(foodLaunchImages[0])],
  primaryGoal: 'Sales conversion',
  voiceTones: ['playful', 'bold'],
  colorPalette: ['#5A1E0E', '#A43E17', '#E76F51', '#F4A261', '#FDF1E3'],
  typography: 'Oswald',
  adStyles: ['lifestyle', 'cinematic', 'storytelling'],
  visualGuidelines: ['High contrast', 'Textured', 'Natural lighting'],
  ageRange: [18, 44],
  gender: 'All',
  interests: ['food delivery', 'restaurants', 'new openings', 'dining out'],
  geography: ['Los Angeles', 'Miami', 'Dallas'],
});

const travelEditorialImages: MockStudioImage[] = [
  {
    id: 'creative_18',
    title: 'Coastal Destination Hero',
    src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop',
    aspectRatio: '1:1',
  },
  {
    id: 'creative_19',
    title: 'Open Road Campaign Frame',
    src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop',
    aspectRatio: '1:1',
  },
  {
    id: 'creative_20',
    title: 'Beach Resort Social Cut',
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
    aspectRatio: '1:1',
  },
];

const travelEditorialMessages: MockChatMessage[] = [
  {
    id: 'project_travel_editorial-user-1',
    role: 'user',
    content:
      'Create a travel editorial pack that feels elevated and transportive. I want it to sell the destination without reading like generic tourism creative.',
  },
  {
    id: 'project_travel_editorial-assistant-1',
    role: 'assistant',
    content: `### Destination opener

![Coastal Destination Hero](${travelEditorialImages[0].src})

- Atmospheric opening frame with strong destination storytelling
- Better for hero placements and high-consideration ads
- Keeps the tone premium instead of overly promotional`,
  },
  {
    id: 'project_travel_editorial-user-2',
    role: 'user',
    content:
      'Give me two more cuts that feel campaign-ready: one with movement and one that can work as a cleaner square social post.',
  },
  {
    id: 'project_travel_editorial-assistant-2',
    role: 'assistant',
    content: `### Campaign-ready companions

![Open Road Campaign Frame](${travelEditorialImages[1].src})

Road-led frame that adds motion and a stronger sense of journey.

![Beach Resort Social Cut](${travelEditorialImages[2].src})

Square social cut that reads quickly while still keeping the destination feel.`,
  },
];

const travelEditorialImageSets: MockStudioImageSet[] = [
  createImageSet(
    'travel-editorial-set-1',
    travelEditorialMessages[0].content,
    [travelEditorialImages[0]],
    'Destination opener'
  ),
  createImageSet(
    'travel-editorial-set-2',
    travelEditorialMessages[2].content,
    [travelEditorialImages[1], travelEditorialImages[2]],
    'Campaign companions'
  ),
];

const travelEditorialSettings = createStudioSettings({
  name: 'Travel Editorial Concept Pack',
  prompt:
    'Elevated destination campaign creative with transportive hero imagery and cleaner social-ready companion cuts.',
  referenceImages: [createReferenceImage(travelEditorialImages[0])],
  primaryGoal: 'Brand awareness',
  voiceTones: ['sophisticated', 'friendly'],
  colorPalette: ['#12344D', '#1F6F8B', '#4AA3A2', '#DFF3E3', '#F4D35E'],
  typography: 'Merriweather',
  adStyles: ['editorial', 'cinematic', 'lifestyle'],
  visualGuidelines: ['Layered depth', 'Negative space', 'Gradient'],
  ageRange: [28, 60],
  gender: 'All',
  interests: ['travel', 'luxury escapes', 'beach destinations', 'road trips'],
  geography: ['United States', 'United Kingdom', 'Europe'],
});

const STUDIO_PROJECT_CONVERSATIONS: Omit<MockStudioConversation, 'type'>[] = [
  {
    id: 'project_recovery_launch',
    title: 'Recovery Launch Portrait Study',
    coverImage: recoveryLaunchImages[0].src,
    messages: recoveryLaunchMessages,
    images: recoveryLaunchImages,
    settings: recoveryLaunchSettings,
    imageSets: recoveryLaunchImageSets,
  },
  {
    id: 'project_editorial_series',
    title: 'Streetwear Editorial Iterations',
    coverImage: editorialSeriesImages[0].src,
    messages: editorialSeriesMessages,
    images: editorialSeriesImages,
    settings: editorialSeriesSettings,
    imageSets: editorialSeriesImageSets,
  },
  {
    id: 'project_product_motion',
    title: 'Product Motion and Studio Set',
    coverImage: productMotionImages[0].src,
    messages: productMotionMessages,
    images: productMotionImages,
    settings: productMotionSettings,
    imageSets: productMotionImageSets,
  },
  {
    id: 'project_hospitality_refresh',
    title: 'Hospitality Brand Refresh',
    coverImage: hospitalityRefreshImages[0].src,
    messages: hospitalityRefreshMessages,
    images: hospitalityRefreshImages,
    settings: hospitalityRefreshSettings,
    imageSets: hospitalityRefreshImageSets,
  },
  {
    id: 'project_wellness_campaign',
    title: 'Wellness Social Campaign System',
    coverImage: wellnessCampaignImages[0].src,
    messages: wellnessCampaignMessages,
    images: wellnessCampaignImages,
    settings: wellnessCampaignSettings,
    imageSets: wellnessCampaignImageSets,
  },
  {
    id: 'project_food_launch',
    title: 'Food Launch Creative Sprint',
    coverImage: foodLaunchImages[0].src,
    messages: foodLaunchMessages,
    images: foodLaunchImages,
    settings: foodLaunchSettings,
    imageSets: foodLaunchImageSets,
  },
  {
    id: 'project_travel_editorial',
    title: 'Travel Editorial Concept Pack',
    coverImage: travelEditorialImages[0].src,
    messages: travelEditorialMessages,
    images: travelEditorialImages,
    settings: travelEditorialSettings,
    imageSets: travelEditorialImageSets,
  },
];

export const MOCK_STUDIO_PROJECTS: MockConversation[] =
  STUDIO_PROJECT_CONVERSATIONS.map((conversation) => ({
    ...conversation,
    type: 'studio',
  }));
