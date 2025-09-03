import React, { useState, useEffect } from 'react';

const ProviderMyAppointments = () => {
  // Sample appointment data
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      dateTime: '2023-10-15 09:30 AM',
      patientName: 'John Smith',
      status: 'Confirmed',
      paymentStatus: 'Paid',
      notes: ''
    },
    {
      id: 2,
      dateTime: '2023-10-16 11:00 AM',
      patientName: 'Emily Johnson',
      status: 'Confirmed',
      paymentStatus: 'Pending',
      notes: ''
    },
    {
      id: 3,
      dateTime: '2023-10-17 02:15 PM',
      patientName: 'Michael Brown',
      status: 'Completed',
      paymentStatus: 'Paid',
      notes: 'Patient reported improvement in symptoms.'
    },
    {
      id: 4,
      dateTime: '2023-10-18 10:45 AM',
      patientName: 'Sarah Williams',
      status: 'Scheduled',
      paymentStatus: 'Pending',
      notes: ''
    }
  ]);

  const [showNotesModal, setShowNotesModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [notesText, setNotesText] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [animateHeader, setAnimateHeader] = useState(false);
  const [buttonAnimations, setButtonAnimations] = useState({});

  useEffect(() => {
    // Header animation on component mount
    setAnimateHeader(true);

    // Remove animation after it completes
    const timer = setTimeout(() => setAnimateHeader(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter appointments based on status and search term
  const filteredAppointments = appointments.filter(appointment => {
    const matchesFilter = filter === 'all' || appointment.status.toLowerCase() === filter;
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.dateTime.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Handle starting a call with animation
  const handleStartCall = (appointment) => {
    // Set animation for this button
    setButtonAnimations({ ...buttonAnimations, [`call-${appointment.id}`]: true });

    // Remove animation after it completes
    setTimeout(() => {
      setButtonAnimations({ ...buttonAnimations, [`call-${appointment.id}`]: false });
      alert(`Starting call with ${appointment.patientName}`);
    }, 300);
  };

  // Handle canceling an appointment with animation
  const handleCancel = (appointmentId) => {
    // Set animation for this button
    setButtonAnimations({ ...buttonAnimations, [`cancel-${appointmentId}`]: true });

    // Remove animation after it completes
    setTimeout(() => {
      setButtonAnimations({ ...buttonAnimations, [`cancel-${appointmentId}`]: false });
      if (window.confirm('Are you sure you want to cancel this appointment?')) {
        // Animate row removal
        const updatedAppointments = appointments.filter(apt => apt.id !== appointmentId);
        setAppointments(updatedAppointments);
      }
    }, 300);
  };

  // Handle opening the notes modal with animation
  const handleAddNotes = (appointment) => {
    // Set animation for this button
    setButtonAnimations({ ...buttonAnimations, [`notes-${appointment.id}`]: true });

    // Remove animation after it completes
    setTimeout(() => {
      setButtonAnimations({ ...buttonAnimations, [`notes-${appointment.id}`]: false });
      setCurrentAppointment(appointment);
      setNotesText(appointment.notes || '');
      setShowNotesModal(true);
    }, 300);
  };

  // Handle saving notes
  const handleSaveNotes = () => {
    setAppointments(appointments.map(apt =>
      apt.id === currentAppointment.id
        ? { ...apt, notes: notesText }
        : apt
    ));
    setShowNotesModal(false);
  };

  // Format status badge
  const getStatusBadge = (status) => {
    let className = 'badge ';
    switch (status) {
      case 'Confirmed':
        className += 'bg-primary';
        break;
      case 'Completed':
        className += 'bg-success';
        break;
      case 'Cancelled':
        className += 'bg-danger';
        break;
      case 'Scheduled':
        className += 'bg-info text-dark';
        break;
      default:
        className += 'bg-secondary';
    }
    return <span className={className}>{status}</span>;
  };

  // Format payment status badge
  const getPaymentBadge = (status) => {
    let className = 'badge ';
    switch (status) {
      case 'Paid':
        className += 'bg-success';
        break;
      case 'Pending':
        className += 'bg-warning text-dark';
        break;
      default:
        className += 'bg-secondary';
    }
    return <span className={className}>{status}</span>;
  };

  return (
    <div className="">
      <div className="">
        <h3 className="fw-bold">My Appointment</h3>
        <p className="text-muted mb-0">Manage your patient appointments and consultations</p>
      </div>
      <div className="card shadow-lg border-0">
        <div className="card-body">
          {/* Search and Filter Controls */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-transparent">
                  <i className="fas fa-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-6 mt-3">
              <div className="d-flex flex-wrap justify-content-md-end gap-2">
                <button
                  className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'} animate__animated ${filter === 'all' ? 'animate__pulse' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button
                  className={`btn btn-sm ${filter === 'scheduled' ? 'btn-info text-white' : 'btn-outline-info'} animate__animated ${filter === 'scheduled' ? 'animate__pulse' : ''}`}
                  onClick={() => setFilter('scheduled')}
                >
                  Scheduled
                </button>
                <button
                  className={`btn btn-sm ${filter === 'confirmed' ? 'btn-primary' : 'btn-outline-primary'} animate__animated ${filter === 'confirmed' ? 'animate__pulse' : ''}`}
                  onClick={() => setFilter('confirmed')}
                >
                  Confirmed
                </button>
                <button
                  className={`btn btn-sm ${filter === 'completed' ? 'btn-success' : 'btn-outline-success'} animate__animated ${filter === 'completed' ? 'animate__pulse' : ''}`}
                  onClick={() => setFilter('completed')}
                >
                  Completed
                </button>
              </div>
            </div>
          </div>

          {/* Appointments Table */}
          <div className="table-responsive rounded">
            <table className="table table-hover align-middle">
              <thead>
                <tr style={{ backgroundColor: '#F95918', color: 'white' }}>
                  <th className="ps-4">
                    <i className="fas fa-clock me-1"></i>
                    Date/Time
                  </th>
                  <th>
                    <i className="fas fa-user me-1"></i>
                    Patient Name
                  </th>
                  <th>
                    <i className="fas fa-info-circle me-1"></i>
                    Status
                  </th>
                  <th>
                    <i className="fas fa-money-bill-wave me-1"></i>
                    Payment Status
                  </th>
                  <th className="text-center pe-4">
                    <i className="fas fa-cogs me-1"></i>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment, index) => (
                  <tr
                    key={appointment.id}
                    className="animate__animated animate__fadeIn"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <td className="ps-4">
                      <div className="d-flex align-items-center">
                        <i className="far fa-calendar-alt text-muted me-2"></i>
                        <span>{appointment.dateTime}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center me-2 animate__animated animate__bounceIn"
                          style={{
                            width: '36px',
                            height: '36px',
                            backgroundColor: '#F95918',
                            color: 'white',
                            animationDelay: `${index * 0.2}s`
                          }}
                        >
                          {appointment.patientName.charAt(0)}
                        </div>
                        <span>{appointment.patientName}</span>
                      </div>
                    </td>
                    <td>{getStatusBadge(appointment.status)}</td>
                    <td>{getPaymentBadge(appointment.paymentStatus)}</td>
                    <td className="pe-4">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className={`btn text-white btn-sm ${buttonAnimations[`call-${appointment.id}`] ? 'animate__animated animate__pulse' : ''}`}
                          style={{ backgroundColor: '#F95918' }}
                          onClick={() => handleStartCall(appointment)}
                          disabled={appointment.status !== 'Confirmed' && appointment.status !== 'Scheduled'}
                        >
                          <i className="fas fa-video me-1"></i>
                          Start Call
                        </button>
                        <button
                          className={`btn btn-outline-danger btn-sm ${buttonAnimations[`cancel-${appointment.id}`] ? 'animate__animated animate__shakeX' : ''}`}
                          onClick={() => handleCancel(appointment.id)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                        <button
                          className={`btn btn-outline-secondary btn-sm ${buttonAnimations[`notes-${appointment.id}`] ? 'animate__animated animate__rubberBand' : ''}`}
                          onClick={() => handleAddNotes(appointment)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredAppointments.length === 0 && (
              <div className="text-center py-5 animate__animated animate__fadeIn">
                <i className="far fa-calendar-times display-4 text-muted mb-3"></i>
                <p className="text-muted">No appointments found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notes Modal */}
      <div className={`modal fade ${showNotesModal ? 'show d-block' : ''}`} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered animate__animated animate__zoomIn">
          <div className="modal-content">
            <div className="modal-header" >
              <h5 className="modal-title">
                <i className="fas fa-edit me-2"></i>
                Consultation Notes
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowNotesModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3 p-3 bg-light rounded">
                <p className="mb-1"><strong>Patient:</strong> {currentAppointment?.patientName}</p>
                <p className="mb-0"><strong>Date/Time:</strong> {currentAppointment?.dateTime}</p>
              </div>
              <textarea
                className="form-control"
                rows="5"
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Enter your notes about this consultation..."
                autoFocus
              ></textarea>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowNotesModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn text-white animate__animated animate__pulse animate__infinite"
                style={{ backgroundColor: '#F95918', animationDuration: '2s' }}
                onClick={handleSaveNotes}
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Backdrop */}
      {showNotesModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default ProviderMyAppointments;