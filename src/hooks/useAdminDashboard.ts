"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { API_BASE_URL } from "@/lib/api";
import { getServiceDistributionCounts, SERVICE_DETAILS } from "@/lib/constants";
import type {
  AdminTab,
  Application,
  ContactSubmission,
  DashboardStats,
  Dispute,
  NewProviderForm,
  Provider,
  RequestData,
  RequestFilter,
} from "@/lib/types";

const INITIAL_PROVIDER_FORM: NewProviderForm = {
  name: "",
  phone: "",
  vehicle: "",
  plate: "",
  speciality: "towing",
  avatar: "",
};

export function useAdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);
  const [requestFilter, setRequestFilter] = useState<RequestFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedApplicationId, setExpandedApplicationId] = useState<string | null>(null);
  const [newProv, setNewProv] = useState<NewProviderForm>(INITIAL_PROVIDER_FORM);
  const [provFormSubmitting, setProvFormSubmitting] = useState(false);
  const [provFormSuccess, setProvFormSuccess] = useState(false);

  const toggleApplication = useCallback((id: string) => {
    setExpandedApplicationId((prev) => (prev === id ? null : id));
  }, []);

  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setServerError(null);

    try {
      const [reqRes, provRes, contactRes, disputeRes, appRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/requests`),
        fetch(`${API_BASE_URL}/api/providers`),
        fetch(`${API_BASE_URL}/api/contact`),
        fetch(`${API_BASE_URL}/api/disputes`),
        fetch(`${API_BASE_URL}/api/applications`),
      ]);

      if (reqRes.ok) setRequests(await reqRes.json());
      if (provRes.ok) setProviders(await provRes.json());
      if (contactRes.ok) setContacts(await contactRes.json());
      if (disputeRes.ok) setDisputes(await disputeRes.json());
      if (appRes.ok) setApplications(await appRes.json());
    } catch (err) {
      console.error("API Fetch Error:", err);
      setServerError(`Could not connect to the RoadRescue API Server on ${API_BASE_URL}`);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 4000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleUpdateRequest = useCallback(
    async (id: string, updates: Partial<RequestData>) => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/requests`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, ...updates }),
        });
        if (res.ok) {
          const updated = await res.json();
          setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
          fetchData(true);
        }
      } catch (err) {
        console.error("Failed to patch request:", err);
      }
    },
    [fetchData]
  );

  const handleDispatch = useCallback(
    (request: RequestData, provider: Provider) => {
      handleUpdateRequest(request.id, {
        assignedProvider: { ...provider, status: "Dispatched" },
        status: "matched",
      });
    },
    [handleUpdateRequest]
  );

  const handleQuoteApproval = useCallback(
    async (id: string, action: "approve" | "reject"): Promise<boolean> => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/requests/quote-approval`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, action }),
        });
        if (res.ok) {
          const updated = await res.json();
          setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
          fetchData(true);
          return true;
        }
        const body = await res.json().catch(() => ({}));
        setServerError(
          (body as { error?: string }).error || "Failed to review quote. Restart the API server and try again."
        );
        return false;
      } catch (err) {
        console.error("Failed to review quote:", err);
        return false;
      }
    },
    [fetchData]
  );

  const handleDisputeStatusChange = useCallback(async (id: string, status: Dispute["status"]) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/disputes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setDisputes((prev) => prev.map((d) => (d.id === id ? updated : d)));
      }
    } catch (err) {
      console.error("Failed to update dispute status:", err);
    }
  }, []);

  const handleApplicationStatus = useCallback(
    async (id: string, status: "approved" | "rejected") => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/applications`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status }),
        });
        if (res.ok) {
          const updated = await res.json();
          setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
          fetchData(true);
        }
      } catch (err) {
        console.error("Failed to update application status:", err);
      }
    },
    [fetchData]
  );

  const handleAddProvider = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setProvFormSubmitting(true);
      setProvFormSuccess(false);

      const avatarInitials =
        newProv.avatar.trim() ||
        newProv.name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .substring(0, 2)
          .toUpperCase();

      try {
        const res = await fetch(`${API_BASE_URL}/api/providers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newProv, avatar: avatarInitials }),
        });

        if (res.ok) {
          setProvFormSuccess(true);
          setNewProv(INITIAL_PROVIDER_FORM);
          fetchData(true);
          setTimeout(() => setProvFormSuccess(false), 3000);
        }
      } catch (err) {
        console.error("Failed to create provider:", err);
      } finally {
        setProvFormSubmitting(false);
      }
    },
    [newProv, fetchData]
  );

  const activeRequest = useMemo(
    () => requests.find((r) => r.id === selectedRequestId) || null,
    [requests, selectedRequestId]
  );

  const stats: DashboardStats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === "received").length;
    const active = requests.filter((r) =>
      ["matched", "en-route", "arrived", "assessing", "awaiting-payment", "in-progress"].includes(r.status)
    ).length;
    const completed = requests.filter((r) => r.status === "completed").length;
    const totalDrivers = providers.length;
    const availableDrivers = providers.filter((p) => p.status === "Available").length;
    return { total, pending, active, completed, totalDrivers, availableDrivers };
  }, [requests, providers]);

  const serviceDistribution = useMemo(
    () => getServiceDistributionCounts(requests.map((r) => r.service)),
    [requests]
  );

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      if (requestFilter === "pending" && req.status !== "received") return false;
      if (requestFilter === "active" && !["matched", "en-route", "arrived", "assessing", "awaiting-payment", "in-progress"].includes(req.status)) return false;
      if (requestFilter === "completed" && req.status !== "completed") return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = req.name.toLowerCase().includes(q);
        const matchesId = req.id.toLowerCase().includes(q);
        const matchesLoc = req.location.toLowerCase().includes(q);
        const matchesService = (SERVICE_DETAILS[req.service] || req.service).toLowerCase().includes(q);
        const matchesVehicle = [req.vehicleMake, req.vehicleModel]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q);
        return matchesName || matchesId || matchesLoc || matchesService || matchesVehicle;
      }
      return true;
    });
  }, [requests, requestFilter, searchQuery]);

  return {
    activeTab,
    setActiveTab,
    requests,
    providers,
    contacts,
    disputes,
    applications,
    selectedRequestId,
    setSelectedRequestId,
    loading,
    serverError,
    requestFilter,
    setRequestFilter,
    searchQuery,
    setSearchQuery,
    expandedApplicationId,
    toggleApplication,
    newProv,
    setNewProv,
    provFormSubmitting,
    provFormSuccess,
    activeRequest,
    stats,
    serviceDistribution,
    filteredRequests,
    handleUpdateRequest,
    handleDispatch,
    handleQuoteApproval,
    handleDisputeStatusChange,
    handleApplicationStatus,
    handleAddProvider,
  };
}

export type AdminDashboardState = ReturnType<typeof useAdminDashboard>;
