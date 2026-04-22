import {
  $createMentionNode,
  $isMentionNode,
  MentionNode,
} from '@/components/chat/editor/mention-node';
import type { AdPlatform } from '@/mock-data/types';
import type { TextMatchTransformer } from '@lexical/markdown';

const MENTION_URL_PREFIX = 'mention://';

function isAdPlatform(value: string): value is AdPlatform {
  return value === 'meta' || value === 'google';
}

export const MENTION_TRANSFORMER: TextMatchTransformer = {
  dependencies: [MentionNode],
  export: (node) => {
    if (!$isMentionNode(node)) {
      return null;
    }

    return `[@${node.getName()}](${MENTION_URL_PREFIX}${node.getPlatform()}/${node.getMentionId()})`;
  },
  importRegExp: /\[@([^\]]+)\]\(mention:\/\/(meta|google)\/([^\s)]+)\)/,
  regExp: /\[@([^\]]+)\]\(mention:\/\/(meta|google)\/([^\s)]+)\)$/,
  replace: (textNode, match) => {
    const [, name, platform, mentionId] = match;
    if (!isAdPlatform(platform)) {
      return;
    }

    const mentionNode = $createMentionNode({
      mentionId,
      name,
      platform,
    });
    textNode.replace(mentionNode);
  },
  type: 'text-match',
};
