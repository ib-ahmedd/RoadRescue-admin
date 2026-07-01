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
};

interface DashboardHeaderProps {
  activeTab: AdminTab;
}

export default function DashboardHeader({ activeTab }: DashboardHeaderProps) {
  return (
    <header className={styles.header}>
      <div>
        <span className="badge badge-amber">RoadRescue Administration</span>
        <h2 className={styles.pageTitle}>{TAB_TITLES[activeTab]}</h2>
      </div>
      <div className={styles.headerActions}>
        <ThemeToggle />
        <div className={styles.dateDisplay}>
          📅 {new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
        </div>
      </div>
    </header>
  );
}
