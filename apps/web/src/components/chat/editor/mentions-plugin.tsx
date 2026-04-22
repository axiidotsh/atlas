'use client';

import { $createMentionNode } from '@/components/chat/editor/mention-node';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/utils/utils';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  TextNode,
} from 'lexical';
import {
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

export interface MentionPickerOption {
  id: string;
  name: string;
  searchValue: string;
  content: ReactNode;
  mentionPayload: Parameters<typeof $createMentionNode>[0];
}

class LexicalMentionOption extends MenuOption {
  readonly option: MentionPickerOption;

  constructor(option: MentionPickerOption) {
    super(option.id);
    this.option = option;
  }
}

interface MentionsPluginProps {
  options: MentionPickerOption[];
  menuContainerRef: RefObject<HTMLElement | null>;
  trigger?: string;
  isOpenRef?: RefObject<boolean>;
}

export const MentionsPlugin = ({
  options,
  trigger = '@',
  menuContainerRef,
  isOpenRef,
}: MentionsPluginProps) => {
  const [editor] = useLexicalComposerContext();
  const [query, setQuery] = useState<string | null>(null);

  const triggerFn = useBasicTypeaheadTriggerMatch(trigger, { minLength: 0 });

  const isMenuVisible =
    query !== null &&
    (query.length > 0
      ? options.some((option) =>
          option.searchValue.toLowerCase().includes(query.toLowerCase())
        )
      : options.length > 0);

  useEffect(() => {
    if (isOpenRef) {
      isOpenRef.current = isMenuVisible;
    }
    return () => {
      if (isOpenRef) {
        isOpenRef.current = false;
      }
    };
  }, [isMenuVisible, isOpenRef]);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = (query ?? '').toLowerCase();
    const filtered = normalizedQuery
      ? options.filter((option) =>
          option.searchValue.toLowerCase().includes(normalizedQuery)
        )
      : options;
    return filtered.map((option) => new LexicalMentionOption(option));
  }, [options, query]);

  const onSelect = useCallback(
    (
      selectedOption: LexicalMentionOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void
    ) => {
      editor.update(() => {
        const mentionNode = $createMentionNode(
          selectedOption.option.mentionPayload
        );
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode);
        } else {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            selection.insertNodes([mentionNode]);
          }
        }
        const spaceNode = $createTextNode(' ');
        mentionNode.insertAfter(spaceNode);
        spaceNode.select();
        closeMenu();
      });
    },
    [editor]
  );

  return (
    <LexicalTypeaheadMenuPlugin<LexicalMentionOption>
      onQueryChange={setQuery}
      onSelectOption={onSelect}
      triggerFn={triggerFn}
      options={filteredOptions}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) => {
        if (filteredOptions.length === 0) {
          return null;
        }

        const portalTarget = menuContainerRef.current;
        if (!portalTarget) {
          return null;
        }

        const menu = (
          <div className="bg-popover border-primary/20 dark:border-primary/10 absolute inset-x-0 bottom-full z-50 mx-auto w-[92%] max-w-none overflow-hidden rounded-t-xl border border-b-0">
            <ScrollArea className="w-full">
              <div className="max-h-60 w-full p-1">
                {filteredOptions.map((option, index) => (
                  <div
                    key={option.option.id}
                    ref={option.setRefElement}
                    role="option"
                    aria-selected={selectedIndex === index}
                    tabIndex={-1}
                    className={cn(
                      'flex w-full min-w-0 cursor-pointer items-center gap-2 rounded-md px-2.5 py-2',
                      selectedIndex === index && 'bg-accent'
                    )}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      selectOptionAndCleanUp(option);
                    }}
                  >
                    {option.option.content}
                  </div>
                ))}
                <div className="h-1 w-full" />
              </div>
            </ScrollArea>
          </div>
        );

        return createPortal(menu, portalTarget);
      }}
    />
  );
};
