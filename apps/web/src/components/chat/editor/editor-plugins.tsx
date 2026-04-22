'use client';

import { MENTION_TRANSFORMER } from '@/components/chat/editor/mention-markdown';
import { $isListItemNode, ListItemNode } from '@lexical/list';
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  BOLD_ITALIC_STAR,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  HEADING,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  ORDERED_LIST,
  QUOTE,
  STRIKETHROUGH,
  UNORDERED_LIST,
} from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNearestNodeOfType } from '@lexical/utils';
import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  KEY_ENTER_COMMAND,
} from 'lexical';
import { Ref, RefObject, useEffect, useImperativeHandle, useRef } from 'react';

export const EDITOR_TRANSFORMERS = [
  MENTION_TRANSFORMER,
  HEADING,
  QUOTE,
  UNORDERED_LIST,
  ORDERED_LIST,
  BOLD_ITALIC_STAR,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  STRIKETHROUGH,
];

export interface EditorHandle {
  focus: () => void;
  clear: () => void;
}

interface EditorRefPluginProps {
  editorRef?: Ref<EditorHandle>;
}

export const EditorRefPlugin = ({ editorRef }: EditorRefPluginProps) => {
  const [editor] = useLexicalComposerContext();

  useImperativeHandle(
    editorRef,
    () => ({
      focus: () => editor.focus(),
      clear: () => {
        editor.update(() => {
          const root = $getRoot();
          root.clear();
          root.append($createParagraphNode());
        });
      },
    }),
    [editor]
  );

  return null;
};

interface SubmitPluginProps {
  onSubmit?: () => void;
  isMentionMenuOpenRef?: RefObject<boolean>;
}

export const SubmitPlugin = ({
  onSubmit,
  isMentionMenuOpenRef,
}: SubmitPluginProps) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!onSubmit) {
      return;
    }

    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        if (!event) {
          return false;
        }

        if (isMentionMenuOpenRef?.current) {
          return false;
        }

        if (event.shiftKey) {
          event.preventDefault();
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) {
              return;
            }

            const anchorNode = selection.anchor.getNode();
            const listItem = $isListItemNode(anchorNode)
              ? anchorNode
              : $getNearestNodeOfType(anchorNode, ListItemNode);

            if (listItem && listItem.getTextContent() === '') {
              const list = listItem.getParent();
              const paragraph = $createParagraphNode();
              list?.insertAfter(paragraph);
              listItem.remove();
              if (list && list.getChildrenSize() === 0) {
                list.remove();
              }
              paragraph.select();
              return;
            }

            selection.insertParagraph();
          });
          return true;
        }

        event.preventDefault();
        onSubmit();
        return true;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, onSubmit, isMentionMenuOpenRef]);

  return null;
};

interface ValueSyncPluginProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const ValueSyncPlugin = ({
  value,
  onValueChange,
}: ValueSyncPluginProps) => {
  const [editor] = useLexicalComposerContext();
  const lastEmittedRef = useRef<string | null>(null);
  const hasHydratedRef = useRef(false);

  useEffect(() => {
    if (!hasHydratedRef.current) {
      hasHydratedRef.current = true;
      editor.update(() => {
        $convertFromMarkdownString(value, EDITOR_TRANSFORMERS);
      });
      lastEmittedRef.current = value;
      return;
    }

    if (value === lastEmittedRef.current) {
      return;
    }

    editor.update(() => {
      $convertFromMarkdownString(value, EDITOR_TRANSFORMERS);
    });
    lastEmittedRef.current = value;
  }, [editor, value]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const markdown = $convertToMarkdownString(EDITOR_TRANSFORMERS);
        if (markdown === lastEmittedRef.current) {
          return;
        }
        lastEmittedRef.current = markdown;
        onValueChange(markdown);
      });
    });
  }, [editor, onValueChange]);

  return null;
};
