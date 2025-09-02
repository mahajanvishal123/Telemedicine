import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PatientDashboard = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      {/* ✅ Welcome Banner */}
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
              <small style={{ opacity: 0.9 }}>Good afternoon</small>
            </div>
            <h1 className="h5 h-md-4 mb-2">Welcome back, John!</h1>
            <p className="mb-0" style={{ opacity: 0.95, fontSize: '0.95rem' }}>
              You have 2 appointments scheduled for today. Stay healthy and take care!
            </p>
          </div>
        </div>
      </div>

      {/* ✅ Quick Stats Row */}
      <div className="row g-3 mb-4">
        {[
          {
            icon: 'fas fa-calendar-check',
            value: '24',
            label: 'Total Appointments',
            sub: '+3 this month',
            color: '#3498db',
            bg: 'rgba(52, 152, 219, 0.1)',
          },
          {
            icon: 'fas fa-check-circle',
            value: '18',
            label: 'Completed',
            sub: 'This month',
            color: '#2ecc71',
            bg: 'rgba(46, 204, 113, 0.1)',
          },
          {
            icon: 'fas fa-hourglass-half',
            value: '6',
            label: 'Upcoming',
            sub: 'Next 30 days',
            color: '#e67e22',
            bg: 'rgba(230, 126, 34, 0.1)',
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
                e.currentTarget.style.boxShadow =
                  '0 12px 24px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 4px 12px rgba(0,0,0,0.08)';
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

      {/* ✅ Main Content */}
      <div className="">
        {/* Left Column */}
        <div className="">
          {/* Next Appointment Card */}
          <div
            className="card mb-4 border-0 rounded-3 overflow-hidden"
            style={{
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow =
                '0 12px 24px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow =
                '0 4px 12px rgba(0,0,0,0.08)';
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
                    backgroundColor: '#ff500b',
                    color: 'white',
                    fontWeight: '500',
                    transition:
                      'background 0.3s ease, transform 0.2s ease',
                  }}
                >
                  Join Call
                </button>
                <button className="btn btn-sm btn-outline-secondary px-4">
                  Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Recent Doctors Card - With Circular Avatars */}
        <div
          className="card border-0 rounded-3 overflow-hidden"
          style={{
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}
          onMouseEnter={(e) => {
            // e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
          }}
        >
          <div className="card-body p-3 p-md-4">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
              <h5 className="mb-0">Recent Doctors</h5>
              <a
                href="#"
                className="text-decoration-none small mt-2 mt-md-0"
                style={{ color: '#FF6A00', fontWeight: '500' }}
              >
                View All →
              </a>
            </div>

            <div className="row g-3">
              {[
                { name: 'Dr. Sarah Johnson', specialty: 'Cardiologist', rating: 4.9, time: '2 days ago', img: 'https://randomuser.me/api/portraits/women/45.jpg' },
                { name: 'Dr. Michael Chen', specialty: 'Neurologist', rating: 4.8, time: '1 week ago', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
                { name: 'Dr. Emily Rodriguez', specialty: 'Dermatologist', rating: 4.9, time: '3 days ago', img: 'https://randomuser.me/api/portraits/women/68.jpg' },
                { name: 'Dr. James Wilson', specialty: 'Orthopedic', rating: 4.7, time: '5 days ago', img: 'https://randomuser.me/api/portraits/men/44.jpg' },
              ].map((doctor, index) => (
                <div key={index} className="col-12 col-md-6">
                  <div
                    className="card border bg-white rounded-2 shadow-sm h-100"
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
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.08)';
                    }}
                  >
                    <div className="card-body p-3 d-flex align-items-start">
                      {/* 👤 Circular Avatar */}
                      <div
                        className="rounded-circle me-3"
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#f8f9fa',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                        }}
                      >
                        {doctor.img ? (
                          <img
                            src={doctor.img}
                            alt={doctor.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: '50%',
                            }}
                          />
                        ) : (
                          <span
                            style={{
                              color: '#FF6A00',
                              fontSize: '1rem',
                              fontWeight: 'bold',
                            }}
                          >
                            {doctor.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        )}
                      </div>

                      {/* Doctor Info */}
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                          {doctor.name}
                        </h6>
                        <p className="text-muted small mb-1">{doctor.specialty}</p>
                        <div className="d-flex align-items-center gap-1">
                          <span className="text-warning small">
                            ★ {doctor.rating}
                          </span>
                          <span className="text-muted small">{doctor.time}</span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <i style={{ color: '#FF6A00', fontSize: '0.8rem' }}>→</i>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
