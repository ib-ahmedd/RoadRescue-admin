import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import type { AdminTab } from "@/lib/types";
import styles from "@/app/Dashboard.module.css";

const TAB_TITLES: Record<AdminTab, string> = {
  overview: "Dashboard Overview",
  requests: "Roadside Assistance Dispatch",
  technicians: "Technician Directory & Registry",
  contacts: "Customer Support Inquiries",
  disputes: "Dispute Management",
  applications: "Technician Applications Review",
  payments: "Account Balance & Payments",
};

interface DashboardHeaderProps {
  activeTab: AdminTab;
  onMenuClick?: () => void;
}

export default function DashboardHeader({ activeTab, onMenuClick }: DashboardHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerLead}>
        {onMenuClick && (
          <button
            type="button"
            className={styles.menuButton}
            onClick={onMenuClick}
            aria-label="Open navigation"
          >
            <span />
            <span />
            <span />
          </button>
        )}
        <div className={styles.headerTitles}>
          <span className="badge badge-amber">RoadRescue Administration</span>
          <h2 className={styles.pageTitle}>{TAB_TITLES[activeTab]}</h2>
        </div>
      </div>
      <div className={styles.headerActions}>
        <ThemeToggle />
        <div className={styles.dateDisplay}>
          📅{" "}
          <span className={styles.dateFull}>
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </span>
          <span className={styles.dateShort}>
            {new Date().toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </header>
  );
}
