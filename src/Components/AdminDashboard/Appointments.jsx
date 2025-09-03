import React, { useState } from 'react';

const Appointments = () => {
  // State for filters
  const [filters, setFilters] = useState({
    date: '',
    status: 'all'
  });

  // State for modals
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  // Sample appointments data
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: 'John Doe',
      patientEmail: 'john.doe@example.com',
      patientPhone: '555-1234',
      patientAge: 45,
      doctorName: 'Dr. Sarah Wilson',
      doctorSpecialty: 'Cardiology',
      date: '2023-11-15',
      time: '10:00 AM',
      status: 'confirmed',
      type: 'Follow-up',
      reason: 'Routine checkup',
      notes: 'Patient has history of hypertension'
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      patientEmail: 'jane.smith@example.com',
      patientPhone: '555-5678',
      patientAge: 32,
      doctorName: 'Dr. James Miller',
      doctorSpecialty: 'Orthopedics',
      date: '2023-11-15',
      time: '2:30 PM',
      status: 'pending',
      type: 'Consultation',
      reason: 'Back pain',
      notes: 'New patient, referred by Dr. Adams'
    },
    {
      id: 3,
      patientName: 'Robert Brown',
      patientEmail: 'robert.brown@example.com',
      patientPhone: '555-9012',
      patientAge: 28,
      doctorName: 'Dr. Lisa Taylor',
      doctorSpecialty: 'Dermatology',
      date: '2023-11-16',
      time: '9:15 AM',
      status: 'confirmed',
      type: 'New Patient',
      reason: 'Skin examination',
      notes: 'Concern about mole on left arm'
    },
    {
      id: 4,
      patientName: 'Emily Johnson',
      patientEmail: 'emily.johnson@example.com',
      patientPhone: '555-3456',
      patientAge: 52,
      doctorName: 'Dr. David Clark',
      doctorSpecialty: 'Surgery',
      date: '2023-11-16',
      time: '4:00 PM',
      status: 'cancelled',
      type: 'Follow-up',
      reason: 'Post-surgery check',
      notes: 'Appointment cancelled by patient'
    },
    {
      id: 5,
      patientName: 'Michael Davis',
      patientEmail: 'michael.davis@example.com',
      patientPhone: '555-7890',
      patientAge: 38,
      doctorName: 'Dr. Sarah Wilson',
      doctorSpecialty: 'Cardiology',
      date: '2023-11-17',
      time: '11:45 AM',
      status: 'completed',
      type: 'Consultation',
      reason: 'Medication review',
      notes: 'Patient responding well to new medication'
    },
    {
      id: 6,
      patientName: 'Sarah Wilson',
      patientEmail: 'sarah.wilson@example.com',
      patientPhone: '555-2345',
      patientAge: 29,
      doctorName: 'Dr. James Miller',
      doctorSpecialty: 'Orthopedics',
      date: '2023-11-17',
      time: '3:30 PM',
      status: 'confirmed',
      type: 'Vaccination',
      reason: 'Flu shot',
      notes: 'Annual flu vaccination'
    }
  ]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filter appointments based on selected filters
  const filteredAppointments = appointments.filter(appointment => {
    const matchesDate = filters.date ? appointment.date === filters.date : true;
    const matchesStatus = filters.status === 'all' ? true : appointment.status === filters.status;
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
      case 'New Patient':
        return 'bg-info';
      case 'Follow-up':
        return 'bg-primary';
      case 'Consultation':
        return 'bg-secondary';
      case 'Vaccination':
        return 'bg-success';
      default:
        return 'bg-light text-dark';
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

  // Handle rescheduling an appointment
  const handleReschedule = () => {
    if (!rescheduleDate || !rescheduleTime) {
      alert('Please select both date and time');
      return;
    }

    setAppointments(prevAppointments =>
      prevAppointments.map(app =>
        app.id === selectedAppointment.id
          ? { ...app, date: rescheduleDate, time: rescheduleTime }
          : app
      )
    );

    setShowRescheduleModal(false);
    alert('Appointment rescheduled successfully!');
  };

  // Handle canceling an appointment
  const handleCancel = () => {
    setAppointments(prevAppointments =>
      prevAppointments.map(app =>
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

  return (
    <div className="">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center">
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
                <strong>Total appointments:</strong> {appointments.length} | <strong>Filtered:</strong> {filteredAppointments.length}
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
              <div className="mt-3">
                <button
                  className="btn me-2"
                  style={{ backgroundColor: '#F95918', color: 'white' }}
                  onClick={() => setFilters({ date: '', status: 'all' })}
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
              {filteredAppointments.length === 0 ? (
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
                      {filteredAppointments.map(appointment => {
                        const statusInfo = getStatusInfo(appointment.status);
                        return (
                          <tr key={appointment.id}>
                            <td>#{appointment.id}</td>
                            <td>
                              <strong>{appointment.patientName}</strong>
                            </td>
                            <td>{appointment.doctorName}</td>
                            <td>
                              <div>{appointment.date}</div>
                              <small className="text-muted">{appointment.time}</small>
                            </td>
                            <td>
                              <span className={`badge ${getTypeClass(appointment.type)}`}>
                                {appointment.type}
                              </span>
                            </td>
                            <td>
                              <small>{appointment.reason}</small>
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
                                  onClick={() => openDetailModal(appointment)}
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  title="Reschedule"
                                  onClick={() => openRescheduleModal(appointment)}
                                  disabled={appointment.status === 'cancelled' || appointment.status === 'completed'}
                                >
                                  <i className="fas fa-calendar-alt"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  title="Cancel Appointment"
                                  onClick={() => openCancelModal(appointment)}
                                  disabled={appointment.status === 'cancelled' || appointment.status === 'completed'}
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
              backgroundColor: "#e3f2fd", // light blue
              color: "#0d47a1",
              textAlign: "center",
              borderRadius: "12px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              padding: "15px",
              height: "100%",
            }}
          >
            <h6 style={{ fontWeight: "600" }}>Total</h6>
            <h4 style={{ fontWeight: "700" }}>{appointments.length}</h4>
            <small>Appointments</small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-3 mb-3">
          <div
            style={{
              backgroundColor: "#e8f5e9", // light green
              color: "#1b5e20",
              textAlign: "center",
              borderRadius: "12px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              padding: "15px",
              height: "100%",
            }}
          >
            <h6 style={{ fontWeight: "600" }}>Confirmed</h6>
            <h4 style={{ fontWeight: "700" }}>
              {appointments.filter((a) => a.status === "confirmed").length}
            </h4>
            <small>Appointments</small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-3 mb-3">
          <div
            style={{
              backgroundColor: "#fffde7", // light yellow
              color: "#f57f17",
              textAlign: "center",
              borderRadius: "12px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              padding: "15px",
              height: "100%",
            }}
          >
            <h6 style={{ fontWeight: "600" }}>Pending</h6>
            <h4 style={{ fontWeight: "700" }}>
              {appointments.filter((a) => a.status === "pending").length}
            </h4>
            <small>Appointments</small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-3 mb-3">
          <div
            style={{
              backgroundColor: "#ffebee", // light red/pink
              color: "#b71c1c",
              textAlign: "center",
              borderRadius: "12px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              padding: "15px",
              height: "100%",
            }}
          >
            <h6 style={{ fontWeight: "600" }}>Cancelled</h6>
            <h4 style={{ fontWeight: "700" }}>
              {appointments.filter((a) => a.status === "cancelled").length}
            </h4>
            <small>Appointments</small>
          </div>
        </div>
      </div>


      {/* Detail Modal */}
      {showDetailModal && selectedAppointment && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header" >
                <h5 className="modal-title">Appointment Details</h5>
                <button type="button" className="btn-close" onClick={closeModals}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="text-muted">Patient Information</h6>
                    <p><strong>Name:</strong> {selectedAppointment.patientName}</p>
                    <p><strong>Email:</strong> {selectedAppointment.patientEmail}</p>
                    <p><strong>Phone:</strong> {selectedAppointment.patientPhone}</p>
                    <p><strong>Age:</strong> {selectedAppointment.patientAge}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted">Doctor Information</h6>
                    <p><strong>Name:</strong> {selectedAppointment.doctorName}</p>
                    <p><strong>Specialty:</strong> {selectedAppointment.doctorSpecialty}</p>
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
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted">Reason & Notes</h6>
                    <p><strong>Reason:</strong> {selectedAppointment.reason}</p>
                    <p><strong>Notes:</strong> {selectedAppointment.notes}</p>
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
                  className="btn btn"
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