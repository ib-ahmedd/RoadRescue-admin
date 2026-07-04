"use client";

import { useEffect } from "react";
import styles from "./LicenseImageLightbox.module.css";

interface LicenseImageLightboxProps {
  open: boolean;
  src: string;
  alt: string;
  caption?: string;
  onClose: () => void;
}

export default function LicenseImageLightbox({
  open,
  src,
  alt,
  caption,
  onClose,
}: LicenseImageLightboxProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="License photo preview"
      onClick={onClose}
    >
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeBtn}
          aria-label="Close preview"
          onClick={onClose}
        >
          ×
        </button>
        <div className={styles.imageWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className={styles.image} />
        </div>
        {caption && <p className={styles.caption}>{caption}</p>}
      </div>
    </div>
  );
}
