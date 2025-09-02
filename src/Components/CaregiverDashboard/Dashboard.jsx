import React from "react";

const Dashboard = () => {
  return (
      <>
        {/* Dashboard Home Section */}
        <div id="dashboard-section">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">Dashboard Home</h2>
              <p className="text-muted mb-0">
                Welcome back! Here's your overview for today.
              </p>
            </div>
            <div className="text-end">
              <small className="text-muted">
                Today: <span id="current-date" />
              </small>
            </div>
          </div>
          {/* Welcome Card */}
          <div className="card welcome-card mb-4">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h3 className="card-title mb-2">Welcome, Dr. Smith!</h3>
                  <p className="card-text mb-0">
                    You have 5 tasks scheduled for today. Let's make it a
                    productive day!
                  </p>
                </div>
                <div className="col-md-4 text-end">
                  <i
                    className="fas fa-user-md"
                    style={{ fontSize: "4rem", opacity: "0.3" }}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Stats Cards */}
          <div className="row mb-4">
            <div className="col-md-3 mb-3">
              <div className="card stats-card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="card-text text-muted mb-1">Total Tasks</p>
                      <h4 className="card-title mb-0" id="total-tasks">
                        5
                      </h4>
                    </div>
                    <i className="fas fa-tasks text-primary fs-3" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card stats-card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="card-text text-muted mb-1">Completed</p>
                      <h4
                        className="card-title mb-0 text-success"
                        id="completed-tasks"
                      >
                        2
                      </h4>
                    </div>
                    <i className="fas fa-check-circle text-success fs-3" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card stats-card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="card-text text-muted mb-1">Pending</p>
                      <h4
                        className="card-title mb-0 text-warning"
                        id="pending-tasks"
                      >
                        3
                      </h4>
                    </div>
                    <i className="fas fa-clock text-warning fs-3" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card stats-card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="card-text text-muted mb-1">
                        Patients Today
                      </p>
                      <h4 className="card-title mb-0" id="patients-today">
                        4
                      </h4>
                    </div>
                    <i className="fas fa-user-injured text-info fs-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Quick Tasks Overview */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-clipboard-list me-2" />
                Today's Tasks Overview
              </h5>
            </div>
            <div className="card-body">
              <div id="quick-tasks-list" />
            </div>
          </div>
        </div>
      </>
  );
};

export default Dashboard;
