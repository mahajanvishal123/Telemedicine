import React from "react";
import "./Caregiver.css";

const Dashboard = () => {
  return (
    <>
      {/* Dashboard Home Section */}
      <>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="healthcare-section-header mb-1">Dashboard Home</h2>
            <p className="text-muted mb-0">
              Welcome back! Here's your overview for today.
            </p>
          </div>
          <div className="text-end">
            <small className="text-muted">
              Today: Tuesday, September 02, 2025
            </small>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card healthcare-stats-card h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="card-text text-muted mb-1 fw-medium">
                      Total Tasks
                    </p>
                    <h3
                      className="card-title mb-0 fw-bold"
                      style={{ color: "#f9591a" }}
                    >
                      5
                    </h3>
                  </div>
                  <div className="healthcare-icon-circle">
                    <i className="fas fa-tasks text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card healthcare-stats-card h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="card-text text-muted mb-1 fw-medium">
                      Completed
                    </p>
                    <h3 className="card-title mb-0 text-success fw-bold">2</h3>
                  </div>
                  <div className="healthcare-icon-circle">
                    <i className="fas fa-check-circle text-success" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card healthcare-stats-card h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="card-text text-muted mb-1 fw-medium">
                      Pending
                    </p>
                    <h3 className="card-title mb-0 text-warning fw-bold">3</h3>
                  </div>
                  <div className="healthcare-icon-circle">
                    <i className="fas fa-clock text-warning" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card healthcare-stats-card h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="card-text text-muted mb-1 fw-medium">
                      Patients Today
                    </p>
                    <h3
                      className="card-title mb-0 fw-bold"
                      style={{ color: "#f9591a" }}
                    >
                      4
                    </h3>
                  </div>
                  <div className="healthcare-icon-circle">
                    <i className="fas fa-user-injured" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Today's Tasks Section */}
        <div className="card mb-4">
          <div className="card-header healthcare-card-header">
            <h5 className="mb-0">
              <i className="fas fa-clipboard-list me-2" />
              Today's Tasks
            </h5>
          </div>
          <div className="card-body p-0">
            <div className="row g-0">
              {/* Task 1 - Completed */}
              <div className="col-md-6 col-lg-4 p-3">
                <div className="card healthcare-task-card h-100">
                  <div className="card-body">
                    <div className="healthcare-patient-header mb-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <h5 className="card-title mb-1 fw-bold">John Doe</h5>
                        <span className="healthcare-time-badge">09:00 AM</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="card-text mb-2">
                        <i
                          className="fas fa-map-marker-alt me-2"
                          style={{ color: "#f9591a" }}
                        />
                        <small className="text-muted">
                          123 Main St, Springfield
                        </small>
                      </p>
                      <p className="card-text mb-3">
                        <i
                          className="fas fa-stethoscope me-2"
                          style={{ color: "#f9591a" }}
                        />
                        <strong>Check vitals</strong>
                      </p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="healthcare-status-completed">
                        <i className="fas fa-check me-1" />
                        Completed
                      </span>
                      <i className="fas fa-check-circle text-success fs-5" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Task 2 - Completed */}
              <div className="col-md-6 col-lg-4 p-3">
                <div className="card healthcare-task-card h-100">
                  <div className="card-body">
                    <div className="healthcare-patient-header mb-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <h5 className="card-title mb-1 fw-bold">Jane Smith</h5>
                        <span className="healthcare-time-badge">10:30 AM</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="card-text mb-2">
                        <i
                          className="fas fa-map-marker-alt me-2"
                          style={{ color: "#f9591a" }}
                        />
                        <small className="text-muted">
                          456 Oak Ave, Downtown
                        </small>
                      </p>
                      <p className="card-text mb-3">
                        <i
                          className="fas fa-pills me-2"
                          style={{ color: "#f9591a" }}
                        />
                        <strong>Medication review</strong>
                      </p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="healthcare-status-completed">
                        <i className="fas fa-check me-1" />
                        Completed
                      </span>
                      <i className="fas fa-check-circle text-success fs-5" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Task 3 - Pending */}
              <div className="col-md-6 col-lg-4 p-3">
                <div className="card healthcare-task-card h-100">
                  <div className="card-body">
                    <div className="healthcare-patient-header mb-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <h5 className="card-title mb-1 fw-bold">
                          Mike Johnson
                        </h5>
                        <span className="healthcare-time-badge">11:45 AM</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="card-text mb-2">
                        <i
                          className="fas fa-map-marker-alt me-2"
                          style={{ color: "#f9591a" }}
                        />
                        <small className="text-muted">
                          789 Pine Rd, Westside
                        </small>
                      </p>
                      <p className="card-text mb-3">
                        <i
                          className="fas fa-walking me-2"
                          style={{ color: "#f9591a" }}
                        />
                        <strong>Physical therapy</strong>
                      </p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="healthcare-status-pending">
                        <i className="fas fa-clock me-1" />
                        Pending
                      </span>
                      <button className="btn btn-sm healthcare-btn-primary">
                        <i className="fas fa-check me-1" />
                        Complete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Task 4 - Pending */}
              <div className="col-md-6 col-lg-4 p-3">
                <div className="card healthcare-task-card h-100">
                  <div className="card-body">
                    <div className="healthcare-patient-header mb-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <h5 className="card-title mb-1 fw-bold">
                          Sarah Wilson
                        </h5>
                        <span className="healthcare-time-badge">02:15 PM</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="card-text mb-2">
                        <i
                          className="fas fa-map-marker-alt me-2"
                          style={{ color: "#f9591a" }}
                        />
                        <small className="text-muted">
                          321 Elm St, Northgate
                        </small>
                      </p>
                      <p className="card-text mb-3">
                        <i
                          className="fas fa-band-aid me-2"
                          style={{ color: "#f9591a" }}
                        />
                        <strong>Wound care</strong>
                      </p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="healthcare-status-pending">
                        <i className="fas fa-clock me-1" />
                        Pending
                      </span>
                      <button className="btn btn-sm healthcare-btn-primary">
                        <i className="fas fa-check me-1" />
                        Complete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Task 5 - Pending */}
              <div className="col-md-6 col-lg-4 p-3">
                <div className="card healthcare-task-card h-100">
                  <div className="card-body">
                    <div className="healthcare-patient-header mb-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <h5 className="card-title mb-1 fw-bold">
                          Robert Brown
                        </h5>
                        <span className="healthcare-time-badge">03:30 PM</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="card-text mb-2">
                        <i
                          className="fas fa-map-marker-alt me-2"
                          style={{ color: "#f9591a" }}
                        />
                        <small className="text-muted">
                          654 Maple Dr, Southpoint
                        </small>
                      </p>
                      <p className="card-text mb-3">
                        <i
                          className="fas fa-stethoscope me-2"
                          style={{ color: "#f9591a" }}
                        />
                        <strong>Check vitals</strong>
                      </p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="healthcare-status-pending">
                        <i className="fas fa-clock me-1" />
                        Pending
                      </span>
                      <button className="btn btn-sm healthcare-btn-primary">
                        <i className="fas fa-check me-1" />
                        Complete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default Dashboard;
