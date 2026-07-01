"use client";

import { useState } from "react";
import { SERVICE_DETAILS } from "@/lib/constants";
import type { Provider, RequestData } from "@/lib/types";
import DispatchSection from "./DispatchSection";
import QuoteReviewModal from "./QuoteReviewModal";
import StatusProgressMonitor from "./StatusProgressMonitor";
import styles from "@/app/Dashboard.module.css";

interface RequestDetailPanelProps {
  request: RequestData | null;
  providers: Provider[];
  onUpdateRequest: (id: string, updates: Partial<RequestData>) => void;
  onDispatch: (request: RequestData, provider: Provider) => void;
  onQuoteApproval: (id: string, action: "approve" | "reject") => Promise<boolean>;
}

const QUOTE_STATUS_LABELS: Record<NonNullable<RequestData["quoteStatus"]>, string> = {
  none: "None",
  pending: "Pending review",
  approved: "Approved",
  rejected: "Rejected",
  paid: "Paid",
};

export default function RequestDetailPanel({
  request,
  providers,
  onUpdateRequest,
  onDispatch,
  onQuoteApproval,
}: RequestDetailPanelProps) {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);

  if (!request) {
    return (
      <div className={styles.detailsPanel}>
        <div className={styles.emptyDetails}>
          <span className={styles.emptyIcon}>🚨</span>
          <h3>No Assistance Incident Selected</h3>
          <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
            Select a roadside dispatch ticket from the left panel to review notes, coordinates, and dispatch
            operations.
          </p>
        </div>
      </div>
    );
  }

  const handleQuoteAction = async (action: "approve" | "reject") => {
    setQuoteSubmitting(true);
    try {
      const ok = await onQuoteApproval(request.id, action);
      if (ok) setShowQuoteModal(false);
    } finally {
      setQuoteSubmitting(false);
    }
  };

  return (
    <>
      <div className={styles.detailsPanel}>
        <div>
          <div className={styles.detailHeader}>
            <div>
              <span className="badge badge-amber" style={{ marginBottom: "0.5rem" }}>
                Rescue Mission Details
              </span>
              <h3 className={styles.detailTitle}>{request.name}</h3>
              <span className={styles.detailId}>Ticket ID: {request.id}</span>
            </div>
            <div className={styles.detailActions}>
              <a href={`tel:${request.phone}`} className="btn btn-outline">
                📞 Contact Driver
              </a>
            </div>
          </div>

          <div className={styles.contactBar}>
            <span className={styles.contactText}>Operational Dispatch Protocol: Log confirmation call</span>
            <label className={styles.contactCheckboxWrap}>
              <input
                type="checkbox"
                style={{ width: "16px", height: "16px", cursor: "pointer" }}
                checked={request.contacted}
                onChange={(e) => onUpdateRequest(request.id, { contacted: e.target.checked })}
              />
              Client Contacted
            </label>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoBlock}>
              <span className={styles.infoLabel}>Requested Assistance</span>
              <span className={styles.infoValue} style={{ color: "var(--amber)" }}>
                {SERVICE_DETAILS[request.service] || request.service}
              </span>
            </div>
            <div className={styles.infoBlock}>
              <span className={styles.infoLabel}>Stranded Coordinates / Address</span>
              <span className={styles.infoValue}>📍 {request.location}</span>
            </div>
            <div className={styles.infoBlock}>
              <span className={styles.infoLabel}>Vehicle Specifications</span>
              <span className={styles.infoValue}>
                {[request.vehicleYear, request.vehicleMake, request.vehicleModel, request.vehicleColor]
                  .filter(Boolean)
                  .join(" ") || "Unspecified Vehicle"}
              </span>
            </div>
            <div className={styles.infoBlock}>
              <span className={styles.infoLabel}>Driver Primary Phone</span>
              <span className={styles.infoValue}>{request.phone}</span>
            </div>
            <div className={styles.infoBlock}>
              <span className={styles.infoLabel}>Booking Fee Paid</span>
              <span className={styles.infoValue} style={{ color: "var(--success)" }}>
                {request.bookingFee
                  ? `₦${request.bookingFee.toLocaleString("en-NG")}`
                  : "Not recorded"}
              </span>
            </div>
            <div className={styles.infoBlock}>
              <span className={styles.infoLabel}>Payment Reference</span>
              <span className={styles.infoValue} style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                {request.paymentReference || "—"}
              </span>
            </div>
          </div>

          {request.quoteStatus && request.quoteStatus !== "none" && (
            <div className={styles.quoteNotice}>
              <div>
                <p className={styles.quoteNoticeTitle}>Technician quote submitted</p>
                <p className={styles.quoteNoticeSub}>
                  Status: {QUOTE_STATUS_LABELS[request.quoteStatus]}
                </p>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setShowQuoteModal(true)}
              >
                View quote
              </button>
            </div>
          )}

          {request.landmark && (
            <>
              <h4 className={styles.sectionTitle}>🗺️ Nearby Landmark</h4>
              <p
                className={styles.problemDesc}
                style={{ background: "rgba(59,130,246,0.02)", borderColor: "rgba(59,130,246,0.08)" }}
              >
                {request.landmark}
              </p>
            </>
          )}

          <h4 className={styles.sectionTitle}>🛠️ Dispatcher Assessment Notes</h4>
          <p className={styles.problemDesc}>
            {request.notes || "No mechanical descriptions provided by customer."}
          </p>

          <h4 className={styles.sectionTitle}>👷 Dispatch Technician</h4>
          <div className={styles.dispatchSection}>
            <DispatchSection request={request} providers={providers} onDispatch={onDispatch} />
          </div>

          <StatusProgressMonitor request={request} />
        </div>
      </div>

      {request.quoteStatus && request.quoteStatus !== "none" && (
        <QuoteReviewModal
          open={showQuoteModal}
          request={request}
          submitting={quoteSubmitting}
          onClose={() => !quoteSubmitting && setShowQuoteModal(false)}
          onApprove={() => handleQuoteAction("approve")}
          onReject={() => handleQuoteAction("reject")}
        />
      )}
    </>
  );
}
