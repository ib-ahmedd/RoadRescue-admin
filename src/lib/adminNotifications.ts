import { SERVICE_DETAILS } from "@/lib/constants";
import type {
  Application,
  ContactSubmission,
  Dispute,
  Payment,
  RequestData,
  RequestStatus,
} from "@/lib/types";

export type AdminNotificationKind =
  | "new_request"
  | "request_status"
  | "quote_submitted"
  | "payment_received"
  | "new_dispute"
  | "new_application"
  | "new_contact";

export interface AdminNotification {
  toastId: string;
  kind: AdminNotificationKind;
  title: string;
  message: string;
  entityId?: string;
}

export type AdminNotificationInput = Omit<AdminNotification, "toastId">;

export interface AdminDataSnapshot {
  requests: Map<
    string,
    {
      status: RequestStatus;
      name: string;
      service: string;
      quoteStatus: NonNullable<RequestData["quoteStatus"]>;
      quoteAmount: number;
    }
  >;
  disputes: Map<string, { customerName: string; requestId: string }>;
  applications: Map<string, { name: string; speciality: string }>;
  contacts: Map<string, { name: string; subject: string }>;
  payments: Map<string, { customerName: string; type: Payment["type"]; amount: number; requestId: string }>;
}

function formatStatus(status: RequestStatus): string {
  const labels: Record<RequestStatus, string> = {
    received: "Received",
    matched: "Matched",
    "en-route": "En route",
    arrived: "Arrived",
    assessing: "Assessing",
    "awaiting-payment": "Awaiting payment",
    "in-progress": "In progress",
    completed: "Completed",
    disputed: "Disputed",
  };
  return labels[status] ?? status;
}

export function buildSnapshot(
  requests: RequestData[],
  disputes: Dispute[],
  applications: Application[],
  contacts: ContactSubmission[],
  payments: Payment[] = []
): AdminDataSnapshot {
  return {
    requests: new Map(
      requests.map((r) => [
        r.id,
        {
          status: r.status,
          name: r.name,
          service: r.service,
          quoteStatus: r.quoteStatus ?? "none",
          quoteAmount: r.quoteAmount ?? 0,
        },
      ])
    ),
    disputes: new Map(
      disputes.map((d) => [d.id, { customerName: d.customerName, requestId: d.requestId }])
    ),
    applications: new Map(
      applications.map((a) => [a.id, { name: a.name, speciality: a.speciality }])
    ),
    contacts: new Map(
      contacts.map((c) => [c.id, { name: c.name, subject: c.subject }])
    ),
    payments: new Map(
      payments.map((p) => [
        p.id,
        { customerName: p.customerName, type: p.type, amount: p.amount, requestId: p.requestId },
      ])
    ),
  };
}

export function detectAdminChanges(
  prev: AdminDataSnapshot,
  next: AdminDataSnapshot,
  options?: { skipRequestIds?: Set<string> }
): AdminNotificationInput[] {
  const notifications: AdminNotificationInput[] = [];
  const skipRequestIds = options?.skipRequestIds ?? new Set<string>();

  const newDisputeRequestIds = new Set<string>();
  for (const [disputeId, dispute] of next.disputes) {
    if (!prev.disputes.has(disputeId)) {
      newDisputeRequestIds.add(dispute.requestId);
    }
  }

  for (const [id, req] of next.requests) {
    if (!prev.requests.has(id)) {
      const serviceLabel = SERVICE_DETAILS[req.service] || req.service;
      notifications.push({
        kind: "new_request",
        title: "New rescue request",
        message: `${req.name} • ${serviceLabel} • ${id}`,
        entityId: id,
      });
    }
  }

  for (const [id, req] of next.requests) {
    const previous = prev.requests.get(id);
    if (!previous || previous.status === req.status) continue;
    if (skipRequestIds.has(id)) continue;
    if (req.status === "disputed") continue;
    if (newDisputeRequestIds.has(id)) continue;

    notifications.push({
      kind: "request_status",
      title: "Request status updated",
      message: `${id}: ${formatStatus(previous.status)} → ${formatStatus(req.status)}`,
      entityId: id,
    });
  }

  for (const [id, req] of next.requests) {
    const previous = prev.requests.get(id);
    if (!previous || previous.quoteStatus === "pending") continue;
    if (req.quoteStatus !== "pending") continue;

    const amount = req.quoteAmount > 0 ? ` • ₦${req.quoteAmount.toLocaleString("en-NG")}` : "";
    notifications.push({
      kind: "quote_submitted",
      title: "Technician quote submitted",
      message: `${req.name} • ${id}${amount}`,
      entityId: id,
    });
  }

  for (const [id, dispute] of next.disputes) {
    if (!prev.disputes.has(id)) {
      notifications.push({
        kind: "new_dispute",
        title: "New dispute filed",
        message: `${dispute.customerName} • ${dispute.requestId}`,
        entityId: id,
      });
    }
  }

  for (const [id, application] of next.applications) {
    if (!prev.applications.has(id)) {
      notifications.push({
        kind: "new_application",
        title: "New technician application",
        message: `${application.name} • ${application.speciality}`,
        entityId: id,
      });
    }
  }

  for (const [id, contact] of next.contacts) {
    if (!prev.contacts.has(id)) {
      notifications.push({
        kind: "new_contact",
        title: "New contact enquiry",
        message: `${contact.name} • ${contact.subject}`,
        entityId: id,
      });
    }
  }

  for (const [id, payment] of next.payments) {
    if (!prev.payments.has(id)) {
      const typeLabel = payment.type === "booking_fee" ? "Booking fee" : "Quote payment";
      notifications.push({
        kind: "payment_received",
        title: "Payment received",
        message: `${payment.customerName} • ${typeLabel} • ₦${payment.amount.toLocaleString("en-NG")}`,
        entityId: payment.requestId,
      });
    }
  }

  return notifications;
}
