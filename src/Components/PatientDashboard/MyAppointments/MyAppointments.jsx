import React, { useState, useEffect } from "react";
import API_URL from "../../../Baseurl/Baseurl"; // Adjust path as needed
import "./MyAppointments.css";

const MyAppointments = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // ✅ Dynamic Data from API — NO HARDCODING
  const [appointments, setAppointments] = useState([]);
  const [summary, setSummary] = useState({ total: 0, confirmed: 0, pending: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Get doctorId from localStorage (you said use user._id — so we use it as doctorId)
  const storedUser = localStorage.getItem('user');
  let doctorId = null;

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      doctorId = user?._id || null; // 👈 You said don't change — so we use user._id as doctorId
    } catch (e) {
      console.error("Failed to parse user", e);
    }
  }

  // ✅ Fetch appointments on mount — using your endpoint: /appointment?doctorId=...
  useEffect(() => {
    if (!doctorId) {
      setError("Doctor ID not found");
      setLoading(false);
      return;
    }

    const fetchAppointments = async () => {
      try {
        // 🔥 EXACTLY AS YOU SAID — USING doctorId ENDPOINT
        const response = await fetch(`${API_URL}/appointment?doctorId=${doctorId}`);
        if (!response.ok) throw new Error('Failed to fetch appointments');
        const result = await response.json();

        if (result.appointments) {
          setAppointments(result.appointments);
          setSummary(result.summary || { total: 0, confirmed: 0, pending: 0, cancelled: 0 });
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  // ✅ Format status as per your UI (Upcoming/Completed/Cancelled)
  const formatStatus = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'pending':
        return 'Upcoming';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Pending';
    }
  };

  // ✅ Format payment based on status
  const formatPayment = (status) => {
    return status === 'cancelled' ? 'Refunded' : 'Paid';
  };

  // ✅ Filter appointments based on active tab
  const filteredAppointments = appointments.filter((appt) => {
    if (activeTab === "all") return true;
    return formatStatus(appt.status).toLowerCase() === activeTab;
  });

  // ✅ Stats from API summary (as per your response structure)
  const stats = [
    { label: "Total Appointments", value: summary.total || 0, icon: "calendar", color: "total" },
    { label: "Upcoming", value: summary.confirmed + summary.pending || 0, icon: "clock", color: "upcoming" },
    { label: "Completed", value: summary.completed || 0, icon: "check-circle", color: "completed" },
    { label: "Cancelled", value: summary.cancelled || 0, icon: "times-circle", color: "cancelled" },
  ];

  const tabs = [
    { key: "all", label: "All Appointments", icon: "calendar-alt" },
    { key: "upcoming", label: "Upcoming", icon: "clock" },
    { key: "completed", label: "Completed", icon: "check" },
    { key: "cancelled", label: "Cancelled", icon: "times" },
  ];

  const handleEditClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowEditModal(true);
  };

  const handleDeleteClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDeleteModal(true);
  };

  const handleEditSave = () => {
    console.log("Saving changes for appointment:", selectedAppointment);
    setShowEditModal(false);
  };

  const handleDeleteConfirm = () => {
    setAppointments(appointments.filter((appt) => appt._id !== selectedAppointment._id));
    setShowDeleteModal(false);
  };

  // ✅ Loading State
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // ✅ Error State
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          <h5>⚠️ Error Loading Appointments</h5>
          <p>{error}</p>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div>
          <h3 className="dashboard-heading mb-1">My Appointments</h3>
          <p className="text-muted mb-0">
            Manage your healthcare appointments and consultations
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-12 col-md-3">
            <div
              className={`stats-card d-flex align-items-center p-3 rounded-3 shadow-sm bg-${stat.color} bg-opacity-10`}
            >
              <div
                className={`stats-icon d-flex align-items-center justify-content-center rounded-circle bg-${stat.color} text-white`}
                style={{ width: "50px", height: "50px", fontSize: "20px" }}
              >
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
          <button
            key={tab.key}
            className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <i className={`fas fa-${tab.icon}`}></i> {tab.label}
          </button>
        ))}
      </div>

      {/* Appointments Table */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white rounded-top py-3">
          <h5 className="mb-0">
            <i className="fas fa-calendar-alt me-2"></i>
            Appointment Schedule
          </h5>
          <p className="small mb-0 opacity-90">
            Manage your healthcare appointments
          </p>
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
                  <th className="py-4 align-middle">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appt) => (
                    <tr key={appt._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="date-box me-2">
                            <i className="fas fa-calendar"></i>
                          </span>
                          <div>
                            <strong>
                              {new Date(appt.appointmentDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </strong>
                            <br />
                            <small>{appt.appointmentTime}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div
                            className="doctor-avatar me-2 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: "40px", height: "40px" }}
                          >
                            <i className="fas fa-user-md"></i>
                          </div>
                          <div>
                            <div className="doctor-name">
                              {appt.doctorId?.name || 'Dr. Not Assigned'}
                            </div>
                            <div className="doctor-type small text-muted">
                              {appt.doctorId?.specialty || 'General'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark">
                          {appt.doctorId?.specialty || 'General'}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            formatStatus(appt.status) === "Upcoming"
                              ? "bg-warning text-dark"
                              : formatStatus(appt.status) === "Completed"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {formatStatus(appt.status)}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            formatPayment(appt.status) === "Paid" ? "bg-success" : "bg-info"
                          }`}
                        >
                          {formatPayment(appt.status)}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex">
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEditClick(appt)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteClick(appt)}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      No {activeTab} appointments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {selectedAppointment && (
        <div
          className={`modal fade ${showEditModal ? "show" : ""}`}
          style={{ display: showEditModal ? "block" : "none" }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Appointment</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={new Date(selectedAppointment.appointmentDate).toISOString().split('T')[0]}
                      onChange={(e) =>
                        setSelectedAppointment({
                          ...selectedAppointment,
                          appointmentDate: new Date(e.target.value).toISOString(),
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Time</label>
                    <input
                      type="time"
                      className="form-control"
                      value={selectedAppointment.appointmentTime}
                      onChange={(e) =>
                        setSelectedAppointment({
                          ...selectedAppointment,
                          appointmentTime: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Doctor</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedAppointment.doctorId?.name || ''}
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Specialty</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedAppointment.doctorId?.specialty || ''}
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Reason</label>
                    <textarea
                      className="form-control"
                      value={selectedAppointment.reason || ''}
                      onChange={(e) =>
                        setSelectedAppointment({
                          ...selectedAppointment,
                          reason: e.target.value,
                        })
                      }
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={handleEditSave}
                  style={{ backgroundColor: "#f9591a", color: "white" }}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {selectedAppointment && (
        <div
          className={`modal fade ${showDeleteModal ? "show" : ""}`}
          style={{ display: showDeleteModal ? "block" : "none" }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cancel Appointment</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to cancel your appointment with{" "}
                  {selectedAppointment.doctorId?.name} on{" "}
                  {new Date(selectedAppointment.appointmentDate).toLocaleDateString()} at{" "}
                  {selectedAppointment.appointmentTime}?
                </p>
                <p className="text-danger">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Keep Appointment
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteConfirm}
                >
                  Yes, Cancel Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for modals */}
      {(showEditModal || showDeleteModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default MyAppointments;