import React from 'react';

const PatientDashboard = () => {
  return (
    <div className="bg-light" style={{ minHeight: '100vh' }}>
      {/* ✅ Welcome Banner - Full Width, Outside Columns */}
      <div className="container-fluid px-4 mb-4">
        <div
          className="card shadow-sm border-0 rounded-3"
          style={{ backgroundColor: '#bb3b08', color: 'white' }}
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
          {/* Left Column - Next Appointment & Recent Doctors */}
          <div className="col-lg-7 col-md-12">
            {/* ✅ Next Appointment Card */}
            <div className="card mb-4 shadow-sm border-0 rounded-3 overflow-hidden">
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
                    }}
                  >
                    Join Call
                  </button>
                  <button className="btn btn-sm btn-outline-secondary px-4">Reschedule</button>
                </div>
              </div>
            </div>

            {/* ✅ Recent Doctors Card */}
            <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
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
                      <div className="card border h-100 rounded-2">
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

          {/* Right Column - Quick Stats & Quick Actions */}
          <div className="col-lg-5 col-md-12">
            {/* ✅ Quick Stats Card */}
            <div className="card mb-4 shadow-sm border-0 rounded-3 overflow-hidden">
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
            <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
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
                      }}
                    >
                      <div>
                        <h6 className="mb-0">{action.label}</h6>
                        <small className="text-muted">{action.desc}</small>
                      </div>
                      <i style={{ color: '#bb3b08' }}>→</i>
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