import React, { useRef } from 'react';

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  children: React.ReactNode;
}

export function ImageUploader({ onUpload, children }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onUpload(event.target.result.toString());
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div onClick={() => inputRef.current?.click()}>
      {children}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}