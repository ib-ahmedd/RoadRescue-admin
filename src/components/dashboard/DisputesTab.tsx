import StatusSummaryChips from "@/components/dashboard/StatusSummaryChips";
import type { Dispute } from "@/lib/types";
import styles from "@/app/Dashboard.module.css";

interface DisputesTabProps {
  disputes: Dispute[];
  onStatusChange: (id: string, status: Dispute["status"]) => void;
}

const DISPUTE_STATUSES = ["open", "reviewing", "resolved"] as const;

export default function DisputesTab({ disputes, onStatusChange }: DisputesTabProps) {
  const counts = {
    open: disputes.filter((d) => d.status === "open").length,
    reviewing: disputes.filter((d) => d.status === "reviewing").length,
    resolved: disputes.filter((d) => d.status === "resolved").length,
  };

  const colors = {
    open: "var(--danger)",
    reviewing: "var(--amber)",
    resolved: "var(--success)",
  };

  return (
    <div className={styles.inquiryList}>
      <StatusSummaryChips statuses={DISPUTE_STATUSES} counts={counts} colors={colors} />

      {disputes.length === 0 ? (
        <div className={styles.card} style={{ textAlign: "center", padding: "4rem" }}>
          <span style={{ fontSize: "2rem" }}>✅</span>
          <h4 style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>No disputes filed — all clear!</h4>
        </div>
      ) : (
        disputes.map((d) => (
          <div
            key={d.id}
            className={styles.inquiryItem}
            style={{
              borderLeft:
                d.status === "open"
                  ? "3px solid var(--danger)"
                  : d.status === "reviewing"
                    ? "3px solid var(--amber)"
                    : "3px solid var(--success)",
            }}
          >
            <div className={styles.inquiryHeader}>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.4rem",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    className={`badge ${
                      d.status === "open"
                        ? "badge-danger"
                        : d.status === "reviewing"
                          ? "badge-amber"
                          : "badge-success"
                    }`}
                    style={{ fontSize: "0.6rem" }}
                  >
                    {d.status.toUpperCase()}
                  </span>
                  <span style={{ fontFamily: "monospace", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    {d.id}
                  </span>
                  <span style={{ fontFamily: "monospace", fontSize: "0.72rem", color: "var(--amber)" }}>
                    → {d.requestId}
                  </span>
                </div>
                <h4 className={styles.inquiryTitle}>{d.customerName}</h4>
                <a href={`tel:${d.customerPhone}`} className={styles.inquiryEmail}>
                  {d.customerPhone}
                </a>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div className={styles.inquiryTime}>{new Date(d.createdAt).toLocaleString()}</div>
                {d.status !== "resolved" && (
                  <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.5rem", justifyContent: "flex-end" }}>
                    {d.status === "open" && (
                      <button
                        className="btn btn-outline btn-sm"
                        style={{
                          fontSize: "0.7rem",
                          padding: "0.25rem 0.6rem",
                          borderColor: "rgba(245,158,11,0.4)",
                          color: "var(--amber)",
                        }}
                        onClick={() => onStatusChange(d.id, "reviewing")}
                      >
                        Mark Reviewing
                      </button>
                    )}
                    <button
                      className="btn btn-outline btn-sm"
                      style={{
                        fontSize: "0.7rem",
                        padding: "0.25rem 0.6rem",
                        borderColor: "rgba(34,197,94,0.4)",
                        color: "var(--success)",
                      }}
                      onClick={() => onStatusChange(d.id, "resolved")}
                    >
                      ✓ Resolve
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div style={{ marginTop: "0.75rem" }}>
              <p style={{ fontSize: "0.78rem", color: "var(--amber)", fontWeight: 600, marginBottom: "0.3rem" }}>
                Reason: {d.reason}
              </p>
              <p className={styles.inquiryBody}>{d.description}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
