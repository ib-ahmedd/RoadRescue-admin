import { SERVICE_DETAILS } from "@/lib/constants";
import type { Provider } from "@/lib/types";
import styles from "@/app/Dashboard.module.css";

interface TechnicianDirectoryTableProps {
  providers: Provider[];
}

export default function TechnicianDirectoryTable({ providers }: TechnicianDirectoryTableProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>👷 Fleet Directory</h3>
      <div className={styles.tableScroll}>
        <table className={styles.techTable}>
          <thead>
            <tr>
              <th>Technician</th>
              <th>Plate & Vehicle</th>
              <th>Speciality</th>
              <th>Rating / Reviews</th>
              <th>Duty Status</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((p) => (
              <tr key={p.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div className={styles.providerAvatar}>{p.avatar}</div>
                    <div>
                      <strong style={{ display: "block" }}>{p.name}</strong>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{p.id}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div>{p.vehicle}</div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "monospace" }}>
                    {p.plate}
                  </span>
                </td>
                <td>
                  <span className="badge badge-amber" style={{ fontSize: "0.65rem" }}>
                    {SERVICE_DETAILS[p.speciality] || p.speciality}
                  </span>
                </td>
                <td>
                  <div>★ {p.rating}</div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    {p.reviews} review{p.reviews !== 1 && "s"}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      p.status === "Available"
                        ? "badge-success"
                        : p.status === "Dispatched"
                          ? "badge-amber"
                          : p.status === "Engaged"
                            ? "badge-danger"
                            : "badge-danger"
                    }`}
                    style={{ fontSize: "0.7rem" }}
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
