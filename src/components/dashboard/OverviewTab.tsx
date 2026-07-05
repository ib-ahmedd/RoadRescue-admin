import { SERVICE_DETAILS } from "@/lib/constants";
import { formatNaira } from "@/lib/formatCurrency";
import { formatTimeAgo } from "@/lib/formatTimeAgo";
import type { DashboardStats, PaymentSummary, RequestData, RequestFilter } from "@/lib/types";
import styles from "@/app/Dashboard.module.css";

interface OverviewTabProps {
  stats: DashboardStats;
  paymentSummary: PaymentSummary;
  serviceDistribution: Record<string, number>;
  requests: RequestData[];
  onOpenRequests: (filter: RequestFilter) => void;
  onOpenTechnicians: () => void;
  onOpenPayments: () => void;
}

export default function OverviewTab({
  stats,
  paymentSummary,
  serviceDistribution,
  requests,
  onOpenRequests,
  onOpenTechnicians,
  onOpenPayments,
}: OverviewTabProps) {
  return (
    <>
      <div className={styles.statsGrid}>
        <button type="button" className={styles.statCard} onClick={() => onOpenRequests("all")}>
          <span className={styles.statIcon}>📋</span>
          <div>
            <p className={styles.statLabel}>Total Rescues</p>
            <p className={styles.statValue}>{stats.total}</p>
          </div>
        </button>
        <button
          type="button"
          className={styles.statCard}
          style={{ borderLeft: "4px solid var(--danger)" }}
          onClick={() => onOpenRequests("pending")}
        >
          <span className={styles.statIcon} style={{ background: "rgba(239,68,68,0.06)" }}>⏳</span>
          <div>
            <p className={styles.statLabel}>Unassigned</p>
            <p className={styles.statValue} style={{ color: "var(--danger)" }}>{stats.pending}</p>
          </div>
        </button>
        <button
          type="button"
          className={styles.statCard}
          style={{ borderLeft: "4px solid var(--amber)" }}
          onClick={() => onOpenRequests("active")}
        >
          <span className={styles.statIcon} style={{ background: "rgba(245,158,11,0.06)" }}>🚛</span>
          <div>
            <p className={styles.statLabel}>Active Missions</p>
            <p className={styles.statValue} style={{ color: "var(--amber)" }}>{stats.active}</p>
          </div>
        </button>
        <button
          type="button"
          className={styles.statCard}
          style={{ borderLeft: "4px solid var(--success)" }}
          onClick={() => onOpenRequests("completed")}
        >
          <span className={styles.statIcon} style={{ background: "rgba(34,197,94,0.06)" }}>✅</span>
          <div>
            <p className={styles.statLabel}>Completed Rescues</p>
            <p className={styles.statValue} style={{ color: "var(--success)" }}>{stats.completed}</p>
          </div>
        </button>
        <button
          type="button"
          className={styles.statCard}
          style={{ borderLeft: "4px solid var(--info)" }}
          onClick={onOpenTechnicians}
        >
          <span className={styles.statIcon} style={{ background: "rgba(34,197,94,0.06)" }}>👷</span>
          <div>
            <p className={styles.statLabel}>Techs Active</p>
            <p className={styles.statValue} style={{ color: "var(--success)" }}>
              {stats.availableDrivers} / {stats.totalDrivers}
            </p>
          </div>
        </button>
        <button
          type="button"
          className={styles.statCard}
          style={{ borderLeft: "4px solid #a855f7" }}
          onClick={onOpenPayments}
        >
          <span className={styles.statIcon} style={{ background: "rgba(168,85,247,0.08)" }}>💳</span>
          <div>
            <p className={styles.statLabel}>Account Balance</p>
            <p className={styles.statValue} style={{ color: "#c084fc" }}>
              {formatNaira(paymentSummary.accountBalance)}
            </p>
          </div>
        </button>
      </div>

      <div className={styles.overviewGrid}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>🛠️ Incident Distributions</h3>
          <div className={styles.progressList}>
            {Object.entries(SERVICE_DETAILS).map(([key, label]) => {
              const count = serviceDistribution[key] || 0;
              const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
              let barColor = "var(--amber)";
              if (key === "battery") barColor = "var(--info)";
              if (key === "flat-tire") barColor = "var(--success)";
              if (key === "lockout") barColor = "var(--danger)";
              if (key === "fuel") barColor = "#a855f7";

              return (
                <div key={key} className={styles.progressItem}>
                  <div className={styles.progressLabelRow}>
                    <span>{label}</span>
                    <strong>
                      {count} request{count !== 1 && "s"} ({Math.round(pct)}%)
                    </strong>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div className={styles.progressBarFill} style={{ width: `${pct}%`, background: barColor }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>📡 Live Operational Stream</h3>
          <div className={styles.activityList}>
            {requests.slice(0, 5).map((req) => (
              <div key={req.id} className={styles.activityItem}>
                <span className={styles.activityIcon}>
                  {req.status === "completed" ? "✅" : req.status === "received" ? "⏳" : "🚛"}
                </span>
                <div className={styles.activityMeta}>
                  <p className={styles.activityText}>
                    <strong>{req.name}</strong> requested <strong>{req.service}</strong> assistance
                  </p>
                  <span className={styles.activityTime}>
                    {formatTimeAgo(req.createdAt)} • Status: {req.status}
                  </span>
                </div>
              </div>
            ))}
            {requests.length === 0 && (
              <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                No ongoing roadside incident streams.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
