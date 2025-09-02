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
    switch(action) {
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
    <div className="container-fluid" style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header Section */}
      <motion.div 
        className="row mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              <h2 style={{ color: '#F95918', fontWeight: 'bold' }}>Provider Dashboard</h2>
              <p className="text-muted">{formatDate(currentTime)} | {formatTime(currentTime)}</p>
            </div>
            <div className="d-flex align-items-center">
              <div className="me-3">
                <span className="badge bg-success">Online</span>
              </div>
              <div className="dropdown">
                <button className="btn btn-outline-secondary dropdown-toggle" type="button" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="fas fa-user-md me-2"></i>Dr. Smith
                </button>
                <ul className="dropdown-menu" aria-labelledby="profileDropdown">
                  <li>
                    <button className="dropdown-item" onClick={() => handleProfileAction('profile')}>
                      <i className="fas fa-user me-2"></i>Profile
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => handleProfileAction('settings')}>
                      <i className="fas fa-cog me-2"></i>Settings
                    </button>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={() => handleProfileAction('logout')}>
                      <i className="fas fa-sign-out-alt me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
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
            <div className="card-header" style={{ backgroundColor: '#F95918', color: 'white', border: 'none' }}>
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
            <div className="card-header" style={{ backgroundColor: '#F95918', color: 'white', border: 'none' }}>
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
            style={{ position: 'relative', overflow: 'visible' }} // Added for dropdown visibility
          >
            <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: '#F95918', color: 'white', border: 'none' }}>
              <h5 className="mb-0">Earnings Overview (This Week)</h5>
              <div>
                <span className="badge bg-light text-dark">Total: $3,020</span>
              </div>
            </div>
            <div className="card-body" style={{ position: 'relative', overflow: 'visible' }}>
              {showEarningsDetails ? (
                // Detailed earnings view
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h5>Detailed Earnings Breakdown</h5>
                  <div className="row">
                    <div className="col-md-6">
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
                    <div className="col-md-6">
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
                  <div className="row">
                    <div className="col-md-8">
                      <div className="chart-container" style={{ height: '250px' }}>
                        {/* Animated bar chart */}
                        <div className="d-flex align-items-end h-100" style={{ gap: '15px' }}>
                          {weeklyEarnings.map((day, index) => (
                            <motion.div 
                              key={index} 
                              className="d-flex flex-column align-items-center" 
                              style={{ flex: 1 }}
                              initial={{ height: 0 }}
                              animate={{ height: `${(day.earnings / 700) * 100}%` }}
                              transition={{ delay: index * 0.1 + 0.5, duration: 0.8, type: "spring" }}
                            >
                              <motion.div 
                                className="rounded" 
                                style={{ 
                                  width: '100%', 
                                  height: '100%', 
                                  backgroundColor: '#F95918',
                                  minHeight: '10px'
                                }}
                                whileHover={{ backgroundColor: '#e14a12' }}
                              ></motion.div>
                              <small className="mt-2">{day.day}</small>
                              <small className="fw-bold">${day.earnings}</small>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="d-flex justify-content-between mb-3">
                        <span>Weekly Goal:</span>
                        <span className="fw-bold">$2,800</span>
                      </div>
                      <div className="progress mb-4" style={{ height: '10px' }}>
                        <motion.div 
                          className="progress-bar" 
                          initial={{ width: 0 }}
                          animate={{ width: `${(3020 / 2800) * 100 > 100 ? 100 : (3020 / 2800) * 100}%` }}
                          transition={{ delay: 0.8, duration: 1.5 }}
                          style={{ backgroundColor: '#F95918' }}
                        ></motion.div>
                      </div>
                      
                      <motion.div 
                        className="d-flex justify-content-between mb-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 }}
                      >
                        <span><i className="fas fa-circle text-success me-2"></i>Consultations</span>
                        <span>$1,840</span>
                      </motion.div>
                      <motion.div 
                        className="d-flex justify-content-between mb-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 }}
                      >
                        <span><i className="fas fa-circle text-primary me-2"></i>Procedures</span>
                        <span>$980</span>
                      </motion.div>
                      <motion.div 
                        className="d-flex justify-content-between mb-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 }}
                      >
                        <span><i className="fas fa-circle text-warning me-2"></i>Follow-ups</span>
                        <span>$200</span>
                      </motion.div>
                    </div>
                  </div>
                  <div className="mt-4 text-center" style={{ position: 'relative', zIndex: 1000 }}>
                    <div className="dropdown d-inline-block me-2" style={{ position: 'relative', zIndex: 1001 }}>
                      <motion.button 
                        className="btn btn-outline-secondary dropdown-toggle"
                        type="button"
                        id="exportDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="fas fa-download me-2"></i>Export
                      </motion.button>
                      <ul 
                        className="dropdown-menu" 
                        aria-labelledby="exportDropdown"
                        style={{ 
                          position: 'absolute', 
                          zIndex: 1002,
                          transform: 'translate3d(0px, 38px, 0px)' 
                        }}
                      >
                        <li>
                          <button 
                            className="dropdown-item" 
                            onClick={() => setExportFormat('csv')}
                          >
                            CSV Format
                          </button>
                        </li>
                        <li>
                          <button 
                            className="dropdown-item" 
                            onClick={() => setExportFormat('pdf')}
                          >
                            PDF Format
                          </button>
                        </li>
                        <li>
                          <button 
                            className="dropdown-item" 
                            onClick={() => setExportFormat('excel')}
                          >
                            Excel Format
                          </button>
                        </li>
                      </ul>
                    </div>
                    <motion.button 
                      className="btn"
                      style={{ backgroundColor: '#F95918', color: 'white' }}
                      onClick={toggleEarningsDetails}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <i className="fas fa-chart-line me-2"></i>Details
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div 
        className="row"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="col-md-3 mb-4" variants={itemVariants}>
          <motion.div 
            className="card shadow-sm border-0 h-100"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
            }}
          >
            <div className="card-body text-center">
              <motion.div 
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '60px', height: '60px', backgroundColor: 'rgba(249, 89, 24, 0.1)' }}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <i className="fas fa-user-injured fa-lg" style={{ color: '#F95918' }}></i>
              </motion.div>
              <h4 style={{ color: '#F95918' }}>142</h4>
              <p className="text-muted mb-0">Total Patients</p>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div className="col-md-3 mb-4" variants={itemVariants}>
          <motion.div 
            className="card shadow-sm border-0 h-100"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
            }}
          >
            <div className="card-body text-center">
              <motion.div 
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '60px', height: '60px', backgroundColor: 'rgba(249, 89, 24, 0.1)' }}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <i className="fas fa-calendar-check fa-lg" style={{ color: '#F95918' }}></i>
              </motion.div>
              <h4 style={{ color: '#F95918' }}>28</h4>
              <p className="text-muted mb-0">Appointments This Week</p>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div className="col-md-3 mb-4" variants={itemVariants}>
          <motion.div 
            className="card shadow-sm border-0 h-100"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
            }}
          >
            <div className="card-body text-center">
              <motion.div 
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '60px', height: '60px', backgroundColor: 'rgba(249, 89, 24, 0.1)' }}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <i className="fas fa-star fa-lg" style={{ color: '#F95918' }}></i>
              </motion.div>
              <h4 style={{ color: '#F95918' }}>4.8</h4>
              <p className="text-muted mb-0">Average Rating</p>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div className="col-md-3 mb-4" variants={itemVariants}>
          <motion.div 
            className="card shadow-sm border-0 h-100"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
            }}
          >
            <div className="card-body text-center">
              <motion.div 
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '60px', height: '60px', backgroundColor: 'rgba(249, 89, 24, 0.1)' }}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <i className="fas fa-clock fa-lg" style={{ color: '#F95918' }}></i>
              </motion.div>
              <h4 style={{ color: '#F95918' }}>12 min</h4>
              <p className="text-muted mb-0">Average Wait Time</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bootstrap JS for dropdown functionality */}
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    </div>
  );
};

export default ProviderDashboard;