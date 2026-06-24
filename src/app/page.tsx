"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { API_BASE_URL } from "@/lib/api";
import styles from "./Dashboard.module.css";

// ── Types ───────────────────────────────────────────────────────────────────

interface Provider {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  plate: string;
  speciality: string;
  rating: number;
  reviews: number;
  status: "Available" | "Dispatched" | "Offline";
  avatar: string;
}

interface RequestData {
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
  status: "received" | "matched" | "en-route" | "arrived" | "completed";
  assignedProvider: Provider | null;
  contacted: boolean;
  createdAt: string;
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

const SERVICE_DETAILS: Record<string, string> = {
  towing: "🚛 Towing",
  battery: "🔋 Battery Jump",
  "flat-tire": "🔧 Flat Tire Change",
  fuel: "⛽ Fuel Delivery",
  lockout: "🔑 Lockout Service",
  repair: "🔩 Minor Repair",
};

// ── Dashboard Page Component ───────────────────────────────────────────────

export default function AdminDashboard() {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<"overview" | "requests" | "technicians" | "contacts">("overview");

  // App data state
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  
  // Loading & status states
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);
  const [requestFilter, setRequestFilter] = useState<"all" | "pending" | "active" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // New Provider form state
  const [newProv, setNewProv] = useState({
    name: "",
    phone: "",
    vehicle: "",
    plate: "",
    speciality: "towing",
    avatar: "",
  });
  const [provFormSubmitting, setProvFormSubmitting] = useState(false);
  const [provFormSuccess, setProvFormSuccess] = useState(false);

  // ── API Fetch Functions ───────────────────────────────────────────────────

  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setServerError(null);

    try {
      // 1. Fetch Requests
      const reqRes = await fetch(`${API_BASE_URL}/api/requests`);
      let reqs: RequestData[] = [];
      if (reqRes.ok) {
        reqs = await reqRes.json();
        setRequests(reqs);
      }

      // 2. Fetch Providers
      const provRes = await fetch(`${API_BASE_URL}/api/providers`);
      if (provRes.ok) {
        const provs = await provRes.json();
        setProviders(provs);
      }

      // 3. Fetch Contacts
      const contactRes = await fetch(`${API_BASE_URL}/api/contact`);
      if (contactRes.ok) {
        const conts = await contactRes.json();
        setContacts(conts);
      }
    } catch (err) {
      console.error("API Fetch Error:", err);
      setServerError("Could not connect to the RoadRescue API Server on " + API_BASE_URL);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  // Set up polling
  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData(true);
    }, 4000); // sync every 4 seconds

    return () => clearInterval(interval);
  }, [fetchData]);

  // ── Request Handlers ──────────────────────────────────────────────────────

  const handleUpdateRequest = async (id: string, updates: Partial<RequestData>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/requests`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      if (res.ok) {
        const updated = await res.json();
        setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
        // Refresh providers to reflect updated statuses in real-time
        fetchData(true);
      }
    } catch (err) {
      console.error("Failed to patch request:", err);
    }
  };

  const handleDispatch = (request: RequestData, provider: Provider) => {
    handleUpdateRequest(request.id, {
      assignedProvider: {
        ...provider,
        status: "Dispatched",
      },
      status: "matched",
    });
  };

  const handleStatusChange = (request: RequestData, newStatus: RequestData["status"]) => {
    handleUpdateRequest(request.id, { status: newStatus });
  };

  // ── Provider Add Handler ──────────────────────────────────────────────────

  const handleAddProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    setProvFormSubmitting(true);
    setProvFormSuccess(false);

    // Auto-generate avatar initials if empty
    const avatarInitials = newProv.avatar.trim() || 
      newProv.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();

    try {
      const res = await fetch(`${API_BASE_URL}/api/providers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProv,
          avatar: avatarInitials,
        }),
      });

      if (res.ok) {
        setProvFormSuccess(true);
        setNewProv({
          name: "",
          phone: "",
          vehicle: "",
          plate: "",
          speciality: "towing",
          avatar: "",
        });
        // Reload providers list
        fetchData(true);
        setTimeout(() => setProvFormSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to create provider:", err);
    } finally {
      setProvFormSubmitting(false);
    }
  };

  // ── Memoized Computations ─────────────────────────────────────────────────

  const activeRequest = useMemo(() => {
    return requests.find((r) => r.id === selectedRequestId) || null;
  }, [requests, selectedRequestId]);

  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === "received").length;
    const active = requests.filter((r) => ["matched", "en-route", "arrived"].includes(r.status)).length;
    const completed = requests.filter((r) => r.status === "completed").length;
    const totalDrivers = providers.length;
    const availableDrivers = providers.filter((p) => p.status === "Available").length;

    return { total, pending, active, completed, totalDrivers, availableDrivers };
  }, [requests, providers]);

  // Request frequency distribution for chart
  const serviceDistribution = useMemo(() => {
    const counts: Record<string, number> = { towing: 0, battery: 0, "flat-tire": 0, fuel: 0, lockout: 0, repair: 0 };
    requests.forEach(r => {
      if (counts[r.service] !== undefined) counts[r.service]++;
    });
    return counts;
  }, [requests]);

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Tab status filter
      if (requestFilter === "pending" && req.status !== "received") return false;
      if (requestFilter === "active" && !["matched", "en-route", "arrived"].includes(req.status)) return false;
      if (requestFilter === "completed" && req.status !== "completed") return false;

      // Text query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = req.name.toLowerCase().includes(q);
        const matchesId = req.id.toLowerCase().includes(q);
        const matchesLoc = req.location.toLowerCase().includes(q);
        const matchesService = (SERVICE_DETAILS[req.service] || req.service).toLowerCase().includes(q);
        const matchesVehicle = [req.vehicleMake, req.vehicleModel].filter(Boolean).join(" ").toLowerCase().includes(q);
        return matchesName || matchesId || matchesLoc || matchesService || matchesVehicle;
      }
      return true;
    });
  }, [requests, requestFilter, searchQuery]);

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  // ── Render Views ──────────────────────────────────────────────────────────

  return (
    <div className={styles.layout}>
      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.logoIcon}>🚨</span>
          <div>
            <h1 className={styles.brandName}>RoadRescue</h1>
            <span className="badge badge-amber" style={{ fontSize: "0.6rem", padding: "0.15rem 0.4rem" }}>Ops Center</span>
          </div>
        </div>

        <nav className={styles.nav}>
          <button
            className={`${styles.navItem} ${activeTab === "overview" ? styles.navItemActive : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            📊 Overview Dashboard
          </button>
          <button
            className={`${styles.navItem} ${activeTab === "requests" ? styles.navItemActive : ""}`}
            onClick={() => setActiveTab("requests")}
          >
            📋 Rescue Requests
            {stats.pending > 0 && (
              <span className="badge badge-danger" style={{ marginLeft: "auto", fontSize: "0.65rem", padding: "0.1rem 0.4rem" }}>
                {stats.pending}
              </span>
            )}
          </button>
          <button
            className={`${styles.navItem} ${activeTab === "technicians" ? styles.navItemActive : ""}`}
            onClick={() => setActiveTab("technicians")}
          >
            👷 Manage Technicians
          </button>
          <button
            className={`${styles.navItem} ${activeTab === "contacts" ? styles.navItemActive : ""}`}
            onClick={() => setActiveTab("contacts")}
          >
            ✉️ Contact Inquiries
            {contacts.length > 0 && (
              <span className="badge badge-info" style={{ marginLeft: "auto", fontSize: "0.65rem", padding: "0.1rem 0.4rem" }}>
                {contacts.length}
              </span>
            )}
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.statusIndicator}>
            <span className={styles.pulseDot} />
            <span>Operational Feed Live</span>
          </div>
        </div>
      </aside>

      {/* ── Main Workspace Content ── */}
      <main className={styles.content}>
        {/* Header bar */}
        <header className={styles.header}>
          <div>
            <span className="badge badge-amber">RoadRescue Administration</span>
            <h2 className={styles.pageTitle}>
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "requests" && "Roadside Assistance Dispatch"}
              {activeTab === "technicians" && "Technician Directory & Registry"}
              {activeTab === "contacts" && "Customer Support Inquiries"}
            </h2>
          </div>
          <div className={styles.dateDisplay}>
            📅 {new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
          </div>
        </header>

        {serverError && (
          <div className="badge badge-danger" style={{ display: "flex", width: "100%", padding: "1rem", borderRadius: "10px", marginBottom: "2rem", textTransform: "none", fontSize: "0.9rem" }}>
            ⚠️ <strong>Connection Error:</strong> {serverError}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "10rem 0" }}>
            <span className="dot-pulse"><span/><span/><span/></span>
            <p style={{ marginTop: "1.5rem", color: "var(--text-secondary)" }}>Fetching real-time feeds...</p>
          </div>
        ) : (
          <div className="animate-fadeIn">

            {/* ━━━━━━━━━━ OVERVIEW TAB ━━━━━━━━━━ */}
            {activeTab === "overview" && (
              <>
                {/* Stats Summary Cards */}
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <span className={styles.statIcon}>📋</span>
                    <div>
                      <p className={styles.statLabel}>Total Rescues</p>
                      <p className={styles.statValue}>{stats.total}</p>
                    </div>
                  </div>
                  <div className={styles.statCard} style={{ borderLeft: "4px solid var(--danger)" }}>
                    <span className={styles.statIcon} style={{ background: "rgba(239,68,68,0.06)" }}>⏳</span>
                    <div>
                      <p className={styles.statLabel}>Unassigned</p>
                      <p className={styles.statValue} style={{ color: "var(--danger)" }}>{stats.pending}</p>
                    </div>
                  </div>
                  <div className={styles.statCard} style={{ borderLeft: "4px solid var(--amber)" }}>
                    <span className={styles.statIcon} style={{ background: "rgba(245,158,11,0.06)" }}>🚛</span>
                    <div>
                      <p className={styles.statLabel}>Active Missions</p>
                      <p className={styles.statValue} style={{ color: "var(--amber)" }}>{stats.active}</p>
                    </div>
                  </div>
                  <div className={styles.statCard} style={{ borderLeft: "4px solid var(--success)" }}>
                    <span className={styles.statIcon} style={{ background: "rgba(34,197,94,0.06)" }}>👷</span>
                    <div>
                      <p className={styles.statLabel}>Techs Active</p>
                      <p className={styles.statValue} style={{ color: "var(--success)" }}>
                        {stats.availableDrivers} / {stats.totalDrivers}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dashboard Analytics & activity grid */}
                <div className={styles.overviewGrid}>
                  {/* Left: Interactive Progress list of service shares */}
                  <div className={styles.card}>
                    <h3 className={styles.cardTitle}>🛠️ Incident Distributions</h3>
                    <div className={styles.progressList}>
                      {Object.entries(SERVICE_DETAILS).map(([key, label]) => {
                        const count = serviceDistribution[key] || 0;
                        const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
                        let barColor = "var(--amber)";
                        if (key === "battery") barColor = "var(--info)";
                        if (key === "flat-tire") barColor = "var(--success)";
                        if (key === "lockout") barColor = "var(--danger)";
                        if (key === "fuel") barColor = "#a855f7";

                        return (
                          <div key={key} className={styles.progressItem}>
                            <div className={styles.progressLabelRow}>
                              <span>{label}</span>
                              <strong>{count} request{count !== 1 && "s"} ({Math.round(pct)}%)</strong>
                            </div>
                            <div className={styles.progressBarBg}>
                              <div className={styles.progressBarFill} style={{ width: `${pct}%`, background: barColor }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right: Live Activity Stream */}
                  <div className={styles.card}>
                    <h3 className={styles.cardTitle}>📡 Live Operational Stream</h3>
                    <div className={styles.activityList}>
                      {requests.slice(0, 5).map((req) => (
                        <div key={req.id} className={styles.activityItem}>
                          <span className={styles.activityIcon}>
                            {req.status === "completed" ? "✅" : req.status === "received" ? "⏳" : "🚛"}
                          </span>
                          <div className={styles.activityMeta}>
                            <p className={styles.activityText}>
                              <strong>{req.name}</strong> requested <strong>{req.service}</strong> assistance
                            </p>
                            <span className={styles.activityTime}>{formatTimeAgo(req.createdAt)} • Status: {req.status}</span>
                          </div>
                        </div>
                      ))}
                      {requests.length === 0 && (
                        <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                          No ongoing roadside incident streams.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ━━━━━━━━━━ DISPATCH REQUESTS TAB ━━━━━━━━━━ */}
            {activeTab === "requests" && (
              <div className={styles.splitLayout}>
                {/* Left panel requests list */}
                <div className={styles.listPanel}>
                  <div className={styles.panelHeader}>
                    <div className={styles.searchBox}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Search name, ID, vehicle, location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className={styles.filterTabs}>
                      {(["all", "pending", "active", "completed"] as const).map((tab) => (
                        <button
                          key={tab}
                          className={`${styles.filterTab} ${requestFilter === tab ? styles.filterTabActive : ""}`}
                          onClick={() => setRequestFilter(tab)}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.listItems}>
                    {filteredRequests.length === 0 ? (
                      <p style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                        No incident requests matching.
                      </p>
                    ) : (
                      filteredRequests.map((req) => {
                        const isActive = req.id === selectedRequestId;
                        return (
                          <button
                            key={req.id}
                            className={`${styles.requestCard} ${isActive ? styles.requestCardActive : ""}`}
                            onClick={() => setSelectedRequestId(req.id)}
                          >
                            <div className={styles.cardHeader}>
                              <span className={styles.clientName}>{req.name}</span>
                              <span className={styles.reqId}>{req.id}</span>
                            </div>
                            <div className={styles.cardMeta}>
                              <span className="badge badge-amber" style={{ fontSize: "0.6rem", textTransform: "lowercase", padding: "0.1rem 0.35rem" }}>
                                {SERVICE_DETAILS[req.service] || req.service}
                              </span>
                              <span>{formatTimeAgo(req.createdAt)}</span>
                            </div>
                            <p className={styles.locationSnippet}>📍 {req.location}</p>
                            <div>
                              <span className={`badge ${
                                req.status === "received" ? "badge-danger" : 
                                req.status === "completed" ? "badge-success" : 
                                "badge-amber"
                              }`} style={{ fontSize: "0.65rem" }}>
                                {req.status === "received" ? "Pending" : req.status === "completed" ? "Completed" : req.status}
                              </span>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right panel request details */}
                <div className={styles.detailsPanel}>
                  {activeRequest ? (
                    <div>
                      <div className={styles.detailHeader}>
                        <div>
                          <span className="badge badge-amber" style={{ marginBottom: "0.5rem" }}>Rescue Mission Details</span>
                          <h3 className={styles.detailTitle}>{activeRequest.name}</h3>
                          <span className={styles.detailId}>Ticket ID: {activeRequest.id}</span>
                        </div>
                        <div className={styles.detailActions}>
                          <a href={`tel:${activeRequest.phone}`} className="btn btn-outline">
                            📞 Contact Driver
                          </a>
                        </div>
                      </div>

                      {/* Log client communication check */}
                      <div className={styles.contactBar}>
                        <span className={styles.contactText}>Operational Dispatch Protocol: Log confirmation call</span>
                        <label className={styles.contactCheckboxWrap}>
                          <input
                            type="checkbox"
                            style={{ width: "16px", height: "16px", cursor: "pointer" }}
                            checked={activeRequest.contacted}
                            onChange={(e) => handleUpdateRequest(activeRequest.id, { contacted: e.target.checked })}
                          />
                          Client Contacted
                        </label>
                      </div>

                      {/* Info specifications grid */}
                      <div className={styles.infoGrid}>
                        <div className={styles.infoBlock}>
                          <span className={styles.infoLabel}>Requested Assistance</span>
                          <span className={styles.infoValue} style={{ color: "var(--amber)" }}>
                            {SERVICE_DETAILS[activeRequest.service] || activeRequest.service}
                          </span>
                        </div>
                        <div className={styles.infoBlock}>
                          <span className={styles.infoLabel}>Stranded Coordinates / Address</span>
                          <span className={styles.infoValue}>📍 {activeRequest.location}</span>
                        </div>
                        <div className={styles.infoBlock}>
                          <span className={styles.infoLabel}>Vehicle Specifications</span>
                          <span className={styles.infoValue}>
                            {[activeRequest.vehicleYear, activeRequest.vehicleMake, activeRequest.vehicleModel, activeRequest.vehicleColor].filter(Boolean).join(" ") || "Unspecified Vehicle"}
                          </span>
                        </div>
                        <div className={styles.infoBlock}>
                          <span className={styles.infoLabel}>Driver Primary Phone</span>
                          <span className={styles.infoValue}>{activeRequest.phone}</span>
                        </div>
                      </div>

                      {activeRequest.landmark && (
                        <>
                          <h4 className={styles.sectionTitle}>🗺️ Nearby Landmark</h4>
                          <p className={styles.problemDesc} style={{ background: "rgba(59,130,246,0.02)", borderColor: "rgba(59,130,246,0.08)" }}>
                            {activeRequest.landmark}
                          </p>
                        </>
                      )}

                      <h4 className={styles.sectionTitle}>🛠️ Dispatcher Assessment Notes</h4>
                      <p className={styles.problemDesc}>
                        {activeRequest.notes || "No mechanical descriptions provided by customer."}
                      </p>

                      {/* Driver Dispatch Options */}
                      <h4 className={styles.sectionTitle}>👷 Dispatch Technician</h4>
                      <div className={styles.dispatchSection}>
                        {activeRequest.assignedProvider ? (
                          <div className={styles.providerRow} style={{ borderColor: "var(--success)" }}>
                            <div className={styles.providerProfile}>
                              <div className={styles.providerAvatar} style={{ background: "rgba(34,197,94,0.08)", color: "var(--success)" }}>
                                {activeRequest.assignedProvider.avatar}
                              </div>
                              <div className={styles.providerInfo}>
                                <span className={styles.providerName}>{activeRequest.assignedProvider.name}</span>
                                <span className={styles.providerDetails}>
                                  Vehicle: {activeRequest.assignedProvider.vehicle} | Plate: {activeRequest.assignedProvider.plate}
                                </span>
                              </div>
                            </div>
                            <span className="badge badge-success">Assigned</span>
                          </div>
                        ) : (
                          <div>
                            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
                              Assign a technician matching speciality (<strong>{activeRequest.service}</strong>):
                            </p>
                            {providers.filter(p => p.status !== "Offline").length === 0 ? (
                              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
                                No technicians currently available. Register a new operator in the Technicians panel.
                              </p>
                            ) : (
                              providers
                                .filter(p => p.status !== "Offline")
                                .map((p) => {
                                  const isMatch = p.speciality === activeRequest.service;
                                  return (
                                    <div key={p.id} className={styles.providerRow} style={{ border: isMatch ? "1px solid rgba(245,158,11,0.2)" : "1px solid var(--border)" }}>
                                      <div className={styles.providerProfile}>
                                        <div className={styles.providerAvatar}>{p.avatar}</div>
                                        <div className={styles.providerInfo}>
                                          <span className={styles.providerName}>
                                            {p.name} {isMatch && <span style={{ color: "var(--amber)", fontSize: "0.7rem" }}>(Match)</span>}
                                          </span>
                                          <span className={styles.providerDetails}>
                                            ★ {p.rating} | {p.vehicle}
                                          </span>
                                        </div>
                                      </div>
                                      <button
                                        className={styles.dispatchBtn}
                                        disabled={p.status !== "Available"}
                                        style={{ opacity: p.status === "Available" ? 1 : 0.5 }}
                                        onClick={() => handleDispatch(activeRequest, p)}
                                      >
                                        {p.status === "Available" ? "Dispatch" : "Unavailable"}
                                      </button>
                                    </div>
                                  );
                                })
                            )}
                          </div>
                        )}
                      </div>

                      {/* Status step manual progression controls */}
                      {activeRequest.assignedProvider && (
                        <>
                          <h4 className={styles.sectionTitle}>⚙️ Progress Controls</h4>
                          <div className={styles.statusSliderCard}>
                            <div className={styles.statusStepContainer}>
                              {(["matched", "en-route", "arrived", "completed"] as const).map((step) => {
                                const isCurrent = activeRequest.status === step;
                                return (
                                  <button
                                    key={step}
                                    className={`${styles.statusStepBtn} ${isCurrent ? styles.statusStepBtnActive : ""}`}
                                    onClick={() => handleStatusChange(activeRequest, step)}
                                  >
                                    {step === "matched" ? "Matched" : step === "en-route" ? "En Route" : step === "arrived" ? "Arrived" : "Completed"}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className={styles.emptyDetails}>
                      <span className={styles.emptyIcon}>🚨</span>
                      <h3>No Assistance Incident Selected</h3>
                      <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
                        Select a roadside dispatch ticket from the left panel to review notes, coordinates, and dispatch operations.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ━━━━━━━━━━ TECHNICIANS TAB ━━━━━━━━━━ */}
            {activeTab === "technicians" && (
              <div className={styles.techLayout}>
                {/* Directory Table */}
                <div className={styles.card}>
                  <h3 className={styles.cardTitle}>👷 Fleet Directory</h3>
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
                            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "monospace" }}>{p.plate}</span>
                          </td>
                          <td>
                            <span className="badge badge-amber" style={{ fontSize: "0.65rem" }}>
                              {SERVICE_DETAILS[p.speciality] || p.speciality}
                            </span>
                          </td>
                          <td>
                            <div>★ {p.rating}</div>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{p.reviews} review{p.reviews !== 1 && "s"}</span>
                          </td>
                          <td>
                            <span className={`badge ${
                              p.status === "Available" ? "badge-success" :
                              p.status === "Dispatched" ? "badge-amber" :
                              "badge-danger"
                            }`} style={{ fontSize: "0.7rem" }}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add Technician Form */}
                <div className={styles.techAddForm}>
                  <h3 className={styles.cardTitle}>➕ Register Technician</h3>
                  <form onSubmit={handleAddProvider}>
                    <div className="form-group" style={{ marginBottom: "1rem" }}>
                      <label className="form-label" htmlFor="prov-name">Technician Full Name *</label>
                      <input
                        id="prov-name"
                        type="text"
                        className="form-input"
                        placeholder="Dave Miller"
                        required
                        value={newProv.name}
                        onChange={(e) => setNewProv(p => ({ ...p, name: e.target.value }))}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: "1rem" }}>
                      <label className="form-label" htmlFor="prov-phone">Phone Number *</label>
                      <input
                        id="prov-phone"
                        type="tel"
                        className="form-input"
                        placeholder="+1 (555) 991-3434"
                        required
                        value={newProv.phone}
                        onChange={(e) => setNewProv(p => ({ ...p, phone: e.target.value }))}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: "1rem" }}>
                      <label className="form-label" htmlFor="prov-vehicle">Vehicle Details *</label>
                      <input
                        id="prov-vehicle"
                        type="text"
                        className="form-input"
                        placeholder="Tow Truck (Ford F-550)"
                        required
                        value={newProv.vehicle}
                        onChange={(e) => setNewProv(p => ({ ...p, vehicle: e.target.value }))}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: "1rem" }}>
                      <label className="form-label" htmlFor="prov-plate">License Plate *</label>
                      <input
                        id="prov-plate"
                        type="text"
                        className="form-input"
                        placeholder="TOW-8821"
                        required
                        value={newProv.plate}
                        onChange={(e) => setNewProv(p => ({ ...p, plate: e.target.value }))}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: "1rem" }}>
                      <label className="form-label" htmlFor="prov-spec">Incident Speciality *</label>
                      <select
                        id="prov-spec"
                        className="form-input"
                        style={{ background: "#0c1020" }}
                        value={newProv.speciality}
                        onChange={(e) => setNewProv(p => ({ ...p, speciality: e.target.value }))}
                      >
                        {Object.entries(SERVICE_DETAILS).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                      <label className="form-label" htmlFor="prov-avatar">Avatar Initials (optional)</label>
                      <input
                        id="prov-avatar"
                        type="text"
                        className="form-input"
                        placeholder="DM"
                        maxLength={2}
                        value={newProv.avatar}
                        onChange={(e) => setNewProv(p => ({ ...p, avatar: e.target.value.toUpperCase() }))}
                      />
                    </div>

                    {provFormSuccess && (
                      <div className="badge badge-success" style={{ display: "block", textAlign: "center", padding: "0.5rem", width: "100%", textTransform: "none", marginBottom: "1rem" }}>
                        ✓ Operator registered successfully!
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn btn-primary w-full"
                      style={{ width: "100%" }}
                      disabled={provFormSubmitting}
                    >
                      {provFormSubmitting ? "Processing..." : "Add to Fleet Directory"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ━━━━━━━━━━ CONTACT INQUIRIES TAB ━━━━━━━━━━ */}
            {activeTab === "contacts" && (
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
                          <span className="badge badge-info" style={{ fontSize: "0.6rem", padding: "0.15rem 0.4rem", marginBottom: "0.5rem" }}>
                            {c.subject}
                          </span>
                          <h4 className={styles.inquiryTitle}>{c.name}</h4>
                          <a href={`mailto:${c.email}`} className={styles.inquiryEmail}>{c.email}</a>
                        </div>
                        <div className={styles.inquiryTime}>
                          {new Date(c.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <p className={styles.inquiryBody}>{c.message}</p>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
}
