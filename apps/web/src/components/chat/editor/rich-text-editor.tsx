'use client';

import {
  EditorHandle,
  EditorRefPlugin,
  SubmitPlugin,
  ValueSyncPlugin,
} from '@/components/chat/editor/editor-plugins';
import { MentionNode } from '@/components/chat/editor/mention-node';
import {
  MentionPickerOption,
  MentionsPlugin,
} from '@/components/chat/editor/mentions-plugin';
import { ListItemNode, ListNode } from '@lexical/list';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { Ref, RefObject, useRef } from 'react';
import { EDITOR_TRANSFORMERS } from './editor-plugins';

const EDITOR_THEME = {
  paragraph: 'm-0',
  text: {
    bold: 'font-semibold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    code: 'bg-muted rounded px-1 font-mono text-[0.9em]',
  },
  list: {
    ul: 'list-disc pl-6',
    ol: 'list-decimal pl-6',
    listitem: 'my-0.5',
  },
  link: 'text-primary underline',
};

interface RichTextEditorBaseProps {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  editorRef?: Ref<EditorHandle>;
  className?: string;
}

interface RichTextEditorWithMentionsProps extends RichTextEditorBaseProps {
  mentionOptions: MentionPickerOption[];
  mentionMenuContainerRef: RefObject<HTMLElement | null>;
  mentionTrigger?: string;
}

interface RichTextEditorWithoutMentionsProps extends RichTextEditorBaseProps {
  mentionOptions?: undefined;
  mentionMenuContainerRef?: undefined;
  mentionTrigger?: undefined;
}

type RichTextEditorProps =
  | RichTextEditorWithMentionsProps
  | RichTextEditorWithoutMentionsProps;

export const RichTextEditor = ({
  value,
  onValueChange,
  onSubmit,
  placeholder,
  editorRef,
  mentionOptions,
  mentionTrigger,
  mentionMenuContainerRef,
  className,
}: RichTextEditorProps) => {
  const isMentionMenuOpenRef = useRef(false);

  const initialConfig = {
    namespace: 'ChatEditor',
    theme: EDITOR_THEME,
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, MentionNode],
    onError: (error: Error) => {
      throw error;
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              autoFocus
              className={
                className ??
                'h-20 overflow-y-auto px-3 py-2 text-sm outline-none'
              }
              aria-placeholder={placeholder || 'Ask me anything'}
              placeholder={
                <div className="text-muted-foreground pointer-events-none absolute inset-0 px-3 py-2 text-sm">
                  {placeholder || 'Ask me anything'}
                </div>
              }
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <ListPlugin />
        <MarkdownShortcutPlugin transformers={EDITOR_TRANSFORMERS} />
        <ValueSyncPlugin value={value} onValueChange={onValueChange} />
        <SubmitPlugin
          onSubmit={onSubmit}
          isMentionMenuOpenRef={isMentionMenuOpenRef}
        />
        <EditorRefPlugin editorRef={editorRef} />
        {mentionOptions && mentionOptions.length > 0 && (
          <MentionsPlugin
            options={mentionOptions}
            trigger={mentionTrigger}
            menuContainerRef={mentionMenuContainerRef}
            isOpenRef={isMentionMenuOpenRef}
          />
        )}
      </div>
    </LexicalComposer>
  );
};

export type { EditorHandle } from './editor-plugins';
