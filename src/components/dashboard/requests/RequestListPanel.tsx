import { SERVICE_DETAILS } from "@/lib/constants";
import { formatTimeAgo } from "@/lib/formatTimeAgo";
import type { RequestData, RequestFilter } from "@/lib/types";
import styles from "@/app/Dashboard.module.css";

interface RequestListPanelProps {
  filteredRequests: RequestData[];
  selectedRequestId: string | null;
  onSelectRequest: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  requestFilter: RequestFilter;
  onFilterChange: (filter: RequestFilter) => void;
}

export default function RequestListPanel({
  filteredRequests,
  selectedRequestId,
  onSelectRequest,
  searchQuery,
  onSearchChange,
  requestFilter,
  onFilterChange,
}: RequestListPanelProps) {
  return (
    <div className={styles.listPanel}>
      <div className={styles.panelHeader}>
        <div className={styles.searchBox}>
          <input
            type="text"
            className="form-input"
            placeholder="Search name, ID, vehicle, location..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className={styles.filterTabs}>
          {(["all", "pending", "active", "completed"] as const).map((tab) => (
            <button
              key={tab}
              className={`${styles.filterTab} ${requestFilter === tab ? styles.filterTabActive : ""}`}
              onClick={() => onFilterChange(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.listItems}>
        {filteredRequests.length === 0 ? (
          <p style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            No incident requests matching.
          </p>
        ) : (
          filteredRequests.map((req) => {
            const isActive = req.id === selectedRequestId;
            return (
              <button
                key={req.id}
                className={`${styles.requestCard} ${isActive ? styles.requestCardActive : ""}`}
                onClick={() => onSelectRequest(req.id)}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.clientName}>{req.name}</span>
                  <span className={styles.reqId}>{req.id}</span>
                </div>
                <div className={styles.cardMeta}>
                  <span
                    className="badge badge-amber"
                    style={{ fontSize: "0.6rem", textTransform: "lowercase", padding: "0.1rem 0.35rem" }}
                  >
                    {SERVICE_DETAILS[req.service] || req.service}
                  </span>
                  <span>{formatTimeAgo(req.createdAt)}</span>
                </div>
                <p className={styles.locationSnippet}>📍 {req.location}</p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                  <span
                    className={`badge ${
                      req.status === "received"
                        ? "badge-danger"
                        : req.status === "completed"
                          ? "badge-success"
                          : "badge-amber"
                    }`}
                    style={{ fontSize: "0.65rem" }}
                  >
                    {req.status === "received"
                      ? "Pending"
                      : req.status === "completed"
                        ? "Completed"
                        : req.status === "awaiting-payment"
                          ? "Awaiting payment"
                          : req.status === "in-progress"
                            ? "In progress"
                            : req.status === "assessing"
                              ? "Assessing"
                              : req.status}
                  </span>
                  {req.quoteStatus === "pending" && (
                    <span className="badge badge-info" style={{ fontSize: "0.65rem" }}>
                      Quote pending
                    </span>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
