import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ProviderDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextAppointment, setNextAppointment] = useState({
    patientName: 'Sarah Johnson',
    time: '10:30 AM',
    type: 'Follow-up Consultation',
    status: 'Confirmed'
  });

  const [todayStats, setTodayStats] = useState({
    appointments: 8,
    completed: 3,
    pending: 5,
    earnings: 420
  });

  const [weeklyEarnings, setWeeklyEarnings] = useState([
    { day: 'Mon', earnings: 380 },
    { day: 'Tue', earnings: 520 },
    { day: 'Wed', earnings: 460 },
    { day: 'Thu', earnings: 610 },
    { day: 'Fri', earnings: 550 },
    { day: 'Sat', earnings: 320 },
    { day: 'Sun', earnings: 180 }
  ]);

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

  // Check if it's time for the next appointment (within 15 minutes)
  const isAppointmentTime = () => {
    if (!nextAppointment.time) return false;

    const now = currentTime;
    const [time, modifier] = nextAppointment.time.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    const appointmentTime = new Date(now);
    appointmentTime.setHours(hours, minutes, 0, 0);

    const diffMs = appointmentTime - now;
    const diffMins = Math.round(diffMs / 60000);

    return diffMins >= 0 && diffMins <= 15;
  };

  // Handle export functionality
  const handleExport = (format) => {
    // In a real application, this would generate and download a file
    console.log(`Exporting earnings data in ${format} format`);

    // Simulate export process
    alert(`Earnings data exported as ${format.toUpperCase()} successfully!`);
  };

  // Toggle earnings details view
  const toggleEarningsDetails = () => {
    setShowEarningsDetails(!showEarningsDetails);
  };

  // Handle start call button click
  const handleStartCall = () => {
    // In a real application, this would initiate a video call
    alert(`Starting call with ${nextAppointment.patientName}`);
  };

  // Handle profile dropdown actions
  const handleProfileAction = (action) => {
    switch (action) {
      case 'profile':
        alert('Navigating to profile page');
        break;
      case 'settings':
        alert('Navigating to settings page');
        break;
      case 'logout':
        alert('Logging out...');
        break;
      default:
        break;
    }
  };

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
              value: "142",
              label: "Total Patients",
              color: "#3498db",
              bg: "rgba(52, 152, 219, 0.15)"
            },
            {
              icon: "fas fa-calendar-check",
              value: "28",
              label: "Appointments This Week",
              color: "#2ecc71",
              bg: "rgba(46, 204, 113, 0.15)"
            },
            {
              icon: "fas fa-star",
              value: "4.8",
              label: "Average Rating",
              color: "#f1c40f",
              bg: "rgba(241, 196, 15, 0.15)"
            },
            {
              icon: "fas fa-clock",
              value: "12 min",
              label: "Average Wait Time",
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


      {/* Welcome Message & Next Appointment */}
      <motion.div
        className="row mb-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="col-lg-8 mb-4 mb-lg-0" variants={itemVariants}>
          <motion.div
            className="card shadow-sm h-100 border-0"
            whileHover={cardHover}
          >
            <div className="card-header">
              <h5 className="mb-0">Welcome back, Dr. Smith!</h5>
            </div>
            <div className="card-body">
              <p>You have <strong>{todayStats.appointments} appointments</strong> scheduled for today.
                {todayStats.completed > 0 && ` ${todayStats.completed} have been completed`}
                {todayStats.pending > 0 && ` and ${todayStats.pending} are upcoming.`}</p>

              <div className="mt-4">
                <h6 className="text-muted">NEXT APPOINTMENT</h6>
                <motion.div
                  className="d-flex align-items-center mt-3 p-3 rounded"
                  style={{ backgroundColor: '#FFF5EF' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex-grow-1">
                    <h5 className="mb-1">{nextAppointment.patientName}</h5>
                    <p className="mb-1">{nextAppointment.type}</p>
                    <span className={`badge ${nextAppointment.status === 'Confirmed' ? 'bg-success' : 'bg-warning'}`}>
                      {nextAppointment.status}
                    </span>
                  </div>
                  <div className="text-end">
                    <h4 className="mb-0" style={{ color: '#F95918' }}>{nextAppointment.time}</h4>
                    <small className="text-muted">Today</small>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div className="col-lg-4" variants={itemVariants}>
          <motion.div
            className="card shadow-sm h-100 border-0"
            whileHover={cardHover}
          >
            <div className="card-header">
              <h5 className="mb-0">Today's Summary</h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <motion.div
                  className="col-6 mb-3"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="p-3 rounded" style={{ backgroundColor: '#E8F4FF' }}>
                    <h3 className="mb-0" style={{ color: '#F95918' }}>{todayStats.appointments}</h3>
                    <small>Total Appointments</small>
                  </div>
                </motion.div>
                <motion.div
                  className="col-6 mb-3"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="p-3 rounded" style={{ backgroundColor: '#E8F4FF' }}>
                    <h3 className="mb-0" style={{ color: '#F95918' }}>${todayStats.earnings}</h3>
                    <small>Earnings</small>
                  </div>
                </motion.div>
                <motion.div
                  className="col-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="p-3 rounded" style={{ backgroundColor: '#E8F4FF' }}>
                    <h3 className="mb-0" style={{ color: '#F95918' }}>{todayStats.completed}</h3>
                    <small>Completed</small>
                  </div>
                </motion.div>
                <motion.div
                  className="col-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="p-3 rounded" style={{ backgroundColor: '#E8F4FF' }}>
                    <h3 className="mb-0" style={{ color: '#F95918' }}>{todayStats.pending}</h3>
                    <small>Upcoming</small>
                  </div>
                </motion.div>
              </div>

              {isAppointmentTime() && (
                <motion.div
                  className="mt-4 text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <button
                    className="btn btn-lg w-100"
                    style={{ backgroundColor: '#F95918', color: 'white' }}
                    onClick={handleStartCall}
                  >
                    <i className="fas fa-phone me-2"></i>Start Call Now
                  </button>
                  <small className="text-muted">Next appointment is starting soon</small>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Earnings Overview */}
      <motion.div
        className="row mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="col-12">
          <motion.div
            className="card shadow-sm border-0"
            whileHover={cardHover}
            style={{ position: "relative", overflow: "visible" }}
          >
            <div className="card-header d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
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
                          {weeklyEarnings.map((day, index) => (
                            <motion.div
                              key={index}
                              className="d-flex flex-column align-items-center"
                              style={{ flex: 1 }}
                              initial={{ height: 0 }}
                              animate={{ height: `${(day.earnings / 700) * 100}%` }}
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
                              <small className="mt-2">{day.day}</small>
                              <small className="fw-bold">${day.earnings}</small>
                            </motion.div>
                          ))}
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
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
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
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
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