import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import type { AdminTab, DashboardStats } from "@/lib/types";
import styles from "@/app/Dashboard.module.css";

interface DashboardSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  stats: DashboardStats;
  contactsCount: number;
  openDisputesCount: number;
  pendingApplicationsCount: number;
}

export default function DashboardSidebar({
  activeTab,
  onTabChange,
  stats,
  contactsCount,
  openDisputesCount,
  pendingApplicationsCount,
}: DashboardSidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.logoIcon}>🚨</span>
        <div>
          <h1 className={styles.brandName}>RoadRescue</h1>
          <span className="badge badge-amber" style={{ fontSize: "0.6rem", padding: "0.15rem 0.4rem" }}>
            Ops Center
          </span>
        </div>
      </div>

      <nav className={styles.nav}>
        <button
          className={`${styles.navItem} ${activeTab === "overview" ? styles.navItemActive : ""}`}
          onClick={() => onTabChange("overview")}
        >
          📊 Overview Dashboard
        </button>
        <button
          className={`${styles.navItem} ${activeTab === "requests" ? styles.navItemActive : ""}`}
          onClick={() => onTabChange("requests")}
        >
          📋 Rescue Requests
          {stats.pending > 0 && (
            <span className="badge badge-danger" style={{ marginLeft: "auto", fontSize: "0.65rem", padding: "0.1rem 0.4rem" }}>
              {stats.pending}
            </span>
          )}
        </button>
        <button
          className={`${styles.navItem} ${activeTab === "technicians" ? styles.navItemActive : ""}`}
          onClick={() => onTabChange("technicians")}
        >
          👷 Manage Technicians
        </button>
        <button
          className={`${styles.navItem} ${activeTab === "contacts" ? styles.navItemActive : ""}`}
          onClick={() => onTabChange("contacts")}
        >
          ✉️ Contact Inquiries
          {contactsCount > 0 && (
            <span className="badge badge-info" style={{ marginLeft: "auto", fontSize: "0.65rem", padding: "0.1rem 0.4rem" }}>
              {contactsCount}
            </span>
          )}
        </button>
        <button
          className={`${styles.navItem} ${activeTab === "disputes" ? styles.navItemActive : ""}`}
          onClick={() => onTabChange("disputes")}
        >
          ⚠️ Disputes
          {openDisputesCount > 0 && (
            <span className="badge badge-danger" style={{ marginLeft: "auto", fontSize: "0.65rem", padding: "0.1rem 0.4rem" }}>
              {openDisputesCount}
            </span>
          )}
        </button>
        <button
          className={`${styles.navItem} ${activeTab === "applications" ? styles.navItemActive : ""}`}
          onClick={() => onTabChange("applications")}
        >
          📝 Tech Applications
          {pendingApplicationsCount > 0 && (
            <span className="badge badge-amber" style={{ marginLeft: "auto", fontSize: "0.65rem", padding: "0.1rem 0.4rem" }}>
              {pendingApplicationsCount}
            </span>
          )}
        </button>
        <button
          className={`${styles.navItem} ${activeTab === "payments" ? styles.navItemActive : ""}`}
          onClick={() => onTabChange("payments")}
        >
          💳 Account Balance
        </button>
      </nav>

      <div className={styles.sidebarFooter}>
        <div className={styles.themeRow}>
          <span>Appearance</span>
          <ThemeToggle />
        </div>
        <div className={styles.statusIndicator}>
          <span className={styles.pulseDot} />
          <span>Operational Feed Live</span>
        </div>
      </div>
    </aside>
  );
}
