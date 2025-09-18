import React, { useState, useEffect } from 'react';
import API_URL from "../../../Baseurl/Baseurl";

const PatientDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  // API Data States
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ GET PATIENT ID FROM LOCALSTORAGE (user._id) — NO HARDCODING!
  const storedUser = localStorage.getItem('user'); // 👈 Adjust key if you used different name like 'patientUser'
  let patientId = null;

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      patientId = user?._id || null;
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }
  }

  // Fetch data on mount
  useEffect(() => {
    if (!patientId) {
      setError("You are not logged in. Redirecting to login...");
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${API_URL}/dashboard/patient?patientId=${patientId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        if (result.success) {
          setDashboardData(result.data);
        } else {
          throw new Error(result.message || 'Failed to load dashboard');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [patientId]);
  // Loading State
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          <h5>⚠️ Error Loading Dashboard</h5>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // No Data State
  if (!dashboardData) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning text-center">
          <h5>📭 No Data Available</h5>
          <p>Your dashboard is empty or not configured yet.</p>
        </div>
      </div>
    );
  }

  // Handle Reschedule
  const handleReschedule = () => {
    if (!rescheduleDate || !rescheduleTime) return;
    console.log('Rescheduling to:', rescheduleDate, rescheduleTime);
    // TODO: Call PUT/POST API to update appointment
    setShowModal(false);
    setRescheduleDate('');
    setRescheduleTime('');
  };

  return (
    <div className="container py-4">
      {/* Welcome Banner */}
      <div className="mb-4">
        <div
          className="card shadow-sm border-0 rounded-3"
          style={{
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            boxShadow: '0 4px 12px rgba(187, 59, 8, 0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(187, 59, 8, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(187, 59, 8, 0.2)';
          }}
        >
          <div className="card-body p-3 p-md-4">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span>☀️</span>
              <small style={{ opacity: 0.9 }}>
                {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'}
              </small>
            </div>
            <h1 className="h5 h-md-4 mb-2">Welcome back!</h1>
            <p className="mb-0" style={{ opacity: 0.95, fontSize: '0.95rem' }}>
              You have <strong>{dashboardData.totalAppointments}</strong> appointment(s) scheduled.
              {dashboardData.nextConfirmedAppointment
                ? ' Your next appointment is coming up!'
                : ' No confirmed appointments yet.'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="row g-3 mb-4">
        {[
          {
            icon: 'fas fa-calendar-check',
            value: dashboardData.totalAppointments,
            label: 'Total Appointments',
            sub: 'All time',
            color: '#3498db',
            bg: 'rgba(52, 152, 219, 0.1)',
          },
          {
            icon: 'fas fa-hourglass-start',
            value: dashboardData.statusCount.pending || 0,
            label: 'Pending',
            sub: 'Awaiting confirmation',
            color: '#f39c12',
            bg: 'rgba(243, 156, 18, 0.1)',
          },
          {
            icon: 'fas fa-check-circle',
            value: dashboardData.statusCount.confirmed || 0,
            label: 'Confirmed',
            sub: 'Ready to attend',
            color: '#27ae60',
            bg: 'rgba(39, 174, 96, 0.1)',
          },
        ].map((stat, index) => (
          <div key={index} className="col-12 col-md-4">
            <div
              className="card h-100 border-0 rounded-4 shadow-sm"
              style={{
                backgroundColor: stat.bg,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
              }}
            >
              <div className="card-body d-flex align-items-center p-4">
                <div
                  className="rounded-circle me-3 d-flex align-items-center justify-content-center shadow-sm"
                  style={{
                    width: '54px',
                    height: '54px',
                    backgroundColor: stat.color,
                    color: 'white',
                    fontSize: '22px',
                  }}
                >
                  <i className={stat.icon}></i>
                </div>
                <div>
                  <h4 className="mb-0 fw-bold text-dark">{stat.value}</h4>
                  <p className="text-muted small mb-0">{stat.label}</p>
                  <small className="text-muted">{stat.sub}</small>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Next Appointment Section */}
      {dashboardData.nextConfirmedAppointment ? (
        <div className="mb-4">
          <div
            className="card border-0 rounded-3 overflow-hidden"
            style={{
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
            }}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Next Appointment</h5>
                <span className="badge bg-success bg-opacity-75 text-white small px-2 py-1">
                  Confirmed
                </span>
              </div>

              {/* Doctor Info */}
              <div className="d-flex align-items-start mb-3">
                <div
                  className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#ff500b',
                    color: 'white',
                    fontSize: '18px',
                  }}
                >
                  <i className="fas fa-user-md"></i>
                </div>
                <div>
                  <h6 className="mb-0">{dashboardData.nextConfirmedAppointment.doctorName || 'Dr. Not Assigned'}</h6>
                  <p className="text-muted small mb-0">{dashboardData.nextConfirmedAppointment.specialty || 'Specialist'}</p>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="d-flex flex-wrap gap-3 mb-4">
                {dashboardData.nextConfirmedAppointment.date && (
                  <div className="d-flex align-items-center text-muted small">
                    📅 <span className="ms-1">{dashboardData.nextConfirmedAppointment.date}</span>
                  </div>
                )}
                {dashboardData.nextConfirmedAppointment.type && (
                  <div className="d-flex align-items-center text-muted small">
                    🎥 <span className="ms-1">{dashboardData.nextConfirmedAppointment.type}</span>
                  </div>
                )}
                {dashboardData.nextConfirmedAppointment.time && (
                  <div className="d-flex align-items-center text-muted small">
                    ⏰ <span className="ms-1">{dashboardData.nextConfirmedAppointment.time}</span>
                  </div>
                )}
                {dashboardData.nextConfirmedAppointment.duration && (
                  <div className="d-flex align-items-center text-muted small">
                    ⏱️ <span className="ms-1">{dashboardData.nextConfirmedAppointment.duration} min</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm px-4"
                  style={{
                    backgroundColor: '#ff500b',
                    color: 'white',
                    fontWeight: '500',
                    transition: 'background 0.3s ease, transform 0.2s ease',
                  }}
                >
                  Join Call
                </button>
                <button 
                  className="btn btn-sm btn-outline-secondary px-4"
                  onClick={() => setShowModal(true)}
                >
                  Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-info text-center">
          <i className="fas fa-calendar-times me-2"></i>
          No confirmed upcoming appointments. Please wait for confirmation or book a new one.
        </div>
      )}

      {/* Reschedule Modal */}
      {showModal && (
        <div 
          className="modal fade show d-block" 
          tabIndex="-1" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reschedule Appointment</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Reschedule appointment with <strong>{dashboardData.nextConfirmedAppointment?.doctorName || 'Doctor'}</strong></p>
                <div className="mb-3">
                  <label htmlFor="rescheduleDate" className="form-label">New Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="rescheduleDate"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
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
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn"
                  style={{ backgroundColor: '#F95918', color: 'white' }}
                  onClick={handleReschedule}
                  disabled={!rescheduleDate || !rescheduleTime}
                >
                  Confirm Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;