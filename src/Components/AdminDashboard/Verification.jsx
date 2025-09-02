import React, { useState } from 'react';

const Verification = () => {
  // Sample data for doctors awaiting approval
  const [doctors, setDoctors] = useState([
    { 
      id: 1, 
      name: 'Dr. Sarah Wilson', 
      email: 'sarah@example.com', 
      specialty: 'Cardiology', 
      license: 'MD12345',
      signupDate: '2023-10-15',
      experience: '8 years',
      documents: ['medical_license.pdf', 'id_proof.pdf']
    },
    { 
      id: 2, 
      name: 'Dr. James Miller', 
      email: 'james@example.com', 
      specialty: 'Pediatrics', 
      license: 'MD67890',
      signupDate: '2023-10-18',
      experience: '5 years',
      documents: ['medical_certificate.pdf', 'resume.pdf']
    },
    { 
      id: 3, 
      name: 'Dr. Lisa Taylor', 
      email: 'lisa@example.com', 
      specialty: 'Dermatology', 
      license: 'MD54321',
      signupDate: '2023-10-20',
      experience: '10 years',
      documents: ['license_copy.pdf', 'degree_certificate.pdf']
    },
    { 
      id: 4, 
      name: 'Dr. David Clark', 
      email: 'david@example.com', 
      specialty: 'Orthopedics', 
      license: 'MD09876',
      signupDate: '2023-10-22',
      experience: '7 years',
      documents: ['certification.pdf', 'id_card.pdf']
    }
  ]);

  // Function to handle approval of a doctor
  const handleApprove = (doctorId) => {
    setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
    // In a real application, you would also update the backend
  };

  // Function to handle rejection of a doctor
  const handleReject = (doctorId) => {
    setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
    // In a real application, you would also update the backend
  };

  // Function to view documents (would typically open a modal or new tab)
  const viewDocuments = (documents) => {
    alert(`Documents available: ${documents.join(', ')}\n\nIn a real application, this would open a document viewer.`);
  };

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
        <h1 className="h3 mb-0" style={{ color: '#F95918' }}>Verification</h1>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="#" style={{ color: '#F95918' }}>Home</a></li>
            <li className="breadcrumb-item active" aria-current="page">Verification</li>
          </ol>
        </nav>
      </div>

      {/* Info Card */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm" style={{ borderLeft: `4px solid #F95918` }}>
            <div className="card-body">
              <h5 className="card-title" style={{ color: '#F95918' }}>Pending Verifications</h5>
              <p className="card-text">
                This section displays doctors who have signed up but not been approved yet. 
                Review their information and documents before approving or rejecting their application.
              </p>
              <p className="card-text mb-0">
                <strong>Total pending verifications:</strong> {doctors.length} doctors
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Doctors Table */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header" style={{ backgroundColor: '#F95918', color: 'white' }}>
              <h5 className="mb-0">Doctors Awaiting Approval</h5>
            </div>
            <div className="card-body">
              {doctors.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
                  <h5>All doctors have been verified!</h5>
                  <p className="text-muted">There are no pending verification requests.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover" width="100%" cellSpacing="0">
                    <thead>
                      <tr>
                        <th>Doctor ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Specialty</th>
                        <th>License No.</th>
                        <th>Signup Date</th>
                        <th>Experience</th>
                        <th>Documents</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctors.map(doctor => (
                        <tr key={doctor.id}>
                          <td>#{doctor.id}</td>
                          <td>
                            <strong>{doctor.name}</strong>
                          </td>
                          <td>{doctor.email}</td>
                          <td>
                            <span className="badge bg-secondary">{doctor.specialty}</span>
                          </td>
                          <td>{doctor.license}</td>
                          <td>{doctor.signupDate}</td>
                          <td>{doctor.experience}</td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => viewDocuments(doctor.documents)}
                            >
                              <i className="fas fa-file-alt me-1"></i> View Documents
                            </button>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button 
                                className="btn btn-sm flex-fill"
                                style={{ backgroundColor: '#F95918', color: 'white' }}
                                onClick={() => handleApprove(doctor.id)}
                              >
                                <i className="fas fa-check me-1"></i> Approve
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger flex-fill"
                                onClick={() => handleReject(doctor.id)}
                              >
                                <i className="fas fa-times me-1"></i> Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white text-center shadow">
            <div className="card-body">
              <h5 className="card-title">Total Verified</h5>
              <h2 className="card-text">42</h2>
              <p className="card-text">Doctors</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-warning text-dark text-center shadow">
            <div className="card-body">
              <h5 className="card-title">Pending Verification</h5>
              <h2 className="card-text">{doctors.length}</h2>
              <p className="card-text">Doctors</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-danger text-white text-center shadow">
            <div className="card-body">
              <h5 className="card-title">Rejected</h5>
              <h2 className="card-text">8</h2>
              <p className="card-text">Applications</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;