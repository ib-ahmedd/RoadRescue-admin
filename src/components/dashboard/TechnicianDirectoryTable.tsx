import { SERVICE_DETAILS } from "@/lib/constants";
import type { Provider } from "@/lib/types";
import styles from "@/app/Dashboard.module.css";

interface TechnicianDirectoryTableProps {
  providers: Provider[];
}

function statusBadgeClass(status: Provider["status"]) {
  if (status === "Available") return "badge-success";
  if (status === "Dispatched") return "badge-amber";
  return "badge-danger";
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
                  <div className={styles.techCellPerson}>
                    <div className={styles.providerAvatar}>{p.avatar}</div>
                    <div>
                      <strong className={styles.techName}>{p.name}</strong>
                      <span className={styles.techId}>{p.id}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div>{p.vehicle}</div>
                  <span className={styles.techPlate}>{p.plate}</span>
                </td>
                <td>
                  <span className="badge badge-amber" style={{ fontSize: "0.65rem" }}>
                    {SERVICE_DETAILS[p.speciality] || p.speciality}
                  </span>
                </td>
                <td>
                  <div>★ {p.rating}</div>
                  <span className={styles.techMuted}>
                    {p.reviews} review{p.reviews !== 1 && "s"}
                  </span>
                </td>
                <td>
                  <span className={`badge ${statusBadgeClass(p.status)}`} style={{ fontSize: "0.7rem" }}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.techCardList}>
        {providers.map((p) => (
          <article key={p.id} className={styles.techCard}>
            <div className={styles.techCardHeader}>
              <div className={styles.techCellPerson}>
                <div className={styles.providerAvatar}>{p.avatar}</div>
                <div>
                  <strong className={styles.techName}>{p.name}</strong>
                  <span className={styles.techId}>{p.id}</span>
                </div>
              </div>
              <span className={`badge ${statusBadgeClass(p.status)}`} style={{ fontSize: "0.7rem" }}>
                {p.status}
              </span>
            </div>
            <dl className={styles.techCardMeta}>
              <div>
                <dt>Vehicle</dt>
                <dd>
                  {p.vehicle}
                  <span className={styles.techPlate}>{p.plate}</span>
                </dd>
              </div>
              <div>
                <dt>Speciality</dt>
                <dd>{SERVICE_DETAILS[p.speciality] || p.speciality}</dd>
              </div>
              <div>
                <dt>Rating</dt>
                <dd>
                  ★ {p.rating} · {p.reviews} review{p.reviews !== 1 && "s"}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}
