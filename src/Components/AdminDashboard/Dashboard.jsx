import React from 'react';
import { Link } from 'react-router-dom';
const Dashboard = () => {
  // Sample data for demonstration
  const dashboardData = {
    totalUsers: 1245,
    totalAppointments: 378,
    totalEarnings: 18650,
    recentSignups: [
      { id: 1, name: 'Sarah Johnson', date: '2023-10-15', time: '14:30' },
      { id: 2, name: 'Michael Chen', date: '2023-10-15', time: '13:15' },
      { id: 3, name: 'Emma Wilson', date: '2023-10-14', time: '16:45' },
      { id: 4, name: 'James Rodriguez', date: '2023-10-14', time: '11:20' },
      { id: 5, name: 'Lisa Taylor', date: '2023-10-13', time: '09:50' },
    ]
  };

  return (
    <div className="">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="dashboard-heading">Dashboard</h1>
      </div>

      {/* Stats Cards Row */}
      <div className="row">
        {/* Total Users Card */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Users</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{dashboardData.totalUsers.toLocaleString()}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-users fa-2x text-primary"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Appointments Card */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Total Appointments</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{dashboardData.totalAppointments.toLocaleString()}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-calendar-check fa-2x text-success"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Earnings Card */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Total Earnings</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">${dashboardData.totalEarnings.toLocaleString()}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-dollar-sign fa-2x text-info"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Sign-ups Card */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Recent Sign-ups (Today)</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{dashboardData.recentSignups.length}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-user-plus fa-2x text-warning"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sign-ups Table */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex justify-content-between align-items-center">
              <h6 className="m-0 font-weight-bold">Recent Sign-ups</h6>
              <Link to="/admin/user-management">
              <button className="btn btn-sm" style={{ backgroundColor: '#f95918', color: 'white' }}>
                View All
              </button>
              </Link>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered" width="100%" cellSpacing="0">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Date</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentSignups.map(user => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.date}</td>
                        <td>{user.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for styling */}
      <style>
        {`
          .border-left-primary {
            border-left: 0.25rem solid #4e73df !important;
          }
          .border-left-success {
            border-left: 0.25rem solid #1cc88a !important;
          }
          .border-left-info {
            border-left: 0.25rem solid #36b9cc !important;
          }
          .border-left-warning {
            border-left: 0.25rem solid #f95918 !important;
          }
          .card {
            border: 0;
            border-radius: 0.35rem;
          }
          .shadow {
            box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15) !important;
          }
          .btn {
            border-radius: 0.35rem;
          }
          .table {
            border-collapse: collapse;
          }
          .text-warning {
            color: #f95918 !important;
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;