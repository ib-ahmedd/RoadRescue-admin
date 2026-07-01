import { SERVICE_DETAILS } from "@/lib/constants";
import type { Provider, RequestData } from "@/lib/types";
import styles from "@/app/Dashboard.module.css";

interface DispatchSectionProps {
  request: RequestData;
  providers: Provider[];
  onDispatch: (request: RequestData, provider: Provider) => void;
}

export default function DispatchSection({ request, providers, onDispatch }: DispatchSectionProps) {
  if (request.assignedProvider) {
    return (
      <div className={styles.providerRow} style={{ borderColor: "var(--success)" }}>
        <div className={styles.providerProfile}>
          <div
            className={styles.providerAvatar}
            style={{ background: "rgba(34,197,94,0.08)", color: "var(--success)" }}
          >
            {request.assignedProvider.avatar}
          </div>
          <div className={styles.providerInfo}>
            <span className={styles.providerName}>{request.assignedProvider.name}</span>
            <span className={styles.providerDetails}>
              Vehicle: {request.assignedProvider.vehicle} | Plate: {request.assignedProvider.plate}
            </span>
          </div>
        </div>
        <span className="badge badge-success">Assigned</span>
      </div>
    );
  }

  const matchedTechs = providers.filter(
    (p) => p.status !== "Offline" && p.speciality === request.service
  );
  const otherTechs = providers.filter(
    (p) => p.status !== "Offline" && p.speciality !== request.service
  );

  if (matchedTechs.length === 0 && otherTechs.length === 0) {
    return (
      <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
        No technicians currently available. Register a new operator in the Technicians panel.
      </p>
    );
  }

  return (
    <div>
      <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
        Showing technicians qualified for{" "}
        <strong>{SERVICE_DETAILS[request.service] ?? request.service}</strong>:
      </p>

      {matchedTechs.length > 0 ? (
        matchedTechs.map((p) => (
          <div
            key={p.id}
            className={styles.providerRow}
            style={{ border: "1px solid rgba(245,158,11,0.35)", background: "rgba(245,158,11,0.04)" }}
          >
            <div className={styles.providerProfile}>
              <div className={styles.providerAvatar}>{p.avatar}</div>
              <div className={styles.providerInfo}>
                <span className={styles.providerName}>
                  {p.name}{" "}
                  <span
                    style={{
                      color: "var(--amber)",
                      fontSize: "0.68rem",
                      fontWeight: 600,
                      background: "rgba(245,158,11,0.12)",
                      padding: "1px 5px",
                      borderRadius: "4px",
                    }}
                  >
                    ✓ Specialist
                  </span>
                </span>
                <span className={styles.providerDetails}>
                  ★ {p.rating} · {p.reviews} reviews · {p.vehicle}
                </span>
              </div>
            </div>
            <button
              className={styles.dispatchBtn}
              disabled={p.status !== "Available"}
              style={{ opacity: p.status === "Available" ? 1 : 0.5 }}
              onClick={() => onDispatch(request, p)}
            >
              {p.status === "Available" ? "Dispatch" : p.status}
            </button>
          </div>
        ))
      ) : (
        <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontStyle: "italic", marginBottom: "0.5rem" }}>
          ⚠️ No specialist technicians available for this service type.
        </p>
      )}

      {otherTechs.length > 0 && (
        <>
          <p
            style={{
              fontSize: "0.72rem",
              color: "var(--text-secondary)",
              marginTop: "0.85rem",
              marginBottom: "0.4rem",
              borderTop: "1px solid var(--border)",
              paddingTop: "0.65rem",
            }}
          >
            Other available technicians (different speciality):
          </p>
          {otherTechs.map((p) => (
            <div key={p.id} className={styles.providerRow} style={{ opacity: 0.75 }}>
              <div className={styles.providerProfile}>
                <div className={styles.providerAvatar}>{p.avatar}</div>
                <div className={styles.providerInfo}>
                  <span className={styles.providerName}>{p.name}</span>
                  <span className={styles.providerDetails}>
                    ★ {p.rating} · {SERVICE_DETAILS[p.speciality] ?? p.speciality} · {p.vehicle}
                  </span>
                </div>
              </div>
              <button
                className={styles.dispatchBtn}
                disabled={p.status !== "Available"}
                style={{ opacity: p.status === "Available" ? 0.85 : 0.4 }}
                onClick={() => onDispatch(request, p)}
              >
                {p.status === "Available" ? "Dispatch" : p.status}
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
