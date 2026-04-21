'use client';

import { RefObject } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

export const useFocusOnSlash = (
  inputRef: RefObject<HTMLTextAreaElement | null>
) => {
  useHotkeys(
    'slash',
    () => {
      const input = inputRef.current;

      if (!input) {
        return;
      }

      input.focus();

      const cursorPosition = input.value.length;
      input.setSelectionRange(cursorPosition, cursorPosition);
    },
    {
      enabled: (event) =>
        Boolean(inputRef.current) &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey,
      enableOnFormTags: false,
      enableOnContentEditable: false,
      preventDefault: true,
    },
    [inputRef]
  );
};
