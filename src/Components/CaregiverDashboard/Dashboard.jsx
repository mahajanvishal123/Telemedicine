import React from "react";
import "./Caregiver.css";

const Dashboard = () => {
  return (
    <>
      {/* Dashboard Home Section */}
      <>
        {/* Header */}
        <div className="row align-items-center mb-4">
          {/* Left Section: Heading + Subtitle */}
          <div className="col-12 col-md-8">
            <h3 className="dashboard-heading mb-1">Dashboard</h3>
            <p className="text-muted mb-0">
              Welcome back! Here's your overview for today.
            </p>
          </div>

          {/* Right Section: Date */}
          <div className="col-12 col-md-4 text-md-end mt-2 mt-md-0">
            <small className="text-muted">
              Today: Tuesday, September 02, 2025
            </small>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          {/* Total Tasks */}
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="card shadow-sm h-100 border-0 rounded-4" style={{ backgroundColor: "#fff5f0" }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="card-text text-muted mb-1 fw-semibold">Total Tasks</p>
                    <h3 className="card-title mb-0 fw-bold" style={{ color: "#f9591a" }}>5</h3>
                  </div>
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px", backgroundColor: "#ffe2d3" }}>
                    <i className="fas fa-tasks" style={{ color: "#f9591a", fontSize: "20px" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="card shadow-sm h-100 border-0 rounded-4" style={{ backgroundColor: "#f0fff5" }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="card-text text-muted mb-1 fw-semibold">Completed</p>
                    <h3 className="card-title mb-0 text-success fw-bold">2</h3>
                  </div>
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px", backgroundColor: "#d6f5e3" }}>
                    <i className="fas fa-check-circle" style={{ color: "#28a745", fontSize: "20px" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="card shadow-sm h-100 border-0 rounded-4" style={{ backgroundColor: "#fffdf2" }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="card-text text-muted mb-1 fw-semibold">Pending</p>
                    <h3 className="card-title mb-0 text-warning fw-bold">3</h3>
                  </div>
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px", backgroundColor: "#fff1c6" }}>
                    <i className="fas fa-clock" style={{ color: "#ffc107", fontSize: "20px" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Patients Today */}
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="card shadow-sm h-100 border-0 rounded-4" style={{ backgroundColor: "#f5f7ff" }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="card-text text-muted mb-1 fw-semibold">Patients Today</p>
                    <h3 className="card-title mb-0 fw-bold" style={{ color: "#0d6efd" }}>4</h3>
                  </div>
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px", backgroundColor: "#d6e3ff" }}>
                    <i className="fas fa-user-injured" style={{ color: "#0d6efd", fontSize: "20px" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Today's Tasks Section */}
        <div className="card mb-4 shadow-sm border-0 rounded-4">
          <div className="card-header bg-white border-0 rounded-top-4 py-3 px-4">
            <h5 className="mb-0 fw-bold text-dark">
              <i className="fas fa-clipboard-list me-2 text-primary" />
              Today's Tasks
            </h5>
          </div>

          <div className="card-body p-3">
            <div className="row g-3">
              {/* Task 1 - Completed */}
              <div className="col-md-6 col-lg-4">
                <div
                  className="card h-100 border-0 rounded-4 shadow-sm"
                  style={{ backgroundColor: "#f0fff5" }}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="fw-bold text-dark mb-0">John Doe</h5>
                      <span className="badge bg-light text-dark px-3 py-2 shadow-sm rounded-pill">
                        09:00 AM
                      </span>
                    </div>

                    <p className="mb-2">
                      <i className="fas fa-map-marker-alt me-2 text-primary" />
                      <small className="text-muted">123 Main St, Springfield</small>
                    </p>
                    <p className="fw-semibold mb-3">
                      <i className="fas fa-stethoscope me-2 text-primary" />
                      Check vitals
                    </p>

                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-success fw-semibold">
                        <i className="fas fa-check me-1" />
                        Completed
                      </span>
                      <i className="fas fa-check-circle text-success fs-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Task 2 - Completed */}
              <div className="col-md-6 col-lg-4">
                <div
                  className="card h-100 border-0 rounded-4 shadow-sm"
                  style={{ backgroundColor: "#f0fff5" }}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="fw-bold text-dark mb-0">Jane Smith</h5>
                      <span className="badge bg-light text-dark px-3 py-2 shadow-sm rounded-pill">
                        10:30 AM
                      </span>
                    </div>

                    <p className="mb-2">
                      <i className="fas fa-map-marker-alt me-2 text-primary" />
                      <small className="text-muted">456 Oak Ave, Downtown</small>
                    </p>
                    <p className="fw-semibold mb-3">
                      <i className="fas fa-pills me-2 text-primary" />
                      Medication review
                    </p>

                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-success fw-semibold">
                        <i className="fas fa-check me-1" />
                        Completed
                      </span>
                      <i className="fas fa-check-circle text-success fs-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Task 3 - Pending */}
              <div className="col-md-6 col-lg-4">
                <div
                  className="card h-100 border-0 rounded-4 shadow-sm"
                  style={{ backgroundColor: "#fffdf2" }}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="fw-bold text-dark mb-0">Mike Johnson</h5>
                      <span className="badge bg-light text-dark px-3 py-2 shadow-sm rounded-pill">
                        11:45 AM
                      </span>
                    </div>

                    <p className="mb-2">
                      <i className="fas fa-map-marker-alt me-2 text-warning" />
                      <small className="text-muted">789 Pine Rd, Westside</small>
                    </p>
                    <p className="fw-semibold mb-3">
                      <i className="fas fa-walking me-2 text-warning" />
                      Physical therapy
                    </p>

                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-warning fw-semibold">
                        <i className="fas fa-clock me-1" />
                        Pending
                      </span>
                      <button
                        className="btn btn-sm text-white fw-semibold rounded-pill"
                        style={{ backgroundColor: "#f9591a" }}
                      >
                        <i className="fas fa-check me-1" />
                        Complete
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Task 4 - Pending */}
              <div className="col-md-6 col-lg-4">
                <div
                  className="card h-100 border-0 rounded-4 shadow-sm"
                  style={{ backgroundColor: "#fffdf2" }}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="fw-bold text-dark mb-0">Sarah Wilson</h5>
                      <span className="badge bg-light text-dark px-3 py-2 shadow-sm rounded-pill">
                        02:15 PM
                      </span>
                    </div>

                    <p className="mb-2">
                      <i className="fas fa-map-marker-alt me-2 text-warning" />
                      <small className="text-muted">321 Elm St, Northgate</small>
                    </p>
                    <p className="fw-semibold mb-3">
                      <i className="fas fa-band-aid me-2 text-warning" />
                      Wound care
                    </p>

                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-warning fw-semibold">
                        <i className="fas fa-clock me-1" />
                        Pending
                      </span>
                      <button
                        className="btn btn-sm text-white fw-semibold rounded-pill"
                        style={{ backgroundColor: "#f9591a" }}
                      >
                        <i className="fas fa-check me-1" />
                        Complete
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Task 5 - Pending */}
              <div className="col-md-6 col-lg-4">
                <div
                  className="card h-100 border-0 rounded-4 shadow-sm"
                  style={{ backgroundColor: "#fffdf2" }}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="fw-bold text-dark mb-0">Robert Brown</h5>
                      <span className="badge bg-light text-dark px-3 py-2 shadow-sm rounded-pill">
                        03:30 PM
                      </span>
                    </div>

                    <p className="mb-2">
                      <i className="fas fa-map-marker-alt me-2 text-warning" />
                      <small className="text-muted">654 Maple Dr, Southpoint</small>
                    </p>
                    <p className="fw-semibold mb-3">
                      <i className="fas fa-stethoscope me-2 text-warning" />
                      Check vitals
                    </p>

                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-warning fw-semibold">
                        <i className="fas fa-clock me-1" />
                        Pending
                      </span>
                      <button
                        className="btn btn-sm text-white fw-semibold rounded-pill"
                        style={{ backgroundColor: "#f9591a" }}
                      >
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
