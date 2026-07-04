import { useState, type RefObject } from "react";

interface UseImageCropProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  setPreview: (url: string | null) => void;
  setPreviewType?: (type: "image" | "video" | null) => void;
  maxVideoSizeMb?: number;
}

export function useImageCrop({
  fileInputRef,
  setPreview,
  setPreviewType,
  maxVideoSizeMb = 15,
}: UseImageCropProps) {
  const [cropFile, setCropFile] = useState<File | null>(null);

  const processFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      // It's an image, open cropping modal
      setCropFile(file);
    } else if (file.type.startsWith("video/")) {
      // It's a video, perform validation and set directly
      const maxSize = maxVideoSizeMb * 1024 * 1024;
      if (file.size > maxSize) {
        const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
        alert(
          `Помилка: Відео занадто велике (${sizeInMb} MB).\n\n` +
          `Максимальний дозволений розмір для відео — ${maxVideoSizeMb} MB.\n` +
          `Будь ласка, стисніть це відео перед завантаженням (наприклад, скористайтеся безкоштовним сервісом clideo.com або online-convert.com).`
        );
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      const dt = new DataTransfer();
      dt.items.add(file);
      if (fileInputRef.current) fileInputRef.current.files = dt.files;

      setPreview(URL.createObjectURL(file));
      if (setPreviewType) setPreviewType("video");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const onCropSave = (croppedFile: File) => {
    const dt = new DataTransfer();
    dt.items.add(croppedFile);
    if (fileInputRef.current) fileInputRef.current.files = dt.files;

    setPreview(URL.createObjectURL(croppedFile));
    if (setPreviewType) setPreviewType("image");
    setCropFile(null);
  };

  const onCropCancel = () => {
    setCropFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    cropFile,
    setCropFile,
    handleFileChange,
    handleFileDrop,
    onCropSave,
    onCropCancel,
  };
}
