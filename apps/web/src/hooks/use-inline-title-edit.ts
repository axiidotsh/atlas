'use client';

import { useEffect, useRef, useState } from 'react';

interface InlineTitleEditResult {
  isEditing: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  startEditing: () => void;
  stopEditing: () => void;
  handleDropdownCloseAutoFocus: (event: Event) => void;
}

export function useInlineTitleEdit(): InlineTitleEditResult {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldKeepInputFocusedRef = useRef(false);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const frameId = requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });

    return () => cancelAnimationFrame(frameId);
  }, [isEditing]);

  function startEditing() {
    shouldKeepInputFocusedRef.current = true;
    setIsEditing(true);
  }

  function stopEditing() {
    setIsEditing(false);
  }

  function handleDropdownCloseAutoFocus(event: Event) {
    if (!shouldKeepInputFocusedRef.current) {
      return;
    }

    event.preventDefault();
    shouldKeepInputFocusedRef.current = false;

    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }

  return {
    isEditing,
    inputRef,
    startEditing,
    stopEditing,
    handleDropdownCloseAutoFocus,
  };
}
