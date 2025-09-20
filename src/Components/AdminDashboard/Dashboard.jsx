import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Base_Url from "../../Baseurl/Baseurl"
import axios from 'axios';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalCaregivers: 0,
    totalUsers: 0,
    totalEarnings: 0,         // ✅ added
    recentSignups: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${Base_Url}/dashboard`);

        if (response.data.success) {
          setDashboardData(response.data.data); 
        } else {
          throw new Error('API returned unsuccessful response');
        }
      } catch (err) {
        console.error("Error fetching dashboard:", err);
        setError(
          err.response?.data?.message || 
          err.response?.status === 404 ? 'API endpoint not found. Check backend route.' :
          err.message || 'Unknown error occurred'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString('en-CA'),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (loading) {
    return <div className="text-center py-5">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  // Static placeholder data for new cards (to be replaced later via API)
  const totalAppointments = 127; // Example static value
  const totalRevenue = "$18,450"; // Example static value

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="dashboard-heading">Dashboard</h1>
      </div>

      {/* Stats Cards Row 1 */}
      <div className="row">
        {/* Total Users */}
<<<<<<< HEAD
        <div className="col-xl-4 col-md-6 mb-4">
=======
        <div className="col-xl-3 col-md-6 mb-4">
>>>>>>> 758afd2789adcc6cf93d30d1d25f2d672233ed62
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Total Users</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{dashboardData.totalUsers}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-users fa-2x text-warning"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Doctors */}
<<<<<<< HEAD
        <div className="col-xl-4 col-md-6 mb-4">
=======
        <div className="col-xl-3 col-md-6 mb-4">
>>>>>>> 758afd2789adcc6cf93d30d1d25f2d672233ed62
          <Link to="/admin/doctor" style={{ textDecoration: "none" }}>
            <div className="card border-left-primary shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                      Total Doctors</div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {dashboardData.totalDoctors}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-user-md fa-2x text-primary"></i>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Total Patients */}
<<<<<<< HEAD
        <div className="col-xl-4 col-md-6 mb-4">
=======
        <div className="col-xl-3 col-md-6 mb-4">
>>>>>>> 758afd2789adcc6cf93d30d1d25f2d672233ed62
          <Link to="/admin/patient" style={{ textDecoration: "none" }}>
            <div className="card border-left-success shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                      Total Patients</div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {dashboardData.totalPatients}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-user-injured fa-2x text-success"></i>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

<<<<<<< HEAD
      {/* Stats Cards Row 2 */}
      <div className="row">
        {/* Total Caregivers */}
        <div className="col-xl-4 col-md-6 mb-4">
=======
        {/* Total Caregivers */}
        <div className="col-xl-3 col-md-6 mb-4">
>>>>>>> 758afd2789adcc6cf93d30d1d25f2d672233ed62
          <Link to="/admin/caregiver" style={{ textDecoration: "none" }}>
            <div className="card border-left-info shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                      Total Caregivers</div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {dashboardData.totalCaregivers}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-hands-helping fa-2x text-info"></i>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

<<<<<<< HEAD
        {/* Total Appointments (Static for now) */}
        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card border-left-secondary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-secondary text-uppercase mb-1">
                    Total Appointments</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {dashboardData.totalAppointments}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-calendar-check fa-2x text-secondary"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Revenue (Static for now) */}
        <div className="col-xl-4 col-md-6 mb-4">
=======
        {/* ✅ Total Earnings */}
        <div className="col-xl-3 col-md-6 mb-4">
>>>>>>> 758afd2789adcc6cf93d30d1d25f2d672233ed62
          <div className="card border-left-danger shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
<<<<<<< HEAD
                    Total Revenue</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {dashboardData.totalRevenue}
=======
                    Total Earnings
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    ${Number(dashboardData.totalEarnings ?? 0).toLocaleString()}
>>>>>>> 758afd2789adcc6cf93d30d1d25f2d672233ed62
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-dollar-sign fa-2x text-danger"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
<<<<<<< HEAD
=======

>>>>>>> 758afd2789adcc6cf93d30d1d25f2d672233ed62
      </div>

      {/* Table for recent signups */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex justify-content-between align-items-center">
              <h6 className="m-0 font-weight-bold">Recent Sign-ups</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered" width="100%" cellSpacing="0">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Date</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentSignups.map(user => {
                      const { date, time } = formatDateTime(user.createdAt);
                      return (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.role}</td>
                          <td>{date}</td>
                          <td>{time}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style>
        {`
          .border-left-primary { border-left: 0.25rem solid #4e73df !important; }
          .border-left-success { border-left: 0.25rem solid #1cc88a !important; }
          .border-left-info { border-left: 0.25rem solid #36b9cc !important; }
          .border-left-warning { border-left: 0.25rem solid #f95918 !important; }
<<<<<<< HEAD
          .border-left-secondary { border-left: 0.25rem solid #858796 !important; }
          .border-left-danger { border-left: 0.25rem solid #e74a3b !important; }
=======
          .border-left-danger { border-left: 0.25rem solid #e74a3b !important; } /* ✅ for earnings card */
>>>>>>> 758afd2789adcc6cf93d30d1d25f2d672233ed62
          .card { border: 0; border-radius: 0.35rem; transition: transform 0.2s; }
          .card:hover { transform: scale(1.02); cursor: pointer; }
          .shadow { box-shadow: 0 0.15rem 1.75rem 0 rgba(58,59,69,0.15) !important; }
        `}
      </style>
    </div>
  );
};

export default Dashboard;