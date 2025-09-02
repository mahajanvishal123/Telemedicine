import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './MyAppointments.css';

const MyAppointments = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      date: 'Jan 20, 2024',
      time: '2:30 PM',
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      type: 'Video Call',
      status: 'Upcoming',
      payment: 'Paid',
    },
    {
      id: 2,
      date: 'Jan 18, 2024',
      time: '10:00 AM',
      doctor: 'Dr. Michael Chen',
      specialty: 'Neurologist',
      type: 'In-Person',
      status: 'Completed',
      payment: 'Paid',
    },
    {
      id: 3,
      date: 'Jan 15, 2024',
      time: '11:15 AM',
      doctor: 'Dr. Emily Davis',
      specialty: 'Dermatologist',
      type: 'Video Call',
      status: 'Cancelled',
      payment: 'Refunded',
    },
  ]);

  const stats = [
    { label: 'Total Appointments', value: 6, icon: 'calendar', color: 'total' },
    { label: 'Upcoming', value: 3, icon: 'clock', color: 'upcoming' },
    { label: 'Completed', value: 2, icon: 'check-circle', color: 'completed' },
    { label: 'Cancelled', value: 1, icon: 'times-circle', color: 'cancelled' },
  ];

  const tabs = [
    { key: 'all', label: 'All Appointments', icon: 'calendar-alt' },
    { key: 'upcoming', label: 'Upcoming', icon: 'clock' },
    { key: 'completed', label: 'Completed', icon: 'check' },
    { key: 'cancelled', label: 'Cancelled', icon: 'times' },
  ];

  const filteredAppointments = appointments.filter((appt) => {
    if (activeTab === 'all') return true;
    return appt.status.toLowerCase() === activeTab;
  });

  const handleEditClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowEditModal(true);
  };

  const handleDeleteClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDeleteModal(true);
  };

  const handleEditSave = () => {
    // In a real application, you would update the appointment in your state/API here
    console.log('Saving changes for appointment:', selectedAppointment);
    setShowEditModal(false);
  };

  const handleDeleteConfirm = () => {
    // Remove the appointment from the list
    setAppointments(appointments.filter(appt => appt.id !== selectedAppointment.id));
    setShowDeleteModal(false);
  };

  return (
    <div className="">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">My Appointments</h3>
          <p className="text-muted mb-0">Manage your healthcare appointments and consultations</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-12 col-md-3">
            <div className={`stats-card d-flex align-items-center p-3 rounded-3 shadow-sm bg-${stat.color} bg-opacity-10`}>
              <div
                className={`stats-icon d-flex align-items-center justify-content-center rounded-circle bg-${stat.color} text-white`}
                style={{ width: "50px", height: "50px", fontSize: "20px" }}
              >
                <i className={`fas fa-${stat.icon} bg-${stat.color}`}></i>
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
            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
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
          <p className="small mb-0 opacity-90">Manage your healthcare appointments</p>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="align-middle">Date & Time</th>
                  <th className="align-middle">Doctor</th>
                  <th className="align-middle">Specialty</th>
                  <th className="align-middle">Status</th>
                  <th className="align-middle">Payment</th>
                  <th className="align-middle">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appt) => (
                    <tr key={appt.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="date-box me-2">
                            <i className="fas fa-calendar"></i>
                          </span>
                          <div>
                            <strong>{appt.date}</strong>
                            <br />
                            <small>{appt.time}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="doctor-avatar me-2 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                            <i className="fas fa-user-md"></i>
                          </div>
                          <div>
                            <div className="doctor-name">{appt.doctor}</div>
                            <div className="doctor-type small text-muted">{appt.type}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark">{appt.specialty}</span>
                      </td>
                      <td>
                        <span
                          className={`badge ${appt.status === 'Upcoming'
                            ? 'bg-warning text-dark'
                            : appt.status === 'Completed'
                              ? 'bg-success'
                              : 'bg-danger'
                            }`}
                        >
                          {appt.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${appt.payment === 'Paid' ? 'bg-success' : 'bg-info'}`}>
                          {appt.payment}
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
        <div className={`modal fade ${showEditModal ? 'show' : ''}`} style={{ display: showEditModal ? 'block' : 'none' }} tabIndex="-1">
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
                    <input
                      type="text"
                      className="form-control"
                      value={selectedAppointment.date}
                      onChange={(e) => setSelectedAppointment({ ...selectedAppointment, date: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Time</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedAppointment.time}
                      onChange={(e) => setSelectedAppointment({ ...selectedAppointment, time: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Doctor</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedAppointment.doctor}
                      onChange={(e) => setSelectedAppointment({ ...selectedAppointment, doctor: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Specialty</label>
                    <select
                      className="form-select"
                      value={selectedAppointment.specialty}
                      onChange={(e) => setSelectedAppointment({ ...selectedAppointment, specialty: e.target.value })}
                    >
                      <option value="Cardiologist">Cardiologist</option>
                      <option value="Neurologist">Neurologist</option>
                      <option value="Dermatologist">Dermatologist</option>
                      <option value="Pediatrician">Pediatrician</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Appointment Type</label>
                    <select
                      className="form-select"
                      value={selectedAppointment.type}
                      onChange={(e) => setSelectedAppointment({ ...selectedAppointment, type: e.target.value })}
                    >
                      <option value="Video Call">Video Call</option>
                      <option value="In-Person">In-Person</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleEditSave}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {selectedAppointment && (
        <div className={`modal fade ${showDeleteModal ? 'show' : ''}`} style={{ display: showDeleteModal ? 'block' : 'none' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cancel Appointment</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to cancel your appointment with {selectedAppointment.doctor} on {selectedAppointment.date} at {selectedAppointment.time}?</p>
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

      {/* Backdrop for modals */}
      {(showEditModal || showDeleteModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default MyAppointments;