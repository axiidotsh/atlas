import { MentionChip } from '@/components/chat/mention-chip';
import type { AdPlatform } from '@/mock-data/types';
import {
  $applyNodeReplacement,
  DecoratorNode,
  DOMConversionMap,
  DOMExportOutput,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';
import type { JSX } from 'react';

export interface MentionPayload {
  mentionId: string;
  name: string;
  platform: AdPlatform;
}

export type SerializedMentionNode = Spread<
  MentionPayload,
  SerializedLexicalNode
>;

export class MentionNode extends DecoratorNode<JSX.Element> {
  __mentionId: string;
  __name: string;
  __platform: AdPlatform;

  static getType(): string {
    return 'mention';
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(
      {
        mentionId: node.__mentionId,
        name: node.__name,
        platform: node.__platform,
      },
      node.__key
    );
  }

  constructor(payload: MentionPayload, key?: NodeKey) {
    super(key);
    this.__mentionId = payload.mentionId;
    this.__name = payload.name;
    this.__platform = payload.platform;
  }

  static importJSON(serializedNode: SerializedMentionNode): MentionNode {
    return $createMentionNode({
      mentionId: serializedNode.mentionId,
      name: serializedNode.name,
      platform: serializedNode.platform,
    });
  }

  exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      type: 'mention',
      version: 1,
      mentionId: this.__mentionId,
      name: this.__name,
      platform: this.__platform,
    };
  }

  static importDOM(): DOMConversionMap | null {
    return null;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('span');
    element.setAttribute('data-lexical-mention', 'true');
    element.setAttribute('data-mention-id', this.__mentionId);
    element.setAttribute('data-mention-platform', this.__platform);
    element.textContent = `@${this.__name}`;
    return { element };
  }

  createDOM(): HTMLElement {
    const span = document.createElement('span');
    span.className = 'align-baseline';
    return span;
  }

  updateDOM(): false {
    return false;
  }

  isInline(): true {
    return true;
  }

  isKeyboardSelectable(): true {
    return true;
  }

  getTextContent(): string {
    return `@${this.__name}`;
  }

  getMentionId(): string {
    return this.__mentionId;
  }

  getName(): string {
    return this.__name;
  }

  getPlatform(): AdPlatform {
    return this.__platform;
  }

  decorate(): JSX.Element {
    return <MentionChip name={this.__name} platform={this.__platform} />;
  }
}

export function $createMentionNode(payload: MentionPayload): MentionNode {
  return $applyNodeReplacement(new MentionNode(payload));
}

export function $isMentionNode(
  node: LexicalNode | null | undefined
): node is MentionNode {
  return node instanceof MentionNode;
}
