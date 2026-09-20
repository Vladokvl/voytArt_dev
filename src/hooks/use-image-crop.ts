import { useState, useRef, useEffect, type RefObject } from "react";
import { isHeicFile, convertHeicToJpeg } from "~/lib/heic-converter";

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
  maxVideoSizeMb = 50,
}: UseImageCropProps) {
  const [cropFile, setCropFile] = useState<File | null>(null);
  const createdUrlRef = useRef<string | null>(null);

  const updatePreviewUrl = (file: File) => {
    if (createdUrlRef.current) {
      URL.revokeObjectURL(createdUrlRef.current);
    }
    const newUrl = URL.createObjectURL(file);
    createdUrlRef.current = newUrl;
    setPreview(newUrl);
    return newUrl;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (createdUrlRef.current) {
        URL.revokeObjectURL(createdUrlRef.current);
      }
    };
  }, []);

  const processFile = async (file: File) => {
    let targetFile = file;
    if (isHeicFile(file)) {
      try {
        targetFile = await convertHeicToJpeg(file);
      } catch (err) {
        console.error("HEIC conversion failed:", err);
        alert("Не вдалося конвертувати HEIC файл. Будь ласка, спробуйте JPG або PNG.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
    }

    if (targetFile.type.startsWith("image/")) {
      // It's an image, open cropping modal
      setCropFile(targetFile);
    } else if (targetFile.type.startsWith("video/")) {
      // It's a video, perform validation and set directly
      const maxSize = maxVideoSizeMb * 1024 * 1024;
      if (targetFile.size > maxSize) {
        const sizeInMb = (targetFile.size / (1024 * 1024)).toFixed(1);
        alert(
          `Помилка: Відео занадто велике (${sizeInMb} MB).\n\n` +
          `Максимальний дозволений розмір для відео — ${maxVideoSizeMb} MB.\n` +
          `Будь ласка, стисніть це відео перед завантаженням (наприклад, скористайтеся безкоштовним сервісом clideo.com або online-convert.com).`
        );
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      const dt = new DataTransfer();
      dt.items.add(targetFile);
      if (fileInputRef.current) fileInputRef.current.files = dt.files;

      updatePreviewUrl(targetFile);
      if (setPreviewType) setPreviewType("video");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void processFile(file);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      void processFile(file);
    }
  };

  const onCropSave = (croppedFile: File) => {
    const dt = new DataTransfer();
    dt.items.add(croppedFile);
    if (fileInputRef.current) fileInputRef.current.files = dt.files;

    updatePreviewUrl(croppedFile);
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
