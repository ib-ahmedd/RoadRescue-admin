import ApplicationCard from "@/components/dashboard/ApplicationCard";
import StatusSummaryChips from "@/components/dashboard/StatusSummaryChips";
import type { Application } from "@/lib/types";
import styles from "@/app/Dashboard.module.css";

interface ApplicationsTabProps {
  applications: Application[];
  expandedApplicationId: string | null;
  onToggleApplication: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const APPLICATION_STATUSES = ["pending", "approved", "rejected"] as const;

export default function ApplicationsTab({
  applications,
  expandedApplicationId,
  onToggleApplication,
  onApprove,
  onReject,
}: ApplicationsTabProps) {
  const counts = {
    pending: applications.filter((a) => a.status === "pending").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const colors = {
    pending: "var(--amber)",
    approved: "var(--success)",
    rejected: "var(--danger)",
  };

  return (
    <div className={styles.inquiryList}>
      <StatusSummaryChips statuses={APPLICATION_STATUSES} counts={counts} colors={colors} />

      {applications.length === 0 ? (
        <div className={styles.card} style={{ textAlign: "center", padding: "4rem" }}>
          <span style={{ fontSize: "2rem" }}>📝</span>
          <h4 style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>
            No applications found — keep promoting the Careers page!
          </h4>
        </div>
      ) : (
        applications.map((app) => (
          <ApplicationCard
            key={app.id}
            app={app}
            isExpanded={expandedApplicationId === app.id}
            onToggle={() => onToggleApplication(app.id)}
            onApprove={(id) => onApprove(id)}
            onReject={(id) => onReject(id)}
          />
        ))
      )}
    </div>
  );
}
