import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [viewMode, setViewMode] = useState('week'); // 'week', 'month', 'day'
  const [availability, setAvailability] = useState({
    monday: { start: '09:00', end: '17:00', available: true },
    tuesday: { start: '09:00', end: '17:00', available: true },
    wednesday: { start: '09:00', end: '17:00', available: true },
    thursday: { start: '09:00', end: '17:00', available: true },
    friday: { start: '09:00', end: '16:00', available: true },
    saturday: { start: '10:00', end: '14:00', available: false },
    sunday: { start: '10:00', end: '14:00', available: true }
  });

  // Sample appointments data
  const appointments = [
    { id: 1, date: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 9, 0), patient: 'Sarah Johnson', type: 'Follow-up' },
    { id: 2, date: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 14, 30), patient: 'Michael Chen', type: 'Consultation' },
    { id: 3, date: new Date(new Date().getFullYear(), new Date().getMonth(), 16, 10, 15), patient: 'Emma Rodriguez', type: 'Check-up' },
    { id: 4, date: new Date(new Date().getFullYear(), new Date().getMonth(), 17, 8, 30), patient: 'David Wilson', type: 'Therapy' },
    { id: 5, date: new Date(new Date().getFullYear(), new Date().getMonth(), 17, 11, 0), patient: 'James Miller', type: 'Consultation' },
    { id: 6, date: new Date(new Date().getFullYear(), new Date().getMonth(), 17, 15, 45), patient: 'Robert Brown', type: 'Follow-up' },
    { id: 7, date: new Date(new Date().getFullYear(), new Date().getMonth(), 18, 9, 30), patient: 'Mary Williams', type: 'Check-up' },
    { id: 8, date: new Date(new Date().getFullYear(), new Date().getMonth(), 18, 13, 0), patient: 'Patricia Jones', type: 'Consultation' },
    { id: 9, date: new Date(new Date().getFullYear(), new Date().getMonth(), 19, 10, 0), patient: 'Jennifer Garcia', type: 'Therapy' },
    { id: 10, date: new Date(new Date().getFullYear(), new Date().getMonth(), 20, 11, 30), patient: 'Linda Martinez', type: 'Check-up' },
    { id: 11, date: new Date(new Date().getFullYear(), new Date().getMonth(), 20, 16, 15), patient: 'Elizabeth Davis', type: 'Follow-up' },
  ];

  // Get appointments for a specific date
  const getAppointmentsForDate = (date) => {
    return appointments.filter(app => 
      app.date.getDate() === date.getDate() && 
      app.date.getMonth() === date.getMonth() && 
      app.date.getFullYear() === date.getFullYear()
    );
  };

  // Generate days for the current week based on currentDate
  const generateWeekDays = () => {
    const startDate = new Date(currentDate);
    const dayOfWeek = startDate.getDay(); // 0 = Sunday
    startDate.setDate(startDate.getDate() - dayOfWeek); // Start from Sunday of this week
    
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    
    return days;
  };

  const weekDays = generateWeekDays();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const handleAvailabilityChange = (day, field, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const toggleDayAvailability = (day) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        available: !prev[day].available
      }
    }));
  };

  const saveAvailability = () => {
    // In a real app, you would save this to your backend
    console.log('Saving availability:', availability);
    setShowAvailabilityModal(false);
    alert('Availability saved successfully!');
  };

  // Check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  // Animation variants
  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: '#2c3e50' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', borderBottom: '2px solid #e9ecef', padding: '1rem 0' }}>
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col">
              <span style={{ color: '#2c3e50', fontWeight: '700', fontSize: '1.5rem' }}>
                Medi<span style={{ color: '#f9591a' }}>Calendar</span>
              </span>
            </div>
            <div className="col-auto">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <span className="text-secondary">Dr. Jane Smith</span>
                </div>
                <div>
                  <button className="btn rounded-circle border" style={{ width: '40px', height: '40px' }}>
                    <i className="fas fa-user"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1400px', margin: '2rem auto', padding: '0 15px' }}>
        {/* Calendar Controls */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', marginBottom: '1.5rem', border: 'none', padding: '1.5rem' }}>
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <h1 style={{ color: '#2c3e50', fontWeight: '700', marginBottom: '0' }}>My Calendar</h1>
            <div className="d-flex gap-2 mt-2 mt-md-0">
              <motion.button 
                className="btn"
                style={{ backgroundColor: 'transparent', color: '#f9591a', border: '1px solid #f9591a', padding: '0.5rem 1.25rem', borderRadius: '6px', fontWeight: '600' }}
                whileHover={{ backgroundColor: '#ffefe8' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateWeek('prev')}
              >
                <i className="fas fa-chevron-left me-1"></i> Previous
              </motion.button>
              <motion.button 
                className="btn"
                style={{ backgroundColor: 'transparent', color: '#f9591a', border: '1px solid #f9591a', padding: '0.5rem 1.25rem', borderRadius: '6px', fontWeight: '600' }}
                whileHover={{ backgroundColor: '#ffefe8' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </motion.button>
              <motion.button 
                className="btn"
                style={{ backgroundColor: 'transparent', color: '#f9591a', border: '1px solid #f9591a', padding: '0.5rem 1.25rem', borderRadius: '6px', fontWeight: '600' }}
                whileHover={{ backgroundColor: '#ffefe8' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateWeek('next')}
              >
                Next <i className="fas fa-chevron-right ms-1"></i>
              </motion.button>
              <motion.button 
                className="btn ms-2"
                style={{ backgroundColor: '#f9591a', color: 'white', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '6px', fontWeight: '600' }}
                whileHover={{ backgroundColor: '#e04a12', scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAvailabilityModal(true)}
              >
                <i className="fas fa-clock me-1"></i> Set Availability
              </motion.button>
            </div>
          </div>
          
          <div className="row mt-3">
            <div className="col-md-8">
              <h3 className="mb-0">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
              <p className="text-muted mb-0">View and manage your appointments</p>
            </div>
            <div className="col-md-4 text-md-end mt-2 mt-md-0">
              <div className="btn-group">
                <button 
                  className={`btn ${viewMode === 'week' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                  onClick={() => setViewMode('week')}
                >
                  Week
                </button>
                <button 
                  className={`btn ${viewMode === 'month' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                  onClick={() => setViewMode('month')}
                >
                  Month
                </button>
                <button 
                  className={`btn ${viewMode === 'day' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                  onClick={() => setViewMode('day')}
                >
                  Day
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', marginBottom: '1.5rem', border: 'none', overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(135deg, #f9591a 0%, #e04a12 100%)', color: 'white', padding: '1.25rem 1.5rem' }}>
            <h2 className="mb-0"><i className="fas fa-calendar-alt me-2"></i>Calendar View - {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}</h2>
          </div>
          <div style={{ padding: '1.5rem' }}>
            {/* Week Header */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '12px', textAlign: 'center' }}>
              {dayNames.map(day => (
                <div key={day} style={{ padding: '0.75rem', backgroundColor: '#ffefe8', borderRadius: '6px', fontWeight: '600', color: '#2c3e50' }}>
                  {day.substring(0, 3)}
                </div>
              ))}
            </div>
            
            {/* Week Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
              {weekDays.map((date, index) => {
                const dayAppointments = getAppointmentsForDate(date);
                return (
                  <motion.div 
                    key={index}
                    style={{ 
                      minHeight: '120px', 
                      border: '1px solid #e9ecef',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      backgroundColor: 'white',
                      ...(isToday(date) && {
                        backgroundColor: '#ffefe8',
                        border: '2px solid #f9591a'
                      })
                    }}
                    whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(0,0,0,0.08)" }}
                  >
                    <div style={{ 
                      fontWeight: '700', 
                      marginBottom: '0.75rem', 
                      color: isToday(date) ? '#f9591a' : '#2c3e50',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>{date.getDate()}</span>
                      {isToday(date) && (
                        <span style={{ fontSize: '0.7rem', backgroundColor: '#f9591a', color: 'white', padding: '2px 6px', borderRadius: '10px' }}>
                          Today
                        </span>
                      )}
                    </div>
                    
                    {/* Appointment Indicators */}
                    <div>
                      {dayAppointments.slice(0, 3).map(app => (
                        <motion.div 
                          key={app.id}
                          style={{ 
                            backgroundColor: '#e8f4ff',
                            borderLeft: '3px solid #2c7be5',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            marginBottom: '0.5rem',
                            fontSize: '0.85rem'
                          }}
                          whileHover={{ backgroundColor: '#d4e7ff' }}
                        >
                          <div style={{ fontWeight: '600', color: '#2c7be5', marginBottom: '0.15rem' }}>
                            {app.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div style={{ color: '#2c3e50', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {app.patient}
                          </div>
                        </motion.div>
                      ))}
                      {dayAppointments.length > 3 && (
                        <div className="text-center mt-1">
                          <span className="badge bg-light text-dark">
                            +{dayAppointments.length - 3} more
                          </span>
                        </div>
                      )}
                      {dayAppointments.length === 0 && (
                        <div className="text-center text-muted mt-3" style={{ fontSize: '0.8rem' }}>
                          <i className="fas fa-umbrella-beach mb-1"></i>
                          <p>No appointments</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Availability Modal */}
      <AnimatePresence>
        {showAvailabilityModal && (
          <motion.div 
            className="modal-backdrop show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1040 }}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => setShowAvailabilityModal(false)}
          >
            <motion.div 
              className="modal-dialog modal-dialog-centered"
              style={{ maxWidth: '600px' }}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content" style={{ borderRadius: '12px', border: 'none', boxShadow: '0 5px 25px rgba(0,0,0,0.15)' }}>
                <div className="modal-header" style={{ backgroundColor: '#ffefe8', borderBottom: '2px solid #f9591a', padding: '1rem 1.5rem', borderRadius: '12px 12px 0 0' }}>
                  <h5 className="modal-title" style={{ color: '#2c3e50', fontWeight: '700', fontSize: '1.25rem' }}>
                    <i className="fas fa-clock me-2"></i>Set Weekly Availability
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowAvailabilityModal(false)} aria-label="Close"></button>
                </div>
                <div className="modal-body" style={{ padding: '1.5rem' }}>
                  <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>Set your regular working hours for each day. Patients will be able to book appointments during available time slots.</p>
                  
                  <div className="row g-2">
                    {Object.entries(availability).map(([day, config]) => (
                      <div key={day} className="col-12">
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          padding: '0.75rem', 
                          border: '1px solid #e9ecef', 
                          borderRadius: '8px', 
                          backgroundColor: config.available ? '#f8f9fa' : '#f8f9fa',
                          opacity: config.available ? 1 : 0.7
                        }}>
                          <div style={{ minWidth: '90px', fontWeight: '600', color: '#2c3e50', textTransform: 'capitalize', fontSize: '0.9rem' }}>
                            {day}
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                            <input
                              type="time"
                              className="form-control form-control-sm"
                              value={config.start}
                              onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                              disabled={!config.available}
                              style={{ padding: '0.3rem', border: '1px solid #e9ecef', borderRadius: '4px', fontSize: '0.8rem', width: '80px' }}
                            />
                            <span style={{ margin: '0 0.25rem', fontWeight: '600', fontSize: '0.8rem' }}>to</span>
                            <input
                              type="time"
                              className="form-control form-control-sm"
                              value={config.end}
                              onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                              disabled={!config.available}
                              style={{ padding: '0.3rem', border: '1px solid #e9ecef', borderRadius: '4px', fontSize: '0.8rem', width: '80px' }}
                            />
                          </div>
                          
                          <div className="form-check form-switch ms-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              checked={config.available}
                              onChange={() => toggleDayAvailability(day)}
                              style={{ backgroundColor: config.available ? '#f9591a' : '', borderColor: '#f9591a' }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="modal-footer" style={{ borderTop: '1px solid #e9ecef', padding: '1rem 1.5rem', borderRadius: '0 0 12px 12px' }}>
                  <motion.button 
                    type="button" 
                    className="btn btn-sm"
                    style={{ backgroundColor: 'transparent', color: '#6c757d', border: '1px solid #6c757d', padding: '0.4rem 1rem', borderRadius: '6px', fontWeight: '500' }}
                    whileHover={{ backgroundColor: '#f8f9fa', scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAvailabilityModal(false)}
                  >
                    Cancel
                  </motion.button>
                  <motion.button 
                    type="button" 
                    className="btn btn-sm"
                    style={{ backgroundColor: '#f9591a', color: 'white', border: 'none', padding: '0.5rem 1.25rem', borderRadius: '6px', fontWeight: '500' }}
                    whileHover={{ backgroundColor: '#e04a12', scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={saveAvailability}
                  >
                    Save Changes
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyCalendar;