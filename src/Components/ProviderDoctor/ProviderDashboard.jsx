import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import API_URL from "../../Baseurl/Baseurl";

const ProviderDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New state for export and details functionality
  const [showEarningsDetails, setShowEarningsDetails] = useState(false);
  const [exportFormat, setExportFormat] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const cardHover = {
    scale: 1.02,
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    transition: {
      type: "spring",
      stiffness: 300
    }
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${API_URL}/dashboard`);
        
        if (response.data.success) {
          setDashboardData(response.data.data);
        } else {
          setError('Failed to fetch dashboard data');
        }
      } catch (err) {
        setError('Error fetching  ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Effect to handle export functionality
  useEffect(() => {
    if (exportFormat) {
      handleExport(exportFormat);
      // Reset export format after handling
      setTimeout(() => setExportFormat(null), 1000);
    }
  }, [exportFormat]);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Handle export functionality
  const handleExport = (format) => {
    // In a real application, this would generate and download a file
    console.log(`Exporting earnings data in ${format} format`);
    alert(`Earnings data exported as ${format.toUpperCase()} successfully!`);
  };

  // Toggle earnings details view
  const toggleEarningsDetails = () => {
    setShowEarningsDetails(!showEarningsDetails);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center" role="alert">
        {error}
      </div>
    );
  }

  // Use API data or fallback values
  const totalDoctors = dashboardData?.totalDoctors || 17;
  const totalPatients = dashboardData?.totalPatients || 9;
  const totalCaregivers = dashboardData?.totalCaregivers || 2;
  const totalUsers = dashboardData?.totalUsers || 28;
  const recentSignups = dashboardData?.recentSignups || [];

  return (
    <div className="">
      {/* Header Section */}
      <motion.div
        className="row mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="col-12 mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className='dashboard-heading'>Doctor Dashboard</h3>
              <p className="text-muted">{formatDate(currentTime)} | {formatTime(currentTime)}</p>
            </div>
           
          </div>
        </div>

        {/* Quick Stats */}
        <motion.div
          className="row"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            {
              icon: "fas fa-user-injured",
              value: totalPatients,
              label: "Total Patients",
              color: "#3498db",
              bg: "rgba(52, 152, 219, 0.15)"
            },
            {
              icon: "fas fa-user-md",
              value: totalDoctors,
              label: "Total Doctors",
              color: "#2ecc71",
              bg: "rgba(46, 204, 113, 0.15)"
            },
            {
              icon: "fas fa-user-friends",
              value: totalCaregivers,
              label: "Total Caregivers",
              color: "#f1c40f",
              bg: "rgba(241, 196, 15, 0.15)"
            },
            {
              icon: "fas fa-users",
              value: totalUsers,
              label: "Total Users",
              color: "#e67e22",
              bg: "rgba(230, 126, 34, 0.15)"
            }
          ].map((stat, i) => (
            <motion.div className="col-md-3 mb-4" key={i} variants={itemVariants}>
              <motion.div
                className="card shadow-sm border-0 h-100 rounded-4"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 12px 30px rgba(0,0,0,0.15)"
                }}
                style={{
                  background: `linear-gradient(135deg, ${stat.bg} 0%, #ffffff 100%)`,
                  border: "1px solid rgba(0,0,0,0.05)"
                }}
              >
                <div className="card-body text-center">
                  <motion.div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow-sm"
                    style={{
                      width: "70px",
                      height: "70px",
                      backgroundColor: stat.bg
                    }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <i
                      className={stat.icon}
                      style={{ color: stat.color, fontSize: "22px" }}
                    ></i>
                  </motion.div>
                  <h4 className="fw-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </h4>
                  <p className="text-muted mb-0">{stat.label}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Recent Signups */}
      <div
        className="row mb-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="col-12" variants={itemVariants}>
          <div
            className="card  h-100 border-0"
            whileHover={cardHover}
          >
            <div className="card-header">
              <h5 className="mb-0">Recent Signups</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Signup Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSignups.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>
                          <span className={`badge ${
                            user.role === 'Doctor' ? 'bg-primary' :
                            user.role === 'Patient' ? 'bg-success' : 'bg-info'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings Overview */}
      <motion.div
        className="row mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        // transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="col-12 mt-3">
          <motion.div
            className="card shadow-sm border-0 "
            whileHover={cardHover}
            style={{ position: "relative", overflow: "visible" }}
          >
            <div className="card-header d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center ">
              <h5 className="mb-2 mb-sm-0">Earnings Overview (This Week)</h5>
              <div>
                <span className="badge bg-light text-dark">Total: $3,020</span>
              </div>
            </div>

            <div
              className="card-body"
              style={{ position: "relative", overflow: "visible" }}
            >
              {showEarningsDetails ? (
                // Detailed view
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h5>Detailed Earnings Breakdown</h5>
                  <div className="row gy-3">
                    <div className="col-12 col-md-6">
                      <ul className="list-group">
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          Monday
                          <span className="badge bg-primary rounded-pill">$380</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          Tuesday
                          <span className="badge bg-primary rounded-pill">$520</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          Wednesday
                          <span className="badge bg-primary rounded-pill">$460</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          Thursday
                          <span className="badge bg-primary rounded-pill">$610</span>
                        </li>
                      </ul>
                    </div>
                    <div className="col-12 col-md-6">
                      <ul className="list-group">
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          Friday
                          <span className="badge bg-primary rounded-pill">$550</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          Saturday
                          <span className="badge bg-primary rounded-pill">$320</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          Sunday
                          <span className="badge bg-primary rounded-pill">$180</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          Total
                          <span className="badge bg-success rounded-pill">$3,020</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <motion.button
                      className="btn btn-outline-secondary"
                      onClick={toggleEarningsDetails}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <i className="fas fa-arrow-left me-2"></i>Back to Chart
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                // Chart view
                <>
                  <div className="row gy-4">
                    {/* Chart */}
                    <div className="col-12 col-lg-8">
                      <div className="chart-container" style={{ height: "250px" }}>
                        <div
                          className="d-flex align-items-end h-100"
                          style={{ gap: "12px" }}
                        >
                          {[380, 520, 460, 610, 550, 320, 180].map((earnings, index) => {
                            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                            return (
                              <motion.div
                                key={index}
                                className="d-flex flex-column align-items-center"
                                style={{ flex: 1 }}
                                initial={{ height: 0 }}
                                animate={{ height: `${(earnings / 700) * 100}%` }}
                                transition={{
                                  delay: index * 0.1 + 0.5,
                                  duration: 0.8,
                                  type: "spring",
                                }}
                              >
                                <motion.div
                                  className="rounded"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor: "#F95918",
                                    minHeight: "10px",
                                  }}
                                  whileHover={{ backgroundColor: "#e14a12" }}
                                ></motion.div>
                                <small className="mt-2">{days[index]}</small>
                                <small className="fw-bold">${earnings}</small>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="col-12 col-lg-4">
                      <div className="d-flex justify-content-between mb-3">
                        <span>Weekly Goal:</span>
                        <span className="fw-bold">$2,800</span>
                      </div>
                      <div className="progress mb-4" style={{ height: "10px" }}>
                        <motion.div
                          className="progress-bar"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${3020 / 2800 * 100 > 100 ? 100 : (3020 / 2800) * 100
                              }%`,
                          }}
                          transition={{ delay: 0.8, duration: 1.5 }}
                          style={{ backgroundColor: "#F95918" }}
                        ></motion.div>
                      </div>

                      <motion.div
                        className="d-flex justify-content-between mb-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 }}
                      >
                        <span>
                          <i className="fas fa-circle text-success me-2"></i>Consultations
                        </span>
                        <span>$1,840</span>
                      </motion.div>
                      <motion.div
                        className="d-flex justify-content-between mb-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 }}
                      >
                        <span>
                          <i className="fas fa-circle text-primary me-2"></i>Procedures
                        </span>
                        <span>$980</span>
                      </motion.div>
                      <motion.div
                        className="d-flex justify-content-between mb-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 }}
                      >
                        <span>
                          <i className="fas fa-circle text-warning me-2"></i>Follow-ups
                        </span>
                        <span>$200</span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-4 d-flex flex-column flex-md-row justify-content-center align-items-center gap-2 text-center">
                    <div className="dropdown d-inline-block me-2">
                      <button
                        className="btn btn-outline-secondary dropdown-toggle"
                        type="button"
                        id="exportDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="fas fa-download me-2"></i>Export
                      </button>
                      <ul className="dropdown-menu" aria-labelledby="exportDropdown">
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => setExportFormat("csv")}
                          >
                            CSV Format
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => setExportFormat("pdf")}
                          >
                            PDF Format
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => setExportFormat("excel")}
                          >
                            Excel Format
                          </button>
                        </li>
                      </ul>
                    </div>
                    <button
                      className="btn"
                      style={{ backgroundColor: "#F95918", color: "white" }}
                      onClick={toggleEarningsDetails}
                    >
                      <i className="fas fa-chart-line me-2"></i>Details
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProviderDashboard;