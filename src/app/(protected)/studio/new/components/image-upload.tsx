'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';
import { ImagePlusIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import { type DragEvent, useRef, useState } from 'react';
import type { ReferenceImageValue } from '../schema';

interface ImageUploadProps {
  images: ReferenceImageValue[];
  onChange: (images: ReferenceImageValue[]) => void;
  multiple?: boolean;
  label?: string;
}

export const ImageUpload = ({
  images,
  onChange,
  multiple = true,
  label = 'Drop images here or click to upload',
}: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function processFiles(files: FileList | null) {
    if (!files) return;

    const newImages: ReferenceImageValue[] = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        preview: URL.createObjectURL(file),
      }));

    if (multiple) {
      onChange([...images, ...newImages]);
    } else {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
      onChange(newImages.slice(0, 1));
    }
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    setIsDragging(false);
    processFiles(event.dataTransfer.files);
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleRemove(id: string) {
    const img = images.find((i) => i.id === id);
    if (img) URL.revokeObjectURL(img.preview);
    onChange(images.filter((i) => i.id !== id));
  }

  const hidePicker = !multiple && images.length > 0;

  return (
    <div className="space-y-3">
      {!hidePicker && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragging(false)}
          className={cn(
            'flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-sm transition-all',
            isDragging
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-border text-muted-foreground hover:border-primary/40 hover:bg-accent/30'
          )}
        >
          <div
            className={cn(
              'flex size-10 items-center justify-center rounded-full transition-colors',
              isDragging ? 'bg-primary/10' : 'bg-muted'
            )}
          >
            <ImagePlusIcon className="size-5" />
          </div>
          <span className="text-xs">{label}</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(event) => {
          processFiles(event.target.files);
          event.target.value = '';
        }}
      />
      {images.length > 0 && (
        <div
          className={cn(
            'grid gap-2',
            multiple
              ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5'
              : 'max-w-32 grid-cols-1'
          )}
        >
          {images.map((image) => (
            <div key={image.id} className="relative aspect-square">
              <Image
                src={image.preview}
                alt={image.name}
                fill
                unoptimized
                className="rounded-md border object-cover"
              />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute -top-2 -right-2 size-7 rounded-full"
                onClick={() => handleRemove(image.id)}
              >
                <XIcon className="size-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
