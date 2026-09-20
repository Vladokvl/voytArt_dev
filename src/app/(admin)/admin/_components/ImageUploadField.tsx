"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Upload, Trash2, Crop, AlertCircle } from "lucide-react";
import { uploadToCloudinary } from "~/lib/cloudinary-client";
import LazyImageCropModal from "~/components/ui/ImageCropModal/LazyImageCropModal";
import styles from "./ImageUploadField.module.scss";

export interface ImageUploadFieldProps {
  name: string;
  label: string;
  folder: string;
  initialUrl?: string | null;
  aspectRatio?: number;
  required?: boolean;
  helpText?: string;
  maxSizeMb?: number;
  onChange?: (url: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
}

export default function ImageUploadField({
  name,
  label,
  folder,
  initialUrl = null,
  aspectRatio,
  required = false,
  helpText,
  maxSizeMb = 5,
  onChange,
  onUploadingChange,
}: ImageUploadFieldProps) {
  const [currentUrl, setCurrentUrl] = useState<string>(initialUrl ?? "");
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl ?? null);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const rawFileRef = useRef<File | null>(null);

  // Sync with initialUrl if it changes from outside
  useEffect(() => {
    if (initialUrl !== undefined && initialUrl !== null) {
      setCurrentUrl(initialUrl);
      setPreviewUrl(initialUrl);
    }
  }, [initialUrl]);

  // Notify parent of uploading state
  useEffect(() => {
    onUploadingChange?.(isUploading);
  }, [isUploading, onUploadingChange]);

  const handleSelectFile = (file: File) => {
    setUploadError(null);

    // Validate size limit before opening crop
    if (file.size > maxSizeMb * 1024 * 1024) {
      setUploadError(
        `Файл занадто великий (${(file.size / (1024 * 1024)).toFixed(1)} MB). Максимум: ${maxSizeMb} MB.`
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    rawFileRef.current = file;
    setCropFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleSelectFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) {
      handleSelectFile(file);
    }
  };

  const handleCropSave = async (croppedFile: File) => {
    setCropFile(null);

    // Show instant local preview while uploading
    const localBlobUrl = URL.createObjectURL(croppedFile);
    setPreviewUrl(localBlobUrl);
    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadedUrl = await uploadToCloudinary(croppedFile, folder);
      setCurrentUrl(uploadedUrl);
      setPreviewUrl(uploadedUrl);
      onChange?.(uploadedUrl);
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      const errMsg = err instanceof Error ? err.message : "Помилка завантаження фото в Cloudinary";
      setUploadError(errMsg);
      // Revert preview if upload failed
      setPreviewUrl(currentUrl || null);
    } finally {
      URL.revokeObjectURL(localBlobUrl);
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCropCancel = () => {
    setCropFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = () => {
    setCurrentUrl("");
    setPreviewUrl(null);
    setUploadError(null);
    onChange?.("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleOpenCropAgain = () => {
    if (rawFileRef.current) {
      setCropFile(rawFileRef.current);
    } else {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={styles.container}>
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={currentUrl} />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        style={{ display: "none" }}
        onChange={handleInputChange}
      />

      {/* Label */}
      <div className={styles.labelRow}>
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      </div>

      {/* States */}
      {isUploading ? (
        <div className={styles.uploadingBox}>
          <div className={styles.spinner} />
          <span>Завантаження на Cloudinary...</span>
        </div>
      ) : previewUrl ? (
        /* Preview Card */
        <div className={styles.previewCard}>
          <div className={styles.thumbnailWrapper}>
            <Image
              src={previewUrl}
              alt={label}
              width={300}
              height={200}
              unoptimized
              className={styles.thumbnailImg}
            />
          </div>
          <div className={styles.actionsRow}>
            <button
              type="button"
              className={styles.changeBtn}
              onClick={handleOpenCropAgain}
              title="Змінити або повторно обрізати фото"
            >
              <Crop size={14} />
              <span>Змінити / Обрізати</span>
            </button>
            <button
              type="button"
              className={styles.removeBtn}
              onClick={handleRemove}
              title="Видалити це фото"
            >
              <Trash2 size={14} />
              <span>Видалити</span>
            </button>
          </div>
        </div>
      ) : (
        /* Empty Dropzone */
        <div
          className={`${styles.dropZone} ${isDragOver ? styles.dragOver : ""}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
        >
          <div className={styles.iconWrap}>
            <Upload size={20} />
          </div>
          <div>
            <div className={styles.dropTitle}>Натисніть або перетягніть фото сюди</div>
            <div className={styles.dropSubtitle}>
              PNG, JPG, WebP до {maxSizeMb} MB
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className={styles.errorMessage}>
          <AlertCircle size={15} />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Help text */}
      {helpText && <span className={styles.helpText}>{helpText}</span>}

      {/* Crop Modal */}
      {cropFile && (
        <LazyImageCropModal
          open={Boolean(cropFile)}
          imageFile={cropFile}
          defaultAspect={aspectRatio}
          onCropSave={handleCropSave}
          onCancel={handleCropCancel}
          maxSizeMb={maxSizeMb}
        />
      )}
    </div>
  );
}
