import React from 'react';

const PatientDashboard = () => {
  return (
    <div className="bg-light" style={{ minHeight: '100vh' }}>
      {/* ✅ Welcome Banner - Full Width */}
      <div className="container-fluid px-4 mb-4">
        <div
          className="card shadow-sm border-0 rounded-3"
          style={{
            backgroundColor: '#bb3b08',
            color: 'white',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            boxShadow: '0 4px 12px rgba(187, 59, 8, 0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(187, 59, 8, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(187, 59, 8, 0.2)';
          }}
        >
          <div className="card-body p-4">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span>☀️</span>
              <small style={{ opacity: 0.9 }}>Good afternoon</small>
            </div>
            <h1 className="h4 mb-2">Welcome back, John!</h1>
            <p className="mb-0" style={{ opacity: 0.95 }}>
              You have 2 appointments scheduled for today. Stay healthy and take care!
            </p>
          </div>
        </div>
      </div>

      {/* Main Content - Two Columns */}
      <div className="container-fluid px-4">
        <div className="row g-4">
          {/* Left Column */}
          <div className="col-lg-7 col-md-12">
            {/* ✅ Next Appointment Card */}
            <div
              className="card mb-4 border-0 rounded-3 overflow-hidden"
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
                      backgroundColor: '#bb3b08',
                      color: 'white',
                      fontSize: '18px',
                    }}
                  >
                    👤
                  </div>
                  <div>
                    <h6 className="mb-0">Dr. Sarah Johnson</h6>
                    <p className="text-muted small mb-0">Cardiologist</p>
                  </div>
                </div>

                {/* Details */}
                <div className="d-flex flex-wrap gap-3 mb-4">
                  <div className="d-flex align-items-center text-muted small">
                    📅 <span className="ms-1">Today</span>
                  </div>
                  <div className="d-flex align-items-center text-muted small">
                    🎥 <span className="ms-1">Video Consultation</span>
                  </div>
                  <div className="d-flex align-items-center text-muted small">
                    ⏰ <span className="ms-1">2:30 PM</span>
                  </div>
                  <div className="d-flex align-items-center text-muted small">
                    ⏱️ <span className="ms-1">30 min</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm px-4"
                    style={{
                      backgroundColor: '#bb3b08',
                      borderColor: '#bb3b08',
                      color: 'white',
                      fontWeight: '500',
                      transition: 'background 0.3s ease, transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#a33300';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#bb3b08';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    Join Call
                  </button>
                  <button
                    className="btn btn-sm btn-outline-secondary px-4"
                    style={{
                      transition: 'background 0.3s ease, border-color 0.3s ease, transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f0f0f0';
                      e.target.style.borderColor = '#bb3b08';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '';
                      e.target.style.borderColor = '#ccc';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            </div>

            {/* ✅ Recent Doctors Card */}
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
                  <h5 className="mb-0">Recent Doctors</h5>
                  <a
                    href="#"
                    className="text-decoration-none small"
                    style={{ color: '#bb3b08', fontWeight: '500' }}
                  >
                    View All →
                  </a>
                </div>

                <div className="row g-3">
                  {[
                    { name: 'Dr. Sarah Johnson', specialty: 'Cardiologist', rating: 4.9, time: '2 days ago' },
                    { name: 'Dr. Michael Chen', specialty: 'Neurologist', rating: 4.8, time: '1 week ago' },
                    { name: 'Dr. Emily Rodriguez', specialty: 'Dermatologist', rating: 4.9, time: '3 days ago' },
                    { name: 'Dr. James Wilson', specialty: 'Orthopedic', rating: 4.7, time: '5 days ago' },
                  ].map((doctor, index) => (
                    <div key={index} className="col-6">
                      <div
                        className="card border h-100 rounded-2"
                        style={{
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '';
                        }}
                      >
                        <div className="card-body p-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-0">{doctor.name}</h6>
                              <p className="text-muted small mb-0">{doctor.specialty}</p>
                              <div className="d-flex align-items-center gap-1 mt-1">
                                <span className="text-warning small">★ {doctor.rating}</span>
                                <span className="text-muted small">{doctor.time}</span>
                              </div>
                            </div>
                            <i style={{ color: '#bb3b08' }}>→</i>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-lg-5 col-md-12">
            {/* ✅ Quick Stats Card */}
            <div
              className="card mb-4 border-0 rounded-3 overflow-hidden"
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
                <h5 className="mb-3">Quick Stats</h5>
                <div className="d-flex flex-column gap-3">
                  {[
                    { icon: '📅', value: '24', label: 'Total Appointments', sub: '+3 this month', color: '#3498db' },
                    { icon: '✅', value: '18', label: 'Completed', sub: 'This month', color: '#2ecc71' },
                    { icon: '⏳', value: '6', label: 'Upcoming', sub: 'Next 30 days', color: '#e67e22' },
                  ].map((stat, index) => (
                    <div key={index} className="d-flex align-items-center">
                      <div
                        className="rounded me-3 d-flex align-items-center justify-content-center"
                        style={{
                          width: '36px',
                          height: '36px',
                          backgroundColor: stat.color,
                          color: 'white',
                          fontSize: '16px',
                        }}
                      >
                        {stat.icon}
                      </div>
                      <div>
                        <h6 className="mb-0">{stat.value}</h6>
                        <p className="text-muted small mb-0">{stat.label}</p>
                        <small className="text-muted">{stat.sub}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ✅ Quick Actions Card */}
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
                <h5 className="mb-3">Quick Actions</h5>
                <div className="list-group list-group-flush">
                  {[
                    { icon: '📅', label: 'Book New Appointment', desc: 'Schedule with your preferred doctor' },
                    { icon: '📞', label: 'Emergency Call', desc: '24/7 medical assistance' },
                    { icon: '📋', label: 'Medical Records', desc: 'View your health history' },
                    { icon: '💊', label: 'Prescriptions', desc: 'Manage your medications' },
                  ].map((action, index) => (
                    <a
                      key={index}
                      href="#"
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center rounded-2 mb-2"
                      style={{
                        border: '1px solid #e9ecef',
                        transition: 'transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.backgroundColor = '#f8f9fa';
                        e.target.style.borderColor = '#bb3b08';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.backgroundColor = '';
                        e.target.style.borderColor = '#e9ecef';
                      }}
                    >
                      <div>
                        <h6 className="mb-0">{action.label}</h6>
                        <small className="text-muted">{action.desc}</small>
                      </div>
                      <i style={{ color: '#bb3b08', transition: 'color 0.2s ease' }}>→</i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;