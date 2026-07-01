import { SERVICE_DETAILS } from "@/lib/constants";
import { LOCALE } from "@/lib/locale";
import type { NewProviderForm } from "@/lib/types";
import styles from "@/app/Dashboard.module.css";

interface AddTechnicianFormProps {
  newProv: NewProviderForm;
  onChange: (updates: Partial<NewProviderForm>) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  success: boolean;
}

export default function AddTechnicianForm({
  newProv,
  onChange,
  onSubmit,
  submitting,
  success,
}: AddTechnicianFormProps) {
  return (
    <div className={styles.techAddForm}>
      <h3 className={styles.cardTitle}>➕ Register Technician</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group" style={{ marginBottom: "1rem" }}>
          <label className="form-label" htmlFor="prov-name">
            Technician Full Name *
          </label>
          <input
            id="prov-name"
            type="text"
            className="form-input"
            placeholder="e.g. Tunde Adeyemi"
            required
            value={newProv.name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </div>
        <div className="form-group" style={{ marginBottom: "1rem" }}>
          <label className="form-label" htmlFor="prov-phone">
            Phone Number *
          </label>
          <input
            id="prov-phone"
            type="tel"
            className="form-input"
            placeholder={LOCALE.phonePlaceholder}
            required
            value={newProv.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
          />
        </div>
        <div className="form-group" style={{ marginBottom: "1rem" }}>
          <label className="form-label" htmlFor="prov-vehicle">
            Vehicle Details *
          </label>
          <input
            id="prov-vehicle"
            type="text"
            className="form-input"
            placeholder="Tow Truck (Ford F-550)"
            required
            value={newProv.vehicle}
            onChange={(e) => onChange({ vehicle: e.target.value })}
          />
        </div>
        <div className="form-group" style={{ marginBottom: "1rem" }}>
          <label className="form-label" htmlFor="prov-plate">
            License Plate *
          </label>
          <input
            id="prov-plate"
            type="text"
            className="form-input"
            placeholder={LOCALE.platePlaceholder}
            required
            value={newProv.plate}
            onChange={(e) => onChange({ plate: e.target.value })}
          />
        </div>
        <div className="form-group" style={{ marginBottom: "1rem" }}>
          <label className="form-label" htmlFor="prov-spec">
            Incident Speciality *
          </label>
          <select
            id="prov-spec"
            className="form-input"
            style={{ background: "var(--bg-800)" }}
            value={newProv.speciality}
            onChange={(e) => onChange({ speciality: e.target.value })}
          >
            {Object.entries(SERVICE_DETAILS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: "1.5rem" }}>
          <label className="form-label" htmlFor="prov-avatar">
            Avatar Initials (optional)
          </label>
          <input
            id="prov-avatar"
            type="text"
            className="form-input"
            placeholder="DM"
            maxLength={2}
            value={newProv.avatar}
            onChange={(e) => onChange({ avatar: e.target.value.toUpperCase() })}
          />
        </div>

        {success && (
          <div
            className="badge badge-success"
            style={{
              display: "block",
              textAlign: "center",
              padding: "0.5rem",
              width: "100%",
              textTransform: "none",
              marginBottom: "1rem",
            }}
          >
            ✓ Operator registered successfully!
          </div>
        )}

        <button type="submit" className="btn btn-primary w-full" style={{ width: "100%" }} disabled={submitting}>
          {submitting ? "Processing..." : "Add to Fleet Directory"}
        </button>
      </form>
    </div>
  );
}
