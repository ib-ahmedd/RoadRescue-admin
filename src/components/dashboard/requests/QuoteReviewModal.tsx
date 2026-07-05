"use client";

import type { RequestData } from "@/lib/types";
import styles from "./QuoteReviewModal.module.css";

const QUOTE_STATUS_LABELS: Record<NonNullable<RequestData["quoteStatus"]>, string> = {
  none: "None",
  pending: "Pending review",
  approved: "Approved",
  rejected: "Rejected",
  paid: "Paid",
};

interface QuoteReviewModalProps {
  open: boolean;
  request: RequestData;
  submitting?: boolean;
  onClose: () => void;
  onApprove: (id: string) => void | Promise<void>;
  onReject: (id: string) => void | Promise<void>;
}

export default function QuoteReviewModal({
  open,
  request,
  submitting = false,
  onClose,
  onApprove,
  onReject,
}: QuoteReviewModalProps) {
  if (!open) return null;

  const quoteStatus = request.quoteStatus ?? "none";
  const isPending = quoteStatus === "pending";

  const handleApprove = async () => {
    await onApprove(request.id);
  };

  const handleReject = async () => {
    await onReject(request.id);
  };

  return (
    <div
      className={styles.overlay}
      onClick={() => !submitting && onClose()}
      role="presentation"
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-review-title"
      >
        <div className={styles.header}>
          <div>
            <span className="badge badge-amber">Service Quote</span>
            <h2 id="quote-review-title" className={styles.title}>
              Technician Service Quote
            </h2>
            <span className="badge badge-info" style={{ marginTop: "0.5rem" }}>
              {QUOTE_STATUS_LABELS[quoteStatus]}
            </span>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className={styles.body}>
          <div>
            <span className={styles.label}>Technician assessment</span>
            <div className={styles.assessment}>
              {request.technicianAssessment || "No assessment provided."}
            </div>
          </div>

          <div>
            <span className={styles.label}>Quote amount</span>
            <p className={styles.amount}>
              {request.quoteAmount
                ? `₦${request.quoteAmount.toLocaleString("en-NG")}`
                : "—"}
            </p>
            <p className={styles.amountNote}>
              Additional service charge on top of the booking fee already paid by the customer.
            </p>
          </div>

          {request.quotePaymentReference && (
            <div>
              <span className={styles.label}>Quote payment reference</span>
              <p className={styles.reference}>{request.quotePaymentReference}</p>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          {isPending ? (
            <div className={styles.actions}>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleApprove}
                disabled={submitting}
              >
                {submitting ? "Processing..." : "Approve quote"}
              </button>
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={handleReject}
                disabled={submitting}
              >
                Reject quote
              </button>
            </div>
          ) : (
            <button type="button" className="btn btn-outline w-full" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
