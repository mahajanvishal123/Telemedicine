// src/Components/PatientDashboard/MyAppointments.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./MyAppointments.css";
import API_URL from "../../../Baseurl/Baseurl";

const MyAppointments = () => {
  /** ================= CONFIG ================= */
  const BASE_URL = (API_URL || "").replace(/\/$/, "");

  /** ================= HELPERS ================= */
  const safeJSON = (txt) => { try { return JSON.parse(txt); } catch { return null; } };
  const toDate = (v) => (v ? new Date(v) : null);
  const formatDate = (dt) => {
    const d = toDate(dt);
    if (!d || isNaN(d.getTime())) return dt || "—";
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };
  const formatTime = (dt) => {
    const d = toDate(dt);
    if (!d || isNaN(d.getTime())) return "";
    return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  };
  const toMoney = (v) => (v === null || v === undefined || v === "" ? "—" : (isNaN(Number(v)) ? String(v) : `₹${Number(v)}`));
  const norm = (s) => (s == null ? "" : String(s).trim().toLowerCase());
  const dateKey = (v) => {
    const d = toDate(v);
    if (d && !isNaN(d.getTime())) return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    return norm(v);
  };
  const timeKey = (v) => norm(v).replace(/\s+/g, "");

  // Token (optional)
  const loginBlob = safeJSON(localStorage.getItem("user")) || {};
  const accessToken =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    loginBlob?.token ||
    "";
  const authHeaders = () => (accessToken ? { Authorization: `Bearer ${accessToken}` } : {});

  // Patient ID from storage
  const getPatientId = () => {
    const direct = localStorage.getItem("patientId");
    if (direct && direct !== "undefined" && direct !== "null") return String(direct);
    const user = safeJSON(localStorage.getItem("user")) || {};
    if (user?.patientId) return String(user.patientId);
    if (user?.patient?._id) return String(user.patient._id);
    if (user?.role === "patient" && user?._id) return String(user._id);
    const patient = safeJSON(localStorage.getItem("patient")) || {};
    if (patient?._id) return String(patient._id);
    return null;
  };
  const patientId = getPatientId();

  /** ================= STATE ================= */
  const [activeTab, setActiveTab] = useState("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [appointments, setAppointments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [apiResponse, setApiResponse] = useState(null); // For debugging

  /** ================= MAPPER (API -> UI) ================= */
  const mapApiAppointment = (api) => {
    const pat = (typeof api?.patientId === "object" && api.patientId) || null;
    const patient = {
      id: pat?._id || (typeof api?.patientId === "string" ? api.patientId : null),
      name: pat?.name || "",
      email: pat?.email || "",
    };

    const doc = (typeof api?.doctorId === "object" && api.doctorId) || null;
    const doctor = {
      id: doc?._id || null,
      name: doc?.name || api?.doctorName || api?.doctor?.name || "Doctor",
      email: doc?.email || "",
      specialty: doc?.specialty || api?.specialty || api?.department || "General",
      experience: (doc?.experience ?? "").toString().trim(),
      fee: doc?.fee ?? api?.fee ?? "",
      openingTime: doc?.openingTime || "",
      closingTime: doc?.closingTime || "",
      availableDay: (doc?.availableDay ?? "").toString(),
      gender: doc?.gender || "",
      isVerify: String(doc?.isVerify || "0") === "1",
      profile: doc?.profile || "",
      licenseNo: doc?.licenseNo || "",
      documents: doc?.documents || "",
    };

    const s = String(api?.status || "upcoming").toLowerCase();
    const status =
      s.includes("cancel") ? "Cancelled" :
      s.includes("confirm") || s.includes("complete") ? "Completed" :
      "Upcoming";

    let payment = "Unpaid";
    if (api?.paymentStatus) {
      const p = String(api.paymentStatus).toLowerCase();
      payment = p.includes("refund") ? "Refunded" : (p.includes("paid") ? "Paid" : "Unpaid");
    } else if (typeof api?.isPaid === "boolean") {
      payment = api.isPaid ? "Paid" : "Unpaid";
    }

    const apptDateISO = api?.appointmentDate || null;
    const apptTimeText = api?.appointmentTime || "";
    const slot = api?.slotId || {};
    const slotDateISO = slot?.date || null;
    const slotStart = slot?.startTime || "";
    const slotEnd = slot?.endTime || "";
    const slotType = slot?.slotType || "";
    const slotId = slot?._id || "";
    const slotBooked = typeof slot?.isBooked === "boolean" ? slot.isBooked : null;
    const slotBookedBy = slot?.bookedBy || null;

    const primaryDate = apptDateISO || slotDateISO || api?.createdAt || null;
    const primaryTime = apptTimeText || slotStart || "";

    return {
      id: api?._id || api?.id || Math.random().toString(36).slice(2),
      appointmentId: api?._id || "",
      createdAt: api?.createdAt || "",
      updatedAt: api?.updatedAt || "",
      patient,
      doctor,

      date: primaryDate ? formatDate(primaryDate) : "—",
      time: primaryTime ? String(primaryTime) : (primaryDate ? formatTime(primaryDate) : ""),

      doctorName: doctor.name,
      doctorEmail: doctor.email,
      specialty: doctor.specialty,

      type: api?.type || api?.appointmentType || api?.mode || "Video Call",
      reason: api?.reason || "",
      status,
      statusRaw: api?.status || "",
      payment,

      apptDateISO,
      apptTimeText,
      slotDateISO,
      slotStart,
      slotEnd,
      slotType,
      slotId,
      slotBooked,
      slotBookedBy,
    };
  };

  /** ================= FETCH ================= */
  const fetchAppointments = async () => {
    setLoading(true);
    setErrMsg(null);
    try {
      if (!patientId) throw new Error("Patient ID not found in localStorage. Please ensure login stores it.");

      const url = `${BASE_URL}/appointment?patientid=${encodeURIComponent(patientId)}`;
      console.log("Fetching appointments from:", url);
      
      const { data } = await axios.get(url, { headers: { ...authHeaders() } });
      
      // Store the raw API response for debugging
      setApiResponse(data);
      console.log("API Response:", data);

      // Handle different response formats
      let rows = [];
      if (Array.isArray(data)) {
        // Direct array response
        rows = data;
      } else if (data && Array.isArray(data.appointments)) {
        // Response with appointments property
        rows = data.appointments;
      } else if (data && data.data && Array.isArray(data.data)) {
        // Response with data property
        rows = data.data;
      } else if (data && data.results && Array.isArray(data.results)) {
        // Response with results property
        rows = data.results;
      } else {
        console.warn("Unexpected response format:", data);
        rows = [];
      }

      console.log("Extracted rows:", rows);

      // Remove deduplication to show all appointments
      // const byKey = new Map();
      // for (const r of rows) {
      //   const key = buildDupKey(r, patientId);
      //   const prev = byKey.get(key);
      //   if (!prev) {
      //     byKey.set(key, r);
      //   } else {
      //     const prevTs = new Date(prev?.updatedAt || prev?.createdAt || 0).getTime();
      //     const curTs  = new Date(r?.updatedAt || r?.createdAt || 0).getTime();
      //     if (curTs >= prevTs) byKey.set(key, r);
      //   }
      // }
      // const deduped = Array.from(byKey.values());
      
      // Use all rows without deduplication
      const allRows = rows;

      const mapped = allRows.map(mapApiAppointment);
      setAppointments(mapped);

      const counts = mapped.reduce(
        (acc, a) => {
          if (a.status === "Upcoming") acc.pending += 1;
          else if (a.status === "Completed") acc.confirmed += 1;
          else if (a.status === "Cancelled") acc.cancelled += 1;
          acc.total += 1;
          return acc;
        },
        { total: 0, confirmed: 0, pending: 0, cancelled: 0 }
      );
     setSummary(counts);
    } catch (err) {
      console.error("Appointments fetch failed:", err);
      setErrMsg(err?.response?.data?.message || err?.message || "Failed to fetch appointments");
      setAppointments([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchAppointments(); 
    // eslint-disable-next-line
  }, [patientId]);

  /** ================= FILTERS & STATS ================= */
  const filteredAppointments = useMemo(() => {
    if (activeTab === "all") return appointments;
    return appointments.filter((a) => a.status?.toLowerCase() === activeTab);
  }, [appointments, activeTab]);

 const stats = useMemo(() => {
  const total = appointments.length;
  const upcoming = appointments.filter(a => a.status === "Upcoming").length;
  const completed = appointments.filter(a => a.status === "Completed").length;
  const cancelled = appointments.filter(a => a.status === "Cancelled").length;

  return [
    { label: "Total Appointments", value: total, icon: "calendar",      color: "total" },
    { label: "Upcoming",           value: upcoming, icon: "clock",       color: "upcoming" },
    { label: "Completed",          value: completed, icon: "check-circle", color: "completed" },
    { label: "Cancelled",          value: cancelled, icon: "times-circle", color: "cancelled" },
  ];
}, [appointments]);


  const tabs = [
    { key: "all", label: "All Appointments", icon: "calendar-alt" },
    { key: "upcoming", label: "Upcoming", icon: "clock" },
    { key: "completed", label: "Completed", icon: "check" },
    { key: "cancelled", label: "Cancelled", icon: "times" },
  ];

  /** ================= LOCAL EDIT/DELETE (UI ONLY) ================= */
  const handleEditClick = (appointment) => { setSelectedAppointment(appointment); setShowEditModal(true); };
  const handleDeleteClick = (appointment) => { setSelectedAppointment(appointment); setShowDeleteModal(true); };
  const handleViewClick = (appointment) => { setSelectedAppointment(appointment); setShowViewModal(true); };
  const handleEditSave = () => { console.log("Saving changes for appointment:", selectedAppointment); setShowEditModal(false); };
  const handleDeleteConfirm = () => { setAppointments((prev) => prev.filter((appt) => appt.id !== selectedAppointment.id)); setShowDeleteModal(false); };

  /** Small reusable tile for modal */
  const Info = ({ label, value, mono=false }) => (
    <div className="kv">
      <div className={`val ${mono ? "mono" : ""}`}>{value ?? "—"}</div>
      <div className="lbl">{label}</div>
    </div>
  );

  /** ================= RENDER ================= */
  return (
    <div className="">
      {/* compact styles for modal fix */}
      <style>{`
        .modal-dialog.modal-lg{ max-width: min(980px,96vw); }
        .modal-body--scroll{ max-height: min(72vh, 720px); overflow-y: auto; overflow-x: hidden; }
        .kv{ border:1px solid #e5e7eb; border-radius:12px; padding:.6rem .75rem; background:#fff; }
        .kv .val{ font-weight:600; line-height:1.25; overflow-wrap:anywhere; word-break:break-word; }
        .kv .val.mono{ font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size:.92rem; }
        .kv .lbl{ font-size:.78rem; color:#6b7280; }
        .avatar-48{ width:48px; height:48px; border-radius:50%; overflow:hidden; background:#eee; flex:0 0 48px; }
        .truncate{ max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .debug-info {
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          padding: 10px;
          margin: 10px 0;
          font-family: monospace;
          font-size: 12px;
          max-height: 150px;
          overflow-y: auto;
        }
      `}</style>

      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-2">
        <div>
          <h3 className="dashboard-heading mb-1">My Appointments</h3>
          <p className="text-muted mb-0">Manage your healthcare appointments and consultations</p>
        </div>
        <div>
          {loading && <span className="badge bg-info">Loading…</span>}
          {!patientId && (
            <div className="alert alert-warning py-2 px-3 mt-2 mb-0">
              Patient ID not found in localStorage/user. Please ensure login stores it.
            </div>
          )}
        </div>
      </div>

      {errMsg && (
        <div className="alert alert-danger py-2 px-3 mt-2 mb-3">
          {errMsg}{" "}
          <button className="btn btn-sm btn-outline-light ms-2" onClick={fetchAppointments}>Retry</button>
        </div>
      )}

      {/* Debug Info - only show in development */}
      {process.env.NODE_ENV === 'development' && apiResponse && (
        <div className="debug-info">
          <strong>API Response (Debug):</strong>
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
        </div>
      )}

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-12 col-md-3">
            <div className={`stats-card d-flex align-items-center p-3 rounded-3 shadow-sm bg-${stat.color} bg-opacity-10`}>
              <div className={`stats-icon d-flex align-items-center justify-content-center rounded-circle bg-${stat.color} text-white`} style={{ width: "50px", height: "50px", fontSize: "20px" }}>
                <i className={`fas fa-${stat.icon}`}></i>
              </div>
              <div className="ms-3">
                <h6 className="mb-0 fw-bold text-dark">{stat.value}</h6>
                <small className="text-muted">{stat.label}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {tabs.map((tab) => (
          <button key={tab.key} className={`tab-btn ${activeTab === tab.key ? "active" : ""}`} onClick={() => setActiveTab(tab.key)}>
            <i className={`fas fa-${tab.icon}`}></i> {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white rounded-top py-3">
          <h5 className="mb-0"><i className="fas fa-calendar-alt me-2"></i>Appointment Schedule</h5>
          <p className="small mb-0 opacity-90">Manage your healthcare appointments</p>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="py-4 align-middle">Date & Time</th>
                  <th className="py-4 align-middle">Doctor</th>
                  <th className="py-4 align-middle">Specialty</th>
                  <th className="py-4 align-middle">Status</th>
                  <th className="py-4 align-middle">Payment</th>
                  <th className="py-4 align-middle text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appt) => (
                    <tr key={appt.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="date-box me-2"><i className="fas fa-calendar"></i></span>
                          <div><strong>{appt.date}</strong><br /><small className="text-muted">{appt.time}</small></div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="doctor-avatar me-2 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                            <i className="fas fa-user-md"></i>
                          </div>
                          <div>
                            <div className="doctor-name">{appt.doctorName}</div>
                            <div className="small text-muted truncate" title={appt.doctorEmail || ""}>{appt.doctorEmail || "—"}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge bg-light text-dark">{appt.specialty}</span></td>
                      <td>
                        <span className={`badge ${appt.status === "Upcoming" ? "bg-warning text-dark" : appt.status === "Completed" ? "bg-success" : "bg-danger"}`} title={appt.statusRaw}>
                          {appt.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${appt.payment === "Paid" ? "bg-success" : appt.payment === "Refunded" ? "bg-info" : "bg-secondary"}`}>
                          {appt.payment}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-2">
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => handleViewClick(appt)} title="View Details"><i className="fas fa-eye"></i></button>
                          <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditClick(appt)} title="Edit (local)"><i className="fas fa-edit"></i></button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(appt)} title="Cancel (local)"><i className="fas fa-times"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="text-center py-4 text-muted">{loading ? "Loading…" : `No ${activeTab} appointments found.`}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===== View Details Modal (scrollable + wrap) ===== */}
      {selectedAppointment && (
        <div className={`modal fade ${showViewModal ? "show" : ""}`} style={{ display: showViewModal ? "block" : "none" }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Appointment Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body modal-body--scroll">
                {/* Meta */}
                <h6>Meta</h6>
                <div className="row g-2 mb-2">
                  <div className="col-12 col-sm-6 col-md-4"><Info label="Appointment ID" value={selectedAppointment.appointmentId} mono /></div>
                  <div className="col-12 col-sm-6 col-md-4"><Info label="Created At" value={selectedAppointment.createdAt ? `${formatDate(selectedAppointment.createdAt)} ${formatTime(selectedAppointment.createdAt)}` : "—"} /></div>
                  <div className="col-12 col-sm-6 col-md-4"><Info label="Updated At" value={selectedAppointment.updatedAt ? `${formatDate(selectedAppointment.updatedAt)} ${formatTime(selectedAppointment.updatedAt)}` : "—"} /></div>
                </div>

                {/* Status/Reason/Type/Payment */}
                <div className="row g-2">
                  <div className="col-12 col-sm-6 col-md-3">
                    <div className="kv">
                      <span className={`badge ${selectedAppointment.status === "Upcoming" ? "bg-warning text-dark" : selectedAppointment.status === "Completed" ? "bg-success" : "bg-danger"}`}>{selectedAppointment.status}</span>
                      <div className="lbl mt-1">Raw: {selectedAppointment.statusRaw || "—"}</div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-md-5"><Info label="Reason" value={selectedAppointment.reason || "—"} /></div>
                  <div className="col-12 col-sm-6 col-md-2"><Info label="Type" value={selectedAppointment.type} /></div>
                  <div className="col-12 col-sm-6 col-md-2"><Info label="Payment" value={selectedAppointment.payment} /></div>
                </div>

                {/* Schedule */}
                <h6 className="mt-3">Schedule</h6>
                <div className="row g-2">
                  <div className="col-6 col-md-3"><Info label="Appointment Date" value={selectedAppointment.apptDateISO ? formatDate(selectedAppointment.apptDateISO) : "—"} /></div>
                  <div className="col-6 col-md-3"><Info label="Appointment Time" value={selectedAppointment.apptTimeText || "—"} /></div>
                  <div className="col-6 col-md-3"><Info label="Slot Date" value={selectedAppointment.slotDateISO ? formatDate(selectedAppointment.slotDateISO) : "—"} /></div>
                  <div className="col-6 col-md-3"><Info label="Slot Time" value={`${selectedAppointment.slotStart || "—"}${selectedAppointment.slotEnd ? ` – ${selectedAppointment.slotEnd}` : ""}`} /></div>
                </div>
                <div className="row g-2 mt-2">
                  <div className="col-6 col-md-3"><Info label="Slot Type" value={selectedAppointment.slotType || "—"} /></div>
                  <div className="col-6 col-md-3"><Info label="Slot ID" value={selectedAppointment.slotId || "—"} mono /></div>
                  <div className="col-6 col-md-3"><Info label="Is Booked" value={selectedAppointment.slotBooked === null ? "—" : (selectedAppointment.slotBooked ? "Yes" : "No")} /></div>
                  <div className="col-6 col-md-3"><Info label="Booked By" value={selectedAppointment.slotBookedBy || "—"} /></div>
                </div>

                {/* Patient */}
                <h6 className="mt-3">Patient</h6>
                <div className="row g-2">
                  <div className="col-12 col-md-4"><Info label="Patient ID" value={selectedAppointment.patient.id || "—"} mono /></div>
                  <div className="col-6 col-md-4"><Info label="Name" value={selectedAppointment.patient.name || "—"} /></div>
                  <div className="col-6 col-md-4"><Info label="Email" value={selectedAppointment.patient.email || "—"} /></div>
                </div>

                {/* Doctor */}
                <h6 className="mt-3">Doctor</h6>
                <div className="row g-2">
                  <div className="col-12 col-md-6">
                    <div className="kv d-flex align-items-center gap-2">
                      <div className="avatar-48">
                        {selectedAppointment.doctor.profile
                          ? <img alt="profile" src={selectedAppointment.doctor.profile} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : <div className="d-flex w-100 h-100 align-items-center justify-content-center"><i className="fas fa-user-md"></i></div>}
                      </div>
                      <div>
                        <div className="val">{selectedAppointment.doctor.name}</div>
                        <div className="lbl">{selectedAppointment.doctor.email || "—"}</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3"><Info label="Specialty" value={selectedAppointment.specialty} /></div>
                  <div className="col-6 col-md-3"><Info label="Doctor ID" value={selectedAppointment.doctor.id || "—"} mono /></div>
                </div>

                <div className="row g-2 mt-2">
                  <div className="col-6 col-md-3"><Info label="Experience" value={selectedAppointment.doctor.experience || "—"} /></div>
                  <div className="col-6 col-md-3"><Info label="Fee" value={toMoney(selectedAppointment.doctor.fee)} /></div>
                  <div className="col-6 col-md-3"><Info label="Opens" value={selectedAppointment.doctor.openingTime || "—"} /></div>
                  <div className="col-6 col-md-3"><Info label="Closes" value={selectedAppointment.doctor.closingTime || "—"} /></div>
                </div>

                <div className="row g-2 mt-2">
                  <div className="col-6 col-md-3"><Info label="Available Days" value={selectedAppointment.doctor.availableDay || "—"} /></div>
                  <div className="col-6 col-md-3"><Info label="Gender" value={selectedAppointment.doctor.gender || "—"} /></div>
                  <div className="col-6 col-md-3">
                    <div className="kv">
                      <span className={`badge ${selectedAppointment.doctor.isVerify ? "bg-success" : "bg-secondary"}`}>
                        {selectedAppointment.doctor.isVerify ? "Verified" : "Not Verified"}
                      </span>
                      <div className="lbl mt-1">Verification</div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3"><Info label="License No" value={selectedAppointment.doctor.licenseNo || "—"} mono /></div>
                </div>

                <div className="row g-2 mt-2">
                  <div className="col-12">
                    <div className="kv">
                      <div className="val">
                        {selectedAppointment.doctor.documents
                          ? <a href={selectedAppointment.doctor.documents} target="_blank" rel="noreferrer">Open Documents</a>
                          : "—"}
                      </div>
                      <div className="lbl">Documents</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {selectedAppointment && (
        <div className={`modal fade ${showEditModal ? "show" : ""}`} style={{ display: showEditModal ? "block" : "none" }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Appointment</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input type="text" className="form-control" value={selectedAppointment.date}
                      onChange={(e) => setSelectedAppointment({ ...selectedAppointment, date: e.target.value })}/>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Time</label>
                    <input type="text" className="form-control" value={selectedAppointment.time}
                      onChange={(e) => setSelectedAppointment({ ...selectedAppointment, time: e.target.value })}/>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Doctor</label>
                    <input type="text" className="form-control" value={selectedAppointment.doctorName}
                      onChange={(e) => setSelectedAppointment({ ...selectedAppointment, doctorName: e.target.value })}/>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Specialty</label>
                    <input type="text" className="form-control" value={selectedAppointment.specialty}
                      onChange={(e) => setSelectedAppointment({ ...selectedAppointment, specialty: e.target.value })}/>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Type</label>
                    <select className="form-select" value={selectedAppointment.type}
                      onChange={(e) => setSelectedAppointment({ ...selectedAppointment, type: e.target.value })}>
                      <option value="Video Call">Video Call</option>
                      <option value="In-Person">In-Person</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Close</button>
                <button type="button" className="btn" onClick={handleEditSave} style={{ backgroundColor: "#f9591a", color: "white" }}>
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {selectedAppointment && (
        <div className={`modal fade ${showDeleteModal ? "show" : ""}`} style={{ display: showDeleteModal ? "block" : "none" }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cancel Appointment</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to cancel your appointment with {selectedAppointment.doctorName} on {selectedAppointment.date} at {selectedAppointment.time}?</p>
                <p className="text-danger">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Keep Appointment</button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm}>Yes, Cancel Appointment</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {(showEditModal || showDeleteModal || showViewModal) && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default MyAppointments;