import type { RequestData, RequestStatus } from "@/lib/types";
import styles from "@/app/Dashboard.module.css";

const ALL_STATUSES = [
  "received",
  "matched",
  "en-route",
  "arrived",
  "assessing",
  "awaiting-payment",
  "in-progress",
  "completed",
] as const satisfies readonly RequestStatus[];

const STATUS_LABELS: Record<(typeof ALL_STATUSES)[number], string> = {
  received: "Received",
  matched: "Matched",
  "en-route": "En Route",
  arrived: "Arrived",
  assessing: "Assessing",
  "awaiting-payment": "Awaiting Payment",
  "in-progress": "Service In Progress",
  completed: "Completed",
};

interface StatusProgressMonitorProps {
  request: RequestData;
}

export default function StatusProgressMonitor({ request }: StatusProgressMonitorProps) {
  const currentIndex = ALL_STATUSES.indexOf(request.status as (typeof ALL_STATUSES)[number]);

  return (
    <>
      <h4 className={styles.sectionTitle}>📊 Progress Monitor</h4>
      <div className={styles.statusSliderCard}>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
          Read-only view of request progress. Status updates are driven by technicians, customers, and
          quote approval — not editable here.
        </p>
        <div className={styles.statusStepContainer} role="list" aria-label="Request progress">
          {ALL_STATUSES.map((step, index) => {
            const isCurrent = request.status === step;
            const isCompleted = currentIndex !== -1 && index < currentIndex;
            return (
              <div
                key={step}
                role="listitem"
                aria-current={isCurrent ? "step" : undefined}
                className={`${styles.statusStepMonitor} ${isCurrent ? styles.statusStepBtnActive : ""} ${isCompleted ? styles.statusStepBtnCompleted : ""}`}
              >
                {STATUS_LABELS[step]}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
