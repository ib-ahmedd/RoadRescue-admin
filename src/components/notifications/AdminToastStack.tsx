import type { AdminNotification, AdminNotificationKind } from "@/lib/adminNotifications";
import styles from "./AdminToastStack.module.css";

interface AdminToastStackProps {
  notifications: AdminNotification[];
  onDismiss: (toastId: string) => void;
  onNavigate: (notification: AdminNotification) => void;
}

const KIND_CONFIG: Record<
  AdminNotificationKind,
  { icon: string; accentClass: string }
> = {
  new_request: { icon: "📋", accentClass: styles.accentAmber },
  request_status: { icon: "🔄", accentClass: styles.accentInfo },
  quote_submitted: { icon: "💰", accentClass: styles.accentAmber },
  payment_received: { icon: "💳", accentClass: styles.accentSuccess },
  new_dispute: { icon: "⚠️", accentClass: styles.accentDanger },
  new_application: { icon: "📝", accentClass: styles.accentSuccess },
  new_contact: { icon: "✉️", accentClass: styles.accentInfo },
};

export default function AdminToastStack({
  notifications,
  onDismiss,
  onNavigate,
}: AdminToastStackProps) {
  if (notifications.length === 0) return null;

  return (
    <div className={styles.stack} aria-live="polite" aria-relevant="additions">
      {notifications.map((notification) => {
        const config = KIND_CONFIG[notification.kind];
        return (
          <div
            key={notification.toastId}
            role="status"
            className={`${styles.toast} ${config.accentClass}`}
          >
            <button
              type="button"
              className={styles.toastBody}
              onClick={() => onNavigate(notification)}
            >
              <span className={styles.icon} aria-hidden>
                {config.icon}
              </span>
              <span className={styles.content}>
                <span className={styles.title}>{notification.title}</span>
                <span className={styles.message}>{notification.message}</span>
              </span>
            </button>
            <button
              type="button"
              className={styles.closeBtn}
              aria-label="Dismiss notification"
              onClick={() => onDismiss(notification.toastId)}
            >
              ×
            </button>
            <span className={styles.progress} aria-hidden />
          </div>
        );
      })}
    </div>
  );
}
