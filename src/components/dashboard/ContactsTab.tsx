import type { ContactSubmission } from "@/lib/types";
import styles from "@/app/Dashboard.module.css";

interface ContactsTabProps {
  contacts: ContactSubmission[];
}

export default function ContactsTab({ contacts }: ContactsTabProps) {
  return (
    <div className={styles.inquiryList}>
      {contacts.length === 0 ? (
        <div className={styles.card} style={{ textAlign: "center", padding: "4rem" }}>
          <span style={{ fontSize: "2rem" }}>✉️</span>
          <h4 style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>No customer message logs found.</h4>
        </div>
      ) : (
        contacts.map((c) => (
          <div key={c.id} className={styles.inquiryItem}>
            <div className={styles.inquiryHeader}>
              <div>
                <span
                  className="badge badge-info"
                  style={{ fontSize: "0.6rem", padding: "0.15rem 0.4rem", marginBottom: "0.5rem" }}
                >
                  {c.subject}
                </span>
                <h4 className={styles.inquiryTitle}>{c.name}</h4>
                <a href={`mailto:${c.email}`} className={styles.inquiryEmail}>
                  {c.email}
                </a>
              </div>
              <div className={styles.inquiryTime}>{new Date(c.createdAt).toLocaleString()}</div>
            </div>
            <p className={styles.inquiryBody}>{c.message}</p>
          </div>
        ))
      )}
    </div>
  );
}
