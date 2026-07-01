"use client";

import ApplicationsTab from "@/components/dashboard/ApplicationsTab";
import ContactsTab from "@/components/dashboard/ContactsTab";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DisputesTab from "@/components/dashboard/DisputesTab";
import OverviewTab from "@/components/dashboard/OverviewTab";
import RequestsTab from "@/components/dashboard/requests/RequestsTab";
import TechniciansTab from "@/components/dashboard/TechniciansTab";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import styles from "./Dashboard.module.css";

export default function AdminDashboard() {
  const dashboard = useAdminDashboard();

  return (
    <div className={styles.layout}>
      <DashboardSidebar
        activeTab={dashboard.activeTab}
        onTabChange={dashboard.setActiveTab}
        stats={dashboard.stats}
        contactsCount={dashboard.contacts.length}
        openDisputesCount={dashboard.disputes.filter((d) => d.status === "open").length}
        pendingApplicationsCount={dashboard.applications.filter((a) => a.status === "pending").length}
      />

      <main className={styles.content}>
        <DashboardHeader activeTab={dashboard.activeTab} />

        {dashboard.serverError && (
          <div
            className="badge badge-danger"
            style={{
              display: "flex",
              width: "100%",
              padding: "1rem",
              borderRadius: "10px",
              marginBottom: "2rem",
              textTransform: "none",
              fontSize: "0.9rem",
            }}
          >
            ⚠️ <strong>Connection Error:</strong> {dashboard.serverError}
          </div>
        )}

        {dashboard.loading ? (
          <div style={{ textAlign: "center", padding: "10rem 0" }}>
            <span className="dot-pulse">
              <span />
              <span />
              <span />
            </span>
            <p style={{ marginTop: "1.5rem", color: "var(--text-secondary)" }}>Fetching real-time feeds...</p>
          </div>
        ) : (
          <div className="animate-fadeIn">
            {dashboard.activeTab === "overview" && (
              <OverviewTab
                stats={dashboard.stats}
                serviceDistribution={dashboard.serviceDistribution}
                requests={dashboard.requests}
              />
            )}
            {dashboard.activeTab === "requests" && <RequestsTab {...dashboard} />}
            {dashboard.activeTab === "technicians" && <TechniciansTab {...dashboard} />}
            {dashboard.activeTab === "contacts" && <ContactsTab contacts={dashboard.contacts} />}
            {dashboard.activeTab === "disputes" && (
              <DisputesTab disputes={dashboard.disputes} onStatusChange={dashboard.handleDisputeStatusChange} />
            )}
            {dashboard.activeTab === "applications" && (
              <ApplicationsTab
                applications={dashboard.applications}
                expandedApplicationId={dashboard.expandedApplicationId}
                onToggleApplication={dashboard.toggleApplication}
                onApprove={(id) => dashboard.handleApplicationStatus(id, "approved")}
                onReject={(id) => dashboard.handleApplicationStatus(id, "rejected")}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
