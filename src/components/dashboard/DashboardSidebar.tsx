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
  open?: boolean;
  onClose?: () => void;
}

export default function DashboardSidebar({
  activeTab,
  onTabChange,
  stats,
  contactsCount,
  openDisputesCount,
  pendingApplicationsCount,
  open = false,
  onClose,
}: DashboardSidebarProps) {
  const handleTabChange = (tab: AdminTab) => {
    onTabChange(tab);
    onClose?.();
  };

  return (
    <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}>
      <div className={styles.brand}>
        <span className={styles.logoIcon}>🚨</span>
        <div className={styles.brandText}>
          <h1 className={styles.brandName}>RoadRescue</h1>
          <span className="badge badge-amber" style={{ fontSize: "0.6rem", padding: "0.15rem 0.4rem" }}>
            Ops Center
          </span>
        </div>
        {onClose && (
          <button
            type="button"
            className={styles.sidebarClose}
            onClick={onClose}
            aria-label="Close navigation"
          >
            ✕
          </button>
        )}
      </div>

      <nav className={styles.nav}>
        <button
          className={`${styles.navItem} ${activeTab === "overview" ? styles.navItemActive : ""}`}
          onClick={() => handleTabChange("overview")}
        >
          📊 Overview Dashboard
        </button>
        <button
          className={`${styles.navItem} ${activeTab === "requests" ? styles.navItemActive : ""}`}
          onClick={() => handleTabChange("requests")}
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
          onClick={() => handleTabChange("technicians")}
        >
          👷 Manage Technicians
        </button>
        <button
          className={`${styles.navItem} ${activeTab === "contacts" ? styles.navItemActive : ""}`}
          onClick={() => handleTabChange("contacts")}
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
          onClick={() => handleTabChange("disputes")}
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
          onClick={() => handleTabChange("applications")}
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
          onClick={() => handleTabChange("payments")}
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
