"use client";

import { useEffect, useState } from "react";
import ApplicationsTab from "@/components/dashboard/ApplicationsTab";
import PaymentsTab from "@/components/dashboard/PaymentsTab";
import ContactsTab from "@/components/dashboard/ContactsTab";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DisputesTab from "@/components/dashboard/DisputesTab";
import OverviewTab from "@/components/dashboard/OverviewTab";
import RequestsTab from "@/components/dashboard/requests/RequestsTab";
import TechniciansTab from "@/components/dashboard/TechniciansTab";
import AdminToastStack from "@/components/notifications/AdminToastStack";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import styles from "./Dashboard.module.css";

export default function AdminDashboard() {
  const dashboard = useAdminDashboard();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!sidebarOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [sidebarOpen]);

  return (
    <div className={styles.layout}>
      <AdminToastStack
        notifications={dashboard.notifications}
        onDismiss={dashboard.dismissNotification}
        onNavigate={dashboard.handleNotificationNavigate}
      />
      {sidebarOpen && (
        <button
          type="button"
          className={styles.sidebarOverlay}
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <DashboardSidebar
        activeTab={dashboard.activeTab}
        onTabChange={dashboard.setActiveTab}
        stats={dashboard.stats}
        contactsCount={dashboard.contacts.length}
        openDisputesCount={dashboard.disputes.filter((d) => d.status === "open").length}
        pendingApplicationsCount={dashboard.applications.filter((a) => a.status === "pending").length}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className={styles.content}>
        <DashboardHeader
          activeTab={dashboard.activeTab}
          onMenuClick={() => setSidebarOpen(true)}
        />

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
                paymentSummary={dashboard.paymentSummary}
                serviceDistribution={dashboard.serviceDistribution}
                requests={dashboard.requests}
                onOpenRequests={dashboard.openRequestsWithFilter}
                onOpenTechnicians={dashboard.openTechniciansTab}
                onOpenPayments={dashboard.openPaymentsTab}
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
            {dashboard.activeTab === "payments" && (
              <PaymentsTab
                payments={dashboard.payments}
                paymentSummary={dashboard.paymentSummary}
                onSelectRequest={dashboard.setSelectedRequestId}
                onOpenRequestsTab={() => {
                  dashboard.setSearchQuery("");
                  dashboard.setRequestFilter("all");
                  dashboard.setActiveTab("requests");
                }}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
