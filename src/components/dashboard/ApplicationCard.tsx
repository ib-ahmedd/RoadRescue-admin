import { useState } from "react";
import { SERVICE_DETAILS } from "@/lib/constants";
import type { Application } from "@/lib/types";
import LicenseImageLightbox from "@/components/dashboard/LicenseImageLightbox";
import styles from "@/app/Dashboard.module.css";

interface ApplicationCardProps {
  app: Application;
  isExpanded: boolean;
  onToggle: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function ApplicationCard({
  app,
  isExpanded,
  onToggle,
  onApprove,
  onReject,
}: ApplicationCardProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <div
      className={`${styles.appCard} ${isExpanded ? styles.appCardExpanded : ""}`}
      style={{
        borderLeftColor:
          app.status === "pending"
            ? "var(--amber)"
            : app.status === "approved"
              ? "var(--success)"
              : "var(--danger)",
      }}
    >
      <button type="button" className={styles.appSummary} onClick={onToggle} aria-expanded={isExpanded}>
        <div className={styles.appSummaryMain}>
          <div
            className={styles.appAvatar}
            style={{
              background:
                app.status === "approved"
                  ? "rgba(34,197,94,0.08)"
                  : app.status === "rejected"
                    ? "rgba(239,68,68,0.08)"
                    : "rgba(245,158,11,0.08)",
              color:
                app.status === "approved"
                  ? "var(--success)"
                  : app.status === "rejected"
                    ? "var(--danger)"
                    : "var(--amber)",
            }}
          >
            {app.avatar}
          </div>
          <div className={styles.appSummaryText}>
            <div className={styles.appSummaryTop}>
              <span
                className={`badge ${
                  app.status === "pending"
                    ? "badge-amber"
                    : app.status === "approved"
                      ? "badge-success"
                      : "badge-danger"
                }`}
                style={{ fontSize: "0.6rem" }}
              >
                {app.status.toUpperCase()}
              </span>
              <span className={styles.appId}>{app.id}</span>
            </div>
            <h4 className={styles.appName}>{app.name}</h4>
            <p className={styles.appMeta}>
              {SERVICE_DETAILS[app.speciality] ?? app.speciality}
              <span className={styles.appMetaDot}>·</span>
              {new Date(app.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <span className={`${styles.appChevron} ${isExpanded ? styles.appChevronOpen : ""}`} aria-hidden>
          ▾
        </span>
      </button>

      {isExpanded && (
        <div className={styles.appDetails}>
          <div className={styles.appDetailsGrid}>
            <div>
              <span className={styles.appDetailLabel}>Phone</span>
              <a href={`tel:${app.phone}`} className={styles.appDetailValue}>
                {app.phone}
              </a>
            </div>
            <div>
              <span className={styles.appDetailLabel}>License / ID Number</span>
              <span className={styles.appDetailValue} style={{ fontFamily: "monospace" }}>
                {app.licenseId}
              </span>
            </div>
            <div>
              <span className={styles.appDetailLabel}>Speciality</span>
              <span className={styles.appDetailValue} style={{ color: "var(--amber)" }}>
                {SERVICE_DETAILS[app.speciality] ?? app.speciality}
              </span>
            </div>
            <div>
              <span className={styles.appDetailLabel}>Service Vehicle</span>
              <span className={styles.appDetailValue}>{app.vehicle}</span>
            </div>
            <div>
              <span className={styles.appDetailLabel}>License Plate</span>
              <span className={styles.appDetailValue} style={{ fontFamily: "monospace" }}>
                {app.plate}
              </span>
            </div>
            <div>
              <span className={styles.appDetailLabel}>Submitted</span>
              <span className={styles.appDetailValue}>{new Date(app.createdAt).toLocaleString()}</span>
            </div>
          </div>

          {app.licenseImage && (
            <div className={styles.appLicenseBlock}>
              <span className={styles.appDetailLabel}>License / ID Photo</span>
              <span className={styles.appLicenseHint}>Click to enlarge</span>
              <button
                type="button"
                className={styles.appLicenseImgBtn}
                onClick={() => setLightboxOpen(true)}
                aria-label={`View enlarged license photo for ${app.name}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={app.licenseImage} alt={`${app.name} license`} className={styles.appLicenseImg} />
              </button>
              <LicenseImageLightbox
                open={lightboxOpen}
                src={app.licenseImage}
                alt={`${app.name} license`}
                caption={`${app.name} • ${app.licenseId}`}
                onClose={() => setLightboxOpen(false)}
              />
            </div>
          )}

          {app.status === "pending" && (
            <div className={styles.appActions}>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() => onReject(app.id)}
              >
                ✕ Reject
              </button>
              <button
                type="button"
                className="btn btn-outline-success btn-sm"
                onClick={() => onApprove(app.id)}
              >
                ✓ Approve & Register
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
