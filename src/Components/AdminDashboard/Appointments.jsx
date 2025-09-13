import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Base_Url from '../../Baseurl/Baseurl';

const Appointments = () => {
  // States
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    date: '',
    status: 'all'
  });

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  // Fetch appointments on mount
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${Base_Url}/appointment/`);
        if (!Array.isArray(response.data)) {
          throw new Error("Invalid response format");
        }

        const transformedAppointments = response.data.map(app => ({
          id: app._id,
          patientName: app.patientId?.name || 'Unknown',
          patientEmail: app.patientId?.email || '',
          patientPhone: '', // Not available — could be fetched from /patients later
          patientAge: '',  // Not available — could be fetched from /patients later
          doctorName: app.doctorId?.name || 'Not Assigned',
          doctorSpecialty: app.doctorId?.specialty || '',
          date: new Date(app.appointmentDate).toLocaleDateString(),
          time: app.appointmentTime,
          status: mapStatus(app.status),
          type: determineType(app.reason),
          reason: app.reason,
          notes: app.reason, // or use a separate field if exists
          duration: app.duration,
          slots: app.slots,
          createdAt: new Date(app.createdAt).toLocaleString(),
          updatedAt: new Date(app.updatedAt).toLocaleString()
        }));

        setAppointments(transformedAppointments);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError(err.response?.data?.message || "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Map API status to UI status
  const mapStatus = (status) => {
    switch (status.toLowerCase()) {
      case 'scheduled': return 'confirmed';
      case 'cancelled': return 'cancelled';
      case 'completed': return 'completed';
      default: return status;
    }
  };

  // Determine appointment type based on reason
  const determineType = (reason) => {
    if (reason.toLowerCase().includes('checkup') || reason.toLowerCase().includes('health')) return 'Consultation';
    if (reason.toLowerCase().includes('follow-up')) return 'Follow-up';
    if (reason.toLowerCase().includes('vaccination')) return 'Vaccination';
    if (reason.toLowerCase().includes('new')) return 'New Patient';
    return 'Other';
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Filter appointments
  const filteredAppointments = appointments.filter(app => {
    const matchesDate = filters.date ? app.date === filters.date : true;
    const matchesStatus = filters.status === 'all' ? true : app.status === filters.status;
    return matchesDate && matchesStatus;
  });

  // Get status badge class and text
  const getStatusInfo = (status) => {
    switch (status) {
      case 'confirmed':
        return { class: 'bg-primary', text: 'Confirmed' };
      case 'pending':
        return { class: 'bg-warning text-dark', text: 'Pending' };
      case 'completed':
        return { class: 'bg-success', text: 'Completed' };
      case 'cancelled':
        return { class: 'bg-danger', text: 'Cancelled' };
      default:
        return { class: 'bg-secondary', text: status };
    }
  };

  // Get type badge class
  const getTypeClass = (type) => {
    switch (type) {
      case 'New Patient': return 'bg-info';
      case 'Follow-up': return 'bg-primary';
      case 'Consultation': return 'bg-secondary';
      case 'Vaccination': return 'bg-success';
      default: return 'bg-light text-dark';
    }
  };

  // Open detail modal
  const openDetailModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailModal(true);
  };

  // Open reschedule modal
  const openRescheduleModal = (appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleDate(appointment.date);
    setRescheduleTime(appointment.time);
    setShowRescheduleModal(true);
  };

  // Open cancel modal
  const openCancelModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  // Handle rescheduling
  const handleReschedule = () => {
    if (!rescheduleDate || !rescheduleTime) {
      alert('Please select both date and time');
      return;
    }

    setAppointments(prev =>
      prev.map(app =>
        app.id === selectedAppointment.id
          ? { ...app, date: rescheduleDate, time: rescheduleTime }
          : app
      )
    );

    setShowRescheduleModal(false);
    alert('Appointment rescheduled successfully!');
  };

  // Handle canceling
  const handleCancel = () => {
    setAppointments(prev =>
      prev.map(app =>
        app.id === selectedAppointment.id
          ? { ...app, status: 'cancelled' }
          : app
      )
    );

    setShowCancelModal(false);
    alert('Appointment cancelled successfully!');
  };

  // Close all modals
  const closeModals = () => {
    setShowDetailModal(false);
    setShowRescheduleModal(false);
    setShowCancelModal(false);
    setSelectedAppointment(null);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({ date: '', status: 'all' });
  };

  // Stats
  const totalAppointments = appointments.length;
  const confirmed = appointments.filter(a => a.status === 'confirmed').length;
  const pending = appointments.filter(a => a.status === 'pending').length;
  const completed = appointments.filter(a => a.status === 'completed').length;
  const cancelled = appointments.filter(a => a.status === 'cancelled').length;

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="dashboard-heading">Appointments</h3>
      </div>

      {/* Info Card */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm" style={{ borderLeft: `4px solid #F95918` }}>
            <div className="card-body">
              <h5 className="card-title" style={{ color: '#F95918' }}>All Bookings</h5>
              <p className="card-text">
                View and manage all appointments on the platform. Use the filters below to find specific appointments by date or status.
              </p>
              <p className="card-text mb-0">
                <strong>Total appointments:</strong> {totalAppointments} | <strong>Filtered:</strong> {filteredAppointments.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header">
              <h6 className="mb-0">Filter Appointments</h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="dateFilter">Filter by Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="dateFilter"
                      name="date"
                      value={filters.date}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="statusFilter">Filter by Status</label>
                    <select
                      className="form-control"
                      id="statusFilter"
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                    >
                      <option value="all">All Statuses</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-3 d-flex justify-content-between align-items-center">
                <button
                  className="btn me-2"
                  style={{ backgroundColor: '#F95918', color: 'white' }}
                  onClick={resetFilters}
                >
                  <i className="fas fa-sync me-1"></i> Reset Filters
                </button>
                <span className="text-muted">
                  {filters.date && `Date: ${filters.date} | `}
                  {filters.status !== 'all' && `Status: ${filters.status}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Appointments List</h5>
              <span className="badge bg-light text-dark">{filteredAppointments.length} appointments</span>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="alert alert-danger text-center">
                  {error}
                </div>
              ) : filteredAppointments.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                  <h5>No appointments found</h5>
                  <p className="text-muted">Try adjusting your filters to see more results.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover" width="100%" cellSpacing="0">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Date & Time</th>
                        <th>Type</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAppointments.map(app => {
                        const statusInfo = getStatusInfo(app.status);
                        return (
                          <tr key={app.id}>
                            <td>#{app.id}</td>
                            <td>
                              <strong>{app.patientName}</strong>
                            </td>
                            <td>{app.doctorName}</td>
                            <td>
                              <div>{app.date}</div>
                              <small className="text-muted">{app.time}</small>
                            </td>
                            <td>
                              <span className={`badge ${getTypeClass(app.type)}`}>
                                {app.type}
                              </span>
                            </td>
                            <td>
                              <small>{app.reason}</small>
                            </td>
                            <td>
                              <span className={`badge ${statusInfo.class}`}>
                                {statusInfo.text}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  title="View Details"
                                  onClick={() => openDetailModal(app)}
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  title="Reschedule"
                                  onClick={() => openRescheduleModal(app)}
                                  disabled={app.status === 'cancelled' || app.status === 'completed'}
                                >
                                  <i className="fas fa-calendar-alt"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  title="Cancel Appointment"
                                  onClick={() => openCancelModal(app)}
                                  disabled={app.status === 'cancelled' || app.status === 'completed'}
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="row mt-4">
        <div className="col-12 col-sm-6 col-md-3 mb-3">
          <div
            style={{
              backgroundColor: "#e3f2fd",
              color: "#0d47a1",
              textAlign: "center",
              borderRadius: "12px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              padding: "15px",
              height: "100%",
            }}
          >
            <h6 style={{ fontWeight: "600" }}>Total</h6>
            <h4 style={{ fontWeight: "700" }}>{totalAppointments}</h4>
            <small>Appointments</small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-3 mb-3">
          <div
            style={{
              backgroundColor: "#e8f5e9",
              color: "#1b5e20",
              textAlign: "center",
              borderRadius: "12px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              padding: "15px",
              height: "100%",
            }}
          >
            <h6 style={{ fontWeight: "600" }}>Confirmed</h6>
            <h4 style={{ fontWeight: "700" }}>{confirmed}</h4>
            <small>Appointments</small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-3 mb-3">
          <div
            style={{
              backgroundColor: "#fffde7",
              color: "#f57f17",
              textAlign: "center",
              borderRadius: "12px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              padding: "15px",
              height: "100%",
            }}
          >
            <h6 style={{ fontWeight: "600" }}>Pending</h6>
            <h4 style={{ fontWeight: "700" }}>{pending}</h4>
            <small>Appointments</small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-3 mb-3">
          <div
            style={{
              backgroundColor: "#ffebee",
              color: "#b71c1c",
              textAlign: "center",
              borderRadius: "12px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              padding: "15px",
              height: "100%",
            }}
          >
            <h6 style={{ fontWeight: "600" }}>Cancelled</h6>
            <h4 style={{ fontWeight: "700" }}>{cancelled}</h4>
            <small>Appointments</small>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedAppointment && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Appointment Details</h5>
                <button type="button" className="btn-close" onClick={closeModals}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="text-muted">Patient Information</h6>
                    <p><strong>Name:</strong> {selectedAppointment.patientName}</p>
                    <p><strong>Email:</strong> {selectedAppointment.patientEmail}</p>
                    <p><strong>Phone:</strong> {selectedAppointment.patientPhone || 'N/A'}</p>
                    <p><strong>Age:</strong> {selectedAppointment.patientAge || 'N/A'}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted">Doctor Information</h6>
                    <p><strong>Name:</strong> {selectedAppointment.doctorName}</p>
                    <p><strong>Specialty:</strong> {selectedAppointment.doctorSpecialty || 'N/A'}</p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="text-muted">Appointment Details</h6>
                    <p><strong>Date:</strong> {selectedAppointment.date}</p>
                    <p><strong>Time:</strong> {selectedAppointment.time}</p>
                    <p><strong>Type:</strong> <span className={`badge ${getTypeClass(selectedAppointment.type)}`}>{selectedAppointment.type}</span></p>
                    <p><strong>Status:</strong> <span className={`badge ${getStatusInfo(selectedAppointment.status).class}`}>
                      {getStatusInfo(selectedAppointment.status).text}
                    </span></p>
                    <p><strong>Duration:</strong> {selectedAppointment.duration} min</p>
                    <p><strong>Slots:</strong> {selectedAppointment.slots}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted">Reason & Notes</h6>
                    <p><strong>Reason:</strong> {selectedAppointment.reason}</p>
                    <p><strong>Created At:</strong> {selectedAppointment.createdAt}</p>
                    <p><strong>Updated At:</strong> {selectedAppointment.updatedAt}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModals}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppointment && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reschedule Appointment</h5>
                <button type="button" className="btn-close" onClick={closeModals}></button>
              </div>
              <div className="modal-body">
                <p>Reschedule appointment for <strong>{selectedAppointment.patientName}</strong> with <strong>{selectedAppointment.doctorName}</strong></p>
                <div className="mb-3">
                  <label htmlFor="rescheduleDate" className="form-label">New Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="rescheduleDate"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="rescheduleTime" className="form-label">New Time</label>
                  <input
                    type="time"
                    className="form-control"
                    id="rescheduleTime"
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModals}>Cancel</button>
                <button
                  type="button"
                  className="btn"
                  style={{ backgroundColor: '#F95918', color: 'white' }}
                  onClick={handleReschedule}
                >
                  Confirm Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && selectedAppointment && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cancel Appointment</h5>
                <button type="button" className="btn-close" onClick={closeModals}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to cancel the appointment for <strong>{selectedAppointment.patientName}</strong> with <strong>{selectedAppointment.doctorName}</strong>?</p>
                <p><strong>Date:</strong> {selectedAppointment.date} at {selectedAppointment.time}</p>
                <p><strong>Reason:</strong> {selectedAppointment.reason}</p>
                <div className="form-group">
                  <label htmlFor="cancelReason" className="form-label">Cancellation Reason (optional)</label>
                  <textarea className="form-control" id="cancelReason" rows="3"></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModals}>No, Keep Appointment</button>
                <button
                  type="button"
                  className="btn"
                  onClick={handleCancel}
                  style={{ backgroundColor: '#F95918', color: 'white' }}
                >
                  Yes, Cancel Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;