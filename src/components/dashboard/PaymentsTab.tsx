import { formatNaira } from "@/lib/formatCurrency";
import type { Payment, PaymentSummary } from "@/lib/types";
import styles from "@/app/Dashboard.module.css";

const PAYMENT_TYPE_LABELS: Record<Payment["type"], string> = {
  booking_fee: "Booking fee (50%)",
  quote_payment: "Quote payment (30%)",
};

interface PaymentsTabProps {
  payments: Payment[];
  paymentSummary: PaymentSummary;
  onSelectRequest: (requestId: string) => void;
  onOpenRequestsTab: () => void;
}

export default function PaymentsTab({
  payments,
  paymentSummary,
  onSelectRequest,
  onOpenRequestsTab,
}: PaymentsTabProps) {
  return (
    <div className={styles.paymentsLayout}>
      <div className={styles.paymentSummaryGrid}>
        <div className={`${styles.paymentSummaryCard} ${styles.paymentSummaryPrimary}`}>
          <span className={styles.paymentSummaryLabel}>Account balance</span>
          <p className={styles.paymentSummaryValue}>{formatNaira(paymentSummary.accountBalance)}</p>
          <span className={styles.paymentSummaryHint}>
            Includes 50% booking fees and 30% paid quotes
          </span>
        </div>
        <div className={styles.paymentSummaryCard}>
          <span className={styles.paymentSummaryLabel}>Quote payments (30%)</span>
          <p className={styles.paymentSummaryValue} style={{ color: "var(--success)" }}>
            {formatNaira(paymentSummary.quotePaymentTotal)}
          </p>
        </div>
        <div className={styles.paymentSummaryCard}>
          <span className={styles.paymentSummaryLabel}>Transactions</span>
          <p className={styles.paymentSummaryValue}>{paymentSummary.transactionCount}</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.paymentListHeader}>
          <h3 className={styles.cardTitle}>Payment ledger</h3>
          <span className="badge badge-info">{payments.length} recorded</span>
        </div>

        {payments.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-secondary)" }}>
            <span style={{ fontSize: "2rem" }}>💳</span>
            <p style={{ marginTop: "1rem" }}>No payments recorded yet.</p>
            <p style={{ fontSize: "0.85rem", marginTop: "0.35rem" }}>
              Admin earnings from customer booking fees and paid service quotes.
            </p>
          </div>
        ) : (
          <div className={styles.paymentList}>
            {payments.map((payment) => (
              <div key={payment.id} className={styles.paymentRow}>
                <div className={styles.paymentRowMain}>
                  <span
                    className={`badge ${
                      payment.type === "booking_fee" ? "badge-amber" : "badge-success"
                    }`}
                    style={{ fontSize: "0.65rem" }}
                  >
                    {PAYMENT_TYPE_LABELS[payment.type]}
                  </span>
                  <p className={styles.paymentRowCustomer}>{payment.customerName}</p>
                  <button
                    type="button"
                    className={styles.paymentRequestLink}
                    onClick={() => {
                      onOpenRequestsTab();
                      onSelectRequest(payment.requestId);
                    }}
                  >
                    {payment.requestId}
                  </button>
                </div>
                <div className={styles.paymentRowMeta}>
                  <p className={styles.paymentRowAmount}>{formatNaira(payment.amount)}</p>
                  <p className={styles.paymentRowRef}>
                    {formatNaira(payment.sourceAmount)} × {Math.round(payment.rate * 100)}%
                  </p>
                  <p className={styles.paymentRowRef}>{payment.reference}</p>
                  <p className={styles.paymentRowTime}>
                    {new Date(payment.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
