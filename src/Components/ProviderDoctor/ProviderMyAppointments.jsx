// src/pages/Provider/ProviderMyAppointments.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../Baseurl/Baseurl";

const ProviderMyAppointments = () => {
  const BASE_URL = API_URL;

  /* ===================== doctorId resolver (NO TOKEN, NO FIXED ID) ===================== */
  const safeJSON = (txt) => { try { return JSON.parse(txt); } catch { return null; } };

  // Try to pick an "id" from any object (supports nested)
  const pickId = (obj) => {
    if (!obj || typeof obj !== "object") return null;
    const keys = ["doctorId", "id", "_id", "userId", "uid", "sub"];
    for (const k of keys) if (obj[k]) return obj[k];
    for (const k of Object.keys(obj)) {
      const v = obj[k];
      if (v && typeof v === "object") {
        const nested = pickId(v);
        if (nested) return nested;
      }
    }
    return null;
  };

  const resolveDoctorId = () => {
    // 1) URL ?doctorId=
    try {
      const params = new URLSearchParams(window.location.search);
      const qid = params.get("doctorId");
      if (qid) return qid;
    } catch {}
    // 2) Direct storage keys
    const direct =
      localStorage.getItem("doctorId") ||
      sessionStorage.getItem("doctorId");
    if (direct) return direct;

    // 3) Common JSON blobs where doctor profile might be saved
    const jsonKeys = ["doctor", "profile", "auth", "currentUser", "loginUser", "user"];
    for (const store of [localStorage, sessionStorage]) {
      for (const key of jsonKeys) {
        const obj = safeJSON(store.getItem(key));
        // If an explicit doctor object: prefer its id
        if (obj && (obj.role === "doctor" || obj.type === "doctor")) {
          const did = pickId(obj);
          if (did) return did;
        }
        const id = pickId(obj);
        if (id) return id;
      }
    }
    return null;
  };

  const doctorId = resolveDoctorId();

  /* ===================== UI / API state ===================== */
  const [appointments, setAppointments] = useState([]);
  const [summary, setSummary] = useState({ total: 0, confirmed: 0, pending: 0, cancelled: 0 });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [showNotesModal, setShowNotesModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [notesText, setNotesText] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [filter, setFilter] = useState("all"); // all | pending | confirmed | cancelled | completed
  const [searchTerm, setSearchTerm] = useState("");
  const [buttonAnimations, setButtonAnimations] = useState({});

  /* ===================== helpers ===================== */
  const properCase = (s) =>
    typeof s === "string" && s.length
      ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
      : s;

  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return iso || "-";
    }
  };

  const mapApiAppointment = (a) => {
    const rawStatus = String(a?.status || "").toLowerCase();
    const status = properCase(rawStatus) || "Scheduled";
    const date = formatDate(a?.appointmentDate);
    const time = (a?.appointmentTime || "").trim();
    const patientName =
      (a?.patientId?.name || a?.patient?.name || "").trim() || "Unknown";
    const reason = (a?.reason || "").trim();

    // Your payload doesn't include payment info; keep a simple heuristic
    const paymentStatus = rawStatus === "completed" ? "Paid" : "Pending";

    return {
      id: a?._id || Date.now(),
      dateTime: time ? `${date} ${time}` : date,
      patientName,
      status,
      paymentStatus,
      notes: reason,
      _raw: a,
    };
  };

  /* ===================== GET: /appointment?doctorId=xxx ===================== */
  const fetchAppointments = async () => {
    if (!doctorId) {
      setApiError("Doctor ID not found. localStorage me 'doctorId' set karein ya URL me ?doctorId= pass karein.");
      return;
    }
    setLoading(true);
    setApiError(null);
    try {
      const res = await axios.get(`${BASE_URL}/appointment`, {
        params: { doctorId },
      });

      // Expecting: { summary: {...}, appointments: [...] }
      const payload = res?.data || {};
      const list = Array.isArray(payload?.appointments)
        ? payload.appointments
        : Array.isArray(payload?.data?.appointments)
        ? payload.data.appointments
        : Array.isArray(payload)
        ? payload
        : [];

      // Fallback compute summary if backend didn't send it
      const computeSummary = (items) => {
        const norm = (s) => String(s || "").toLowerCase();
        const total = items.length;
        const confirmed = items.filter((x) => norm(x.status) === "confirmed").length;
        const pending = items.filter((x) => norm(x.status) === "pending" || norm(x.status) === "scheduled").length;
        const cancelled = items.filter((x) => norm(x.status) === "cancelled").length;
        return { total, confirmed, pending, cancelled };
        };
      const apiSummary = payload?.summary || payload?.data?.summary || computeSummary(list);

      setSummary({
        total: Number(apiSummary.total || 0),
        confirmed: Number(apiSummary.confirmed || 0),
        pending: Number(apiSummary.pending || 0),
        cancelled: Number(apiSummary.cancelled || 0),
      });

      const mapped = list.map(mapApiAppointment);
      setAppointments(mapped);
    } catch (err) {
      console.error(err);
      setApiError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch appointments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ===================== filtering/search ===================== */
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesFilter =
      filter === "all" ||
      String(appointment.status).toLowerCase() === filter;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      appointment.patientName.toLowerCase().includes(q) ||
      appointment.dateTime.toLowerCase().includes(q) ||
      (appointment.notes || "").toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  /* ===================== actions ===================== */
  const handleStartCall = (appointment) => {
    setButtonAnimations((p) => ({ ...p, [`call-${appointment.id}`]: true }));
    setTimeout(() => {
      setButtonAnimations((p) => ({ ...p, [`call-${appointment.id}`]: false }));
      alert(`Starting call with ${appointment.patientName}`);
    }, 300);
  };

  // PUT: cancel (passes doctorId as query param)
  const handleCancel = async (appointmentId) => {
    if (!doctorId) return alert("Doctor ID missing.");
    const appt = appointments.find((a) => a.id === appointmentId);
    if (!appt) return;

    setButtonAnimations((p) => ({ ...p, [`cancel-${appointmentId}`]: true }));
    setTimeout(() => {
      setButtonAnimations((p) => ({ ...p, [`cancel-${appointmentId}`]: false }));
    }, 300);

    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      setCancellingId(appointmentId);
      const idForApi = appt._raw?._id || appointmentId;
      const res = await axios.put(
        `${BASE_URL}/appointment/${idForApi}`,
        { status: "cancelled" },
        { params: { doctorId }, headers: { "Content-Type": "application/json" } }
      );

      const updated = res?.data?.appointment || res?.data?.data || res?.data || null;
      if (updated) {
        const mapped = mapApiAppointment(updated);
        setAppointments((prev) => prev.map((a) => (a.id === appointmentId ? mapped : a)));
      } else {
        setAppointments((prev) => prev.map((a) => (a.id === appointmentId ? { ...a, status: "Cancelled" } : a)));
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || err?.message || "Failed to cancel appointment");
    } finally {
      setCancellingId(null);
    }
  };

  // Notes modal open
  const handleAddNotes = (appointment) => {
    setButtonAnimations((p) => ({ ...p, [`notes-${appointment.id}`]: true }));
    setTimeout(() => {
      setButtonAnimations((p) => ({ ...p, [`notes-${appointment.id}`]: false }));
      setCurrentAppointment(appointment);
      setNotesText(appointment.notes || "");
      setShowNotesModal(true);
    }, 300);
  };

  // PUT: save notes (passes doctorId as query param)
  const handleSaveNotes = async () => {
    if (!currentAppointment) return;
    if (!doctorId) return alert("Doctor ID missing.");
    try {
      setSavingNotes(true);
      const idForApi = currentAppointment._raw?._id || currentAppointment.id;
      const res = await axios.put(
        `${BASE_URL}/appointment/${idForApi}`,
        { reason: notesText },
        { params: { doctorId }, headers: { "Content-Type": "application/json" } }
      );
      const updated = res?.data?.appointment || res?.data?.data || res?.data || null;
      const mapped = updated ? mapApiAppointment(updated) : { ...currentAppointment, notes: notesText };
      setAppointments((prev) => prev.map((a) => (a.id === currentAppointment.id ? mapped : a)));
      setShowNotesModal(false);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || err?.message || "Failed to update appointment");
    } finally {
      setSavingNotes(false);
    }
  };

  // DELETE: permanently delete (passes doctorId as query param)
  const handleDelete = async (appointmentId) => {
    if (!doctorId) return alert("Doctor ID missing.");
    const appt = appointments.find((a) => a.id === appointmentId);
    if (!appt) return;

    if (!window.confirm("This will permanently delete the appointment. Continue?")) return;

    try {
      setDeletingId(appointmentId);
      const idForApi = appt._raw?._id || appointmentId;

      const res = await axios.delete(`${BASE_URL}/appointment/${idForApi}`, {
        params: { doctorId },
      });

      if (res?.status === 200 || res?.status === 204 || res?.data) {
        setAppointments((prev) => prev.filter((a) => a.id !== appointmentId));
      } else {
        setAppointments((prev) => prev.filter((a) => a.id !== appointmentId));
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || err?.message || "Failed to delete appointment");
    } finally {
      setDeletingId(null);
    }
  };

  /* ===================== badges ===================== */
  const getStatusBadge = (status) => {
    let className = "badge ";
    switch (status) {
      case "Confirmed":
        className += "bg-primary";
        break;
      case "Completed":
        className += "bg-success";
        break;
      case "Cancelled":
        className += "bg-danger";
        break;
      case "Pending":
      case "Scheduled":
        className += "bg-info text-dark";
        break;
      default:
        className += "bg-secondary";
    }
    return <span className={className}>{status}</span>;
  };

  const getPaymentBadge = (status) => {
    let className = "badge ";
    switch (status) {
      case "Paid":
        className += "bg-success";
        break;
      case "Pending":
        className += "bg-warning text-dark";
        break;
      default:
        className += "bg-secondary";
    }
    return <span className={className}>{status}</span>;
  };

  return (
    <div className="">
      <div className="">
        <div className="d-flex align-items-center gap-2">
          <h3 className="dashboard-heading mb-0">My Appointments</h3>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={fetchAppointments}
            title="Refresh"
            disabled={!doctorId}
          >
            <i className="fas fa-sync-alt me-1" />
            Refresh
          </button>
        </div>
        <p className="text-muted mb-4">
          Manage your patient appointments and consultations
        </p>
      </div>

      {!doctorId && (
        <div className="alert alert-warning">
          Doctor ID not found. URL me <code>?doctorId=YOUR_ID</code> pass karein ya{" "}
          <code>localStorage.setItem('doctorId','YOUR_ID')</code> set karein.
        </div>
      )}

      {loading && <div className="alert alert-info py-2">Loading appointments…</div>}

      {apiError && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{apiError}</span>
          <button className="btn btn-sm btn-light" onClick={fetchAppointments} disabled={!doctorId}>
            Retry
          </button>
        </div>
      )}

      {/* Summary strip */}
      <div className="row g-3 mb-3">
        {[
          { label: "Total", value: summary.total },
          { label: "Confirmed", value: summary.confirmed },
          { label: "Pending", value: summary.pending },
          { label: "Cancelled", value: summary.cancelled },
        ].map((s) => (
          <div key={s.label} className="col-6 col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small">{s.label}</div>
                  <div className="h5 mb-0">{s.value}</div>
                </div>
                <span className="badge bg-light text-dark">{s.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card shadow-lg border-0">
        <div className="card-body">
          {/* Search & Filters */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-transparent">
                  <i className="fas fa-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-6 mt-3">
              <div className="d-flex flex-wrap justify-content-md-end gap-2">
                <button
                  className={`btn btn-sm ${filter === "all" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>
                <button
                  className={`btn btn-sm ${filter === "pending" ? "btn-info text-white" : "btn-outline-info"}`}
                  onClick={() => setFilter("pending")}
                >
                  Pending
                </button>
                <button
                  className={`btn btn-sm ${filter === "confirmed" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => setFilter("confirmed")}
                >
                  Confirmed
                </button>
                <button
                  className={`btn btn-sm ${filter === "completed" ? "btn-success" : "btn-outline-success"}`}
                  onClick={() => setFilter("completed")}
                >
                  Completed
                </button>
                <button
                  className={`btn btn-sm ${filter === "cancelled" ? "btn-danger" : "btn-outline-danger"}`}
                  onClick={() => setFilter("cancelled")}
                >
                  Cancelled
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive rounded">
            <table className="table table-hover align-middle">
              <thead>
                <tr style={{ backgroundColor: "#F95918", color: "white" }}>
                  <th className="ps-4">
                    <i className="fas fa-clock me-1"></i>
                    Date/Time
                  </th>
                  <th>
                    <i className="fas fa-user me-1"></i>
                    Patient Name
                  </th>
                  <th>
                    <i className="fas fa-info-circle me-1"></i>
                    Status
                  </th>
                  <th>
                    <i className="fas fa-money-bill-wave me-1"></i>
                    Payment Status
                  </th>
                  <th className="text-center pe-4">
                    <i className="fas fa-cogs me-1"></i>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment, index) => (
                  <tr
                    key={appointment.id}
                    className="animate__animated animate__fadeIn"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <td className="ps-4">
                      <div className="d-flex align-items-center">
                        <i className="far fa-calendar-alt text-muted me-2"></i>
                        <span>{appointment.dateTime}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center me-2"
                          style={{
                            width: "36px",
                            height: "36px",
                            backgroundColor: "#F95918",
                            color: "white",
                          }}
                        >
                          {appointment.patientName.charAt(0).toUpperCase()}
                        </div>
                        <span>{appointment.patientName}</span>
                      </div>
                    </td>
                    <td>{getStatusBadge(appointment.status)}</td>
                    <td>{getPaymentBadge(appointment.paymentStatus)}</td>
                    <td className="pe-4">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className={`btn text-white btn-sm ${
                            buttonAnimations[`call-${appointment.id}`]
                              ? "animate__animated animate__pulse"
                              : ""
                          }`}
                          style={{ backgroundColor: "#F95918" }}
                          onClick={() => handleStartCall(appointment)}
                          disabled={
                            (!doctorId) ||
                            (appointment.status !== "Confirmed" &&
                             appointment.status !== "Scheduled" &&
                             appointment.status !== "Pending")
                          }
                        >
                          <i className="fas fa-video me-1"></i>
                          Start Call
                        </button>

                        {/* Cancel */}
                        <button
                          className={`btn btn-outline-danger btn-sm ${
                            buttonAnimations[`cancel-${appointment.id}`]
                              ? "animate__animated animate__shakeX"
                              : ""
                          }`}
                          onClick={() => handleCancel(appointment.id)}
                          disabled={cancellingId === appointment.id || !doctorId}
                          title="Cancel appointment"
                        >
                          {cancellingId === appointment.id ? (
                            <span className="spinner-border spinner-border-sm" />
                          ) : (
                            <i className="fas fa-times"></i>
                          )}
                        </button>

                        {/* Notes */}
                        <button
                          className={`btn btn-outline-secondary btn-sm ${
                            buttonAnimations[`notes-${appointment.id}`]
                              ? "animate__animated animate__rubberBand"
                              : ""
                          }`}
                          onClick={() => handleAddNotes(appointment)}
                          title="Edit notes"
                          disabled={!doctorId}
                        >
                          <i className="fas fa-edit"></i>
                        </button>

                        {/* Delete */}
                        <button
                          className="btn btn-outline-dark btn-sm"
                          onClick={() => handleDelete(appointment.id)}
                          disabled={deletingId === appointment.id || !doctorId}
                          title="Delete appointment permanently"
                        >
                          {deletingId === appointment.id ? (
                            <span className="spinner-border spinner-border-sm" />
                          ) : (
                            <i className="fas fa-trash"></i>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!loading && filteredAppointments.length === 0 && (
              <div className="text-center py-5">
                <i className="far fa-calendar-times display-4 text-muted mb-3"></i>
                <p className="text-muted">No appointments found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notes Modal */}
      <div className={`modal fade ${showNotesModal ? "show d-block" : ""}`} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="fas fa-edit me-2"></i>
                Consultation Notes
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowNotesModal(false)}
                disabled={savingNotes}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3 p-3 bg-light rounded">
                <p className="mb-1">
                  <strong>Patient:</strong>{" "}
                  {currentAppointment?.patientName || "-"}
                </p>
                <p className="mb-0">
                  <strong>Date/Time:</strong>{" "}
                  {currentAppointment?.dateTime || "-"}
                </p>
              </div>
              <textarea
                className="form-control"
                rows="5"
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Enter your notes about this consultation..."
                autoFocus
                disabled={savingNotes}
              ></textarea>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowNotesModal(false)}
                disabled={savingNotes}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn text-white"
                style={{ backgroundColor: "#F95918" }}
                onClick={handleSaveNotes}
                disabled={savingNotes || !doctorId}
              >
                {savingNotes ? "Saving..." : "Save Notes"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {showNotesModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default ProviderMyAppointments;
