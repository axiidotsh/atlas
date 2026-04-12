'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';
import { ImagePlusIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import type { ReferenceImageValue } from '../../project-form';

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
  function processFiles(files: File[]) {
    if (files.length === 0) return;

    const newImages: ReferenceImageValue[] = files
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

  function handleRemove(id: string) {
    const img = images.find((i) => i.id === id);
    if (img) URL.revokeObjectURL(img.preview);
    onChange(images.filter((i) => i.id !== id));
  }

  const hidePicker = !multiple && images.length > 0;
  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    multiple,
    maxFiles: multiple ? undefined : 1,
    onDrop: processFiles,
  });

  return (
    <div className="space-y-3">
      {!hidePicker && (
        <div
          {...getRootProps()}
          className={cn(
            'flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-sm transition-all',
            isDragActive
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-border text-muted-foreground hover:border-primary/40 hover:bg-accent/30'
          )}
        >
          <input {...getInputProps()} />
          <div
            className={cn(
              'flex size-10 items-center justify-center rounded-full transition-colors',
              isDragActive ? 'bg-primary/10' : 'bg-muted'
            )}
          >
            <ImagePlusIcon className="size-5" />
          </div>
          <span className="text-xs">{label}</span>
        </div>
      )}
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
