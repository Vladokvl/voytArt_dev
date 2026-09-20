"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import {
  deleteCloudinaryAssetAction,
  deleteMultipleCloudinaryAssetsAction,
} from "../cloudinary-actions";
import styles from "./UnsavedUploadModal.module.scss";

interface UnsavedUploadContextType {
  hasUnsavedUploads: boolean;
  stagedUrls: string[];
  registerStagedUrl: (url: string) => void;
  discardStagedUrl: (url: string) => Promise<void>;
  commitStagedUrls: () => void;
}

const defaultContextValue: UnsavedUploadContextType = {
  hasUnsavedUploads: false,
  stagedUrls: [],
  registerStagedUrl: () => undefined,
  discardStagedUrl: () => Promise.resolve(),
  commitStagedUrls: () => undefined,
};

const UnsavedUploadContext = createContext<UnsavedUploadContextType>(defaultContextValue);

export function useUnsavedUploads() {
  return useContext(UnsavedUploadContext);
}

export function UnsavedUploadProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [stagedUrls, setStagedUrls] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const stagedUrlsRef = useRef<string[]>([]);
  stagedUrlsRef.current = stagedUrls;

  const isCommittedRef = useRef(false);

  const registerStagedUrl = useCallback((url: string) => {
    if (!url) return;
    setStagedUrls((prev) => (prev.includes(url) ? prev : [...prev, url]));
  }, []);

  const discardStagedUrl = useCallback(async (url: string) => {
    if (!url) return;
    // Check if this url was staged in this session
    const isStaged = stagedUrlsRef.current.includes(url);
    if (isStaged) {
      setStagedUrls((prev) => prev.filter((u) => u !== url));
      try {
        await deleteCloudinaryAssetAction(url);
      } catch (err) {
        console.error("Failed to delete discarded asset from Cloudinary:", err);
      }
    }
  }, []);

  const commitStagedUrls = useCallback(() => {
    isCommittedRef.current = true;
    setStagedUrls([]);
  }, []);

  // Listen to beforeunload (tab close / reload)
  useEffect(() => {
    if (stagedUrls.length === 0) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (stagedUrlsRef.current.length > 0 && !isCommittedRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    const handlePageHide = () => {
      if (stagedUrlsRef.current.length > 0 && !isCommittedRef.current) {
        const payload = JSON.stringify({ urls: stagedUrlsRef.current });
        navigator.sendBeacon("/api/admin/cloudinary/delete", payload);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [stagedUrls.length]);

  // Intercept click on internal links if there are staged uploads
  useEffect(() => {
    if (stagedUrls.length === 0) return;

    const handleClickCapture = (e: MouseEvent) => {
      if (stagedUrlsRef.current.length === 0) return;

      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      // Ignore anchors, external links, download links, new tab links
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        target.getAttribute("target") === "_blank"
      ) {
        return;
      }

      // Check if clicking the exact current URL
      if (href === window.location.pathname) return;

      e.preventDefault();
      e.stopPropagation();
      setPendingUrl(href);
      setModalOpen(true);
    };

    document.addEventListener("click", handleClickCapture, true);
    return () => {
      document.removeEventListener("click", handleClickCapture, true);
    };
  }, [stagedUrls.length]);

  // Handle cancel stay
  const handleStay = () => {
    if (isDeleting) return;
    setModalOpen(false);
    setPendingUrl(null);
  };

  // Handle confirm exit & delete
  const handleConfirmExit = async () => {
    setIsDeleting(true);
    const urlsToDelete = [...stagedUrlsRef.current];

    try {
      if (urlsToDelete.length > 0) {
        await deleteMultipleCloudinaryAssetsAction(urlsToDelete);
      }
    } catch (err) {
      console.error("Error deleting assets on exit:", err);
    } finally {
      setIsDeleting(false);
      setStagedUrls([]);
      setModalOpen(false);
      if (pendingUrl) {
        router.push(pendingUrl);
      }
    }
  };

  return (
    <UnsavedUploadContext.Provider
      value={{
        hasUnsavedUploads: stagedUrls.length > 0,
        stagedUrls,
        registerStagedUrl,
        discardStagedUrl,
        commitStagedUrls,
      }}
    >
      {children}

      {/* Confirmation Modal */}
      {modalOpen && (
        <div
          className={styles.backdrop}
          onClick={handleStay}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.header}>
              <div className={styles.iconWrapper}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className={styles.title}>Незбережені зміни</h3>
                <p className={styles.description}>
                  Ви завантажили нове фото, але форму ще не збережено.
                </p>
              </div>
            </div>

            <div className={styles.alertBox}>
              ⚠️ Якщо ви вийдете зараз, тимчасово завантажене фото буде
              автоматично видалено з Cloudinary для запобігання засміченню сховища.
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={handleStay}
                disabled={isDeleting}
              >
                Залишитися
              </button>
              <button
                type="button"
                className={styles.confirmBtn}
                onClick={handleConfirmExit}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className={styles.spinner} />
                    <span>Видалення фото...</span>
                  </>
                ) : (
                  <span>Вийти та видалити фото</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </UnsavedUploadContext.Provider>
  );
}
