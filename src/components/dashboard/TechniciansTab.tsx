import type { AdminDashboardState } from "@/hooks/useAdminDashboard";
import AddTechnicianForm from "./AddTechnicianForm";
import TechnicianDirectoryTable from "./TechnicianDirectoryTable";
import styles from "@/app/Dashboard.module.css";

type TechniciansTabProps = Pick<
  AdminDashboardState,
  "providers" | "newProv" | "setNewProv" | "provFormSubmitting" | "provFormSuccess" | "handleAddProvider"
>;

export default function TechniciansTab({
  providers,
  newProv,
  setNewProv,
  provFormSubmitting,
  provFormSuccess,
  handleAddProvider,
}: TechniciansTabProps) {
  return (
    <div className={styles.techLayout}>
      <TechnicianDirectoryTable providers={providers} />
      <AddTechnicianForm
        newProv={newProv}
        onChange={(updates) => setNewProv((p) => ({ ...p, ...updates }))}
        onSubmit={handleAddProvider}
        submitting={provFormSubmitting}
        success={provFormSuccess}
      />
    </div>
  );
}
