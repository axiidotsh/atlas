'use client';

import { RefObject } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

interface Focusable {
  focus: () => void;
}

export const useFocusOnSlash = (inputRef: RefObject<Focusable | null>) => {
  useHotkeys(
    'slash',
    () => {
      inputRef.current?.focus();
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
