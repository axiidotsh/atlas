'use client';

import { Input } from '@/components/ui/input';
import { XIcon } from 'lucide-react';
import { type KeyboardEvent, useState } from 'react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export const TagInput = ({ tags, onChange, placeholder }: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const trimmed = inputValue.trim();
      if (trimmed && !tags.includes(trimmed)) {
        onChange([...tags, trimmed]);
      }
      setInputValue('');
    }

    if (event.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }

  function handleRemove(tag: string) {
    onChange(tags.filter((t) => t !== tag));
  }

  return (
    <div className="border-input focus-within:border-ring focus-within:ring-ring/50 flex flex-wrap items-center gap-1.5 rounded-md border bg-transparent px-2.5 py-2 shadow-xs focus-within:ring-3">
      {tags.map((tag) => (
        <span
          key={tag}
          className="bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded-full py-0.5 pr-1.5 pl-2.5 text-xs font-medium"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove(tag);
            }}
            className="hover:bg-muted-foreground/20 cursor-pointer rounded-full p-0.5 transition-colors"
          >
            <XIcon className="size-3" />
          </button>
        </span>
      ))}
      <Input
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="h-5 min-w-24 flex-1 rounded-none border-0 bg-transparent! p-0 shadow-none focus-visible:border-0 focus-visible:ring-0"
      />
    </div>
  );
};
