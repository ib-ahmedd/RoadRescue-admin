import type { AdminDashboardState } from "@/hooks/useAdminDashboard";
import RequestDetailPanel from "./RequestDetailPanel";
import RequestListPanel from "./RequestListPanel";
import styles from "@/app/Dashboard.module.css";

type RequestsTabProps = Pick<
  AdminDashboardState,
  | "filteredRequests"
  | "selectedRequestId"
  | "setSelectedRequestId"
  | "searchQuery"
  | "setSearchQuery"
  | "requestFilter"
  | "setRequestFilter"
  | "activeRequest"
  | "providers"
  | "handleUpdateRequest"
  | "handleDispatch"
  | "handleQuoteApproval"
  | "stats"
  | "autoOpenQuoteReviewRequestId"
  | "clearAutoOpenQuoteReview"
>;

export default function RequestsTab({
  filteredRequests,
  selectedRequestId,
  setSelectedRequestId,
  searchQuery,
  setSearchQuery,
  requestFilter,
  setRequestFilter,
  activeRequest,
  providers,
  handleUpdateRequest,
  handleDispatch,
  handleQuoteApproval,
  stats,
  autoOpenQuoteReviewRequestId,
  clearAutoOpenQuoteReview,
}: RequestsTabProps) {
  return (
    <div
      className={`${styles.splitLayout} ${selectedRequestId ? styles.splitShowDetail : ""}`}
    >
      <RequestListPanel
        filteredRequests={filteredRequests}
        selectedRequestId={selectedRequestId}
        onSelectRequest={setSelectedRequestId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        requestFilter={requestFilter}
        onFilterChange={setRequestFilter}
        stats={stats}
      />
      <div className={styles.detailColumn}>
        <RequestDetailPanel
          request={activeRequest}
          providers={providers}
          onUpdateRequest={handleUpdateRequest}
          onDispatch={handleDispatch}
          onQuoteApproval={handleQuoteApproval}
          autoOpenQuoteReviewRequestId={autoOpenQuoteReviewRequestId}
          onQuoteReviewAutoOpened={clearAutoOpenQuoteReview}
          onBack={() => setSelectedRequestId(null)}
        />
      </div>
    </div>
  );
}
