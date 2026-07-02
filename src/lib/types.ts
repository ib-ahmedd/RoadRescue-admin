export type ProviderStatus = "Available" | "Dispatched" | "Engaged" | "Offline";
export type RequestStatus =
  | "received"
  | "matched"
  | "en-route"
  | "arrived"
  | "assessing"
  | "awaiting-payment"
  | "in-progress"
  | "completed"
  | "disputed";
export type AdminTab = "overview" | "requests" | "technicians" | "contacts" | "disputes" | "applications";
export type RequestFilter = "all" | "pending" | "active" | "completed";

export interface Provider {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  plate: string;
  speciality: string;
  rating: number;
  reviews: number;
  status: ProviderStatus;
  avatar: string;
}

export interface Application {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  plate: string;
  speciality: string;
  avatar: string;
  licenseId: string;
  licenseImage?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface RequestData {
  id: string;
  name: string;
  phone: string;
  email?: string;
  service: string;
  vehicleType: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  vehicleColor?: string;
  location: string;
  landmark?: string;
  notes?: string;
  status: RequestStatus;
  assignedProvider: Provider | null;
  contacted: boolean;
  completionConfirmed?: boolean;
  technicianMarkedComplete?: boolean;
  bookingFee?: number;
  paymentStatus?: "pending" | "paid";
  paymentReference?: string;
  technicianAssessment?: string;
  quoteAmount?: number;
  quoteStatus?: "none" | "pending" | "approved" | "rejected" | "paid";
  quotePaymentReference?: string;
  createdAt: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface Dispute {
  id: string;
  requestId: string;
  customerName: string;
  customerPhone: string;
  reason: string;
  description: string;
  status: "open" | "reviewing" | "resolved";
  createdAt: string;
}

export interface NewProviderForm {
  name: string;
  phone: string;
  vehicle: string;
  plate: string;
  speciality: string;
  avatar: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  active: number;
  completed: number;
  totalDrivers: number;
  availableDrivers: number;
}
