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
  const effectiveStatus =
    request.status === "disputed" ? "completed" : request.status;
  const currentIndex = ALL_STATUSES.indexOf(
    effectiveStatus as (typeof ALL_STATUSES)[number]
  );

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
            const isCompletedStep = step === "completed";
            const isCurrent = isCompletedStep
              ? request.status === "completed" || request.status === "disputed"
              : request.status === step;
            const isCompleted = currentIndex !== -1 && index < currentIndex;
            const label =
              isCompletedStep && request.status === "disputed"
                ? "Disputed"
                : STATUS_LABELS[step];
            const isDisputedCurrent = request.status === "disputed" && isCurrent;
            return (
              <div
                key={step}
                role="listitem"
                aria-current={isCurrent ? "step" : undefined}
                className={`${styles.statusStepMonitor} ${isDisputedCurrent ? styles.statusStepBtnDisputed : isCurrent ? styles.statusStepBtnActive : ""} ${isCompleted ? styles.statusStepBtnCompleted : ""}`}
              >
                {label}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
