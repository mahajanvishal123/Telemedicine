import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './MyAppointments.css'; 

const MyAppointments = () => {
  const [activeTab, setActiveTab] = useState('all');

  const appointments = [
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
  ];

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

  return (
    <div className="my-appointments-container p-3 p-md-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div>
          <h2 className="mb-1">My Appointments</h2>
          <p className="text-muted mb-0">Manage your healthcare appointments and consultations</p>
        </div>

      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4 ">
        {stats.map((stat, index) => (
          <div key={index} className="col-12 col-md-3 ">
            <div className="stats-card d-flex align-items-center p-3 border">
              <div className={`stats-icon ${stat.color}`}>
                <i className={`fas fa-${stat.icon}`}></i>
              </div>
              <div className="ms-3">
                <h6 className="mb-0">{stat.value}</h6>
                <small>{stat.label}</small>
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
        <div className="card-header bg-orange text-white rounded-top py-4">
          <h5 className="mb-0">
            <i className="fas fa-calendar-alt me-2"></i>
            Appointment Schedule
          </h5>
          <p className="small mb-0 opacity-90">Manage your healthcare appointments</p>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
            <thead className="bg-light" style={{ height: '60px' }}>
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
                          <div className="stats-icon upcoming me-2">
                            <i className="fas fa-user-md"></i>
                          </div>
                          <div>
                            <div className="doctor-name">{appt.doctor}</div>
                            <div className="doctor-type">{appt.type}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark">{appt.specialty}</span>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            appt.status === 'Upcoming'
                              ? 'status-upcoming'
                              : appt.status === 'Completed'
                              ? 'status-completed'
                              : 'status-cancelled'
                          }`}
                        >
                          {appt.status}
                        </span>
                      </td>
                      <td>
                        <span className="status-badge payment-paid">{appt.payment}</span>
                      </td>
                      <td>
                        <button className="actions-btn btn-video">
                          <i className="fas fa-video"></i>
                        </button>
                        <button className="actions-btn btn-edit">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="actions-btn btn-cancel">
                          <i className="fas fa-times"></i>
                        </button>
                        <button className="actions-btn btn-more">
                          <i className="fas fa-ellipsis-v"></i>
                        </button>
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
    </div>
  );
};

export default MyAppointments;